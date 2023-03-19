import { ConnectWallet, ChainId, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import { Proposal } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo, FormEvent } from "react";
import { AddressZero } from "@ethersproject/constants";

const Home: NextPage = () => {
  const address = useAddress()
  const [network, switchNetwork] = useNetwork()
  const editionDrop = useContract("0x5343a3EC218Da8208fE4F7DaE9d08BbD26ecE869", "edition-drop").contract
  const token = useContract("0x30Bf07924F01992844c201D01a279AD20f3095b3", "token").contract
  const vote = useContract("0x2158b23ABda3962B8a7c7C9be909dB2d848bfda9", "vote").contract
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [memberTokenAmoounts, setMemberTokenAmoounts] = useState<any>([])
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)


  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4)
  }

  useEffect(() => {
    if (!hasClaimedNFT) return;

    const getAllProposals = async () => {
      try {
        const proposals = await vote!.getAll();
        setProposals(proposals);
        console.log("setProposals : " + proposals)
      } catch (error) {
        console.error(error)
      }
    }
    getAllProposals()
  }, [hasClaimedNFT, vote])

  useEffect(() => {
    if (!hasClaimedNFT) return;
    if (!proposals.length) return;

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote!.hasVoted(proposals[0].proposalId.toString(), address)
        setHasVoted(hasVoted)
        console.log("setHasVoted : " + hasVoted)
        if (hasVoted) {
          console.log("User has already voted")
        } else {
          console.log("User has not voted yet")
        }
      } catch (error) {
        console.error(error)
      }
    }
    checkIfUserHasVoted()
  }, [hasClaimedNFT, proposals, vote, address])


  useEffect(() => {
    if (!hasClaimedNFT) return;

    const getAllAddress = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
          0
        );
        console.log("memberAddresses : ", memberAddresses)
        setMemberAddresses(memberAddresses)
      } catch (error) {
        console.error(error)
      }
    }

    getAllAddress()
  }, [hasClaimedNFT, editionDrop])

  useEffect(() => {
    if (!hasClaimedNFT) return

    const getAllBalanaces = async () => {
      try {
        const ammounts = await token?.history.getAllHolderBalances();
        console.log("memberTokenAmoounts : ", ammounts)
        setMemberTokenAmoounts(ammounts)
      } catch (error) {
        console.error(error)
      }
    }
    getAllBalanaces()
  }, [hasClaimedNFT, token])


  useEffect(() => {
    if (!address) return;

    const checkBalance = async () => {
      try {
        const balance = await editionDrop?.balanceOf(address, 0)
        if (balance?.gt(0)) {
          setHasClaimedNFT(true);
          console.log("Have!")
        } else {
          setHasClaimedNFT(false);
          console.log("Not Have!")
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error(error)
      }
    }

    checkBalance()
  }, [address, editionDrop])


  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      const member = memberTokenAmoounts.find(({ holder }: { holder: string }) => holder === address)

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }

    })

  }, [memberAddresses, memberTokenAmoounts])

  const mintNft = async () => {
    try {
      setIsClaiming(true)
      await editionDrop!.claim("0", 1)
      console.log(`Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`)
      setHasClaimedNFT(true)
    } catch (error) {
      setHasClaimedNFT(false)
      console.error(error)
    } finally {
      setIsClaiming(false)
    }
  }

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsVoting(true)

    const votes = proposals.map((proposal) => {
      const voteResult = {
        proposalId: proposal.proposalId,
        vote: 2
      }
      proposal.votes.forEach((vote) => {
        const elem = document.getElementById(
          proposal.proposalId + "-" + vote.type
        ) as HTMLInputElement

        if (elem!.checked) {
          voteResult.vote = vote.type
          return
        }
      })
      return voteResult
    })

    try {
      const delegation = await token!.getDelegationOf(address!);
      if (delegation === AddressZero) {
        await token!.delegateTo(address!);
      }

      try {
        await Promise.all(
          votes.map(async ({ proposalId, vote: _vote }) => {
            const proposal = await vote!.get(proposalId)
            if (proposal.state === 1) {
              return vote!.vote(proposalId.toString(), _vote)
            }
            return
          })
        )
        try {
          await Promise.all(
            votes.map(async ({ proposalId }) => {
              const proposal = await vote!.get(proposalId)

              if (proposal.state === 4) {
                return vote!.execute(proposalId.toString())
              }
            })
          )

          setHasVoted(true)
          console.log("successfully voted!")
        } catch (error) {
          console.error(error)
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsVoting(false)
    }
  }

  if (!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to Enjoy Hack Team DAO!
          </h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  } else if (address && network && network?.data?.chain?.id !== ChainId.Goerli) {
    console.log(`wallet Address : ${address}`)
    console.log(`network Id : ${network?.data?.chain?.id}`)

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Please switch to Goerli.</h1>
          <p>This app only works on the Goerli network.</p>
          <p>Switch the network you are connected to from your wallet.</p>
        </main>
      </div>
    )
  } else if (hasClaimedNFT) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>🍪DAO Member Page</h1>
          <p>Congratulations on being a member</p>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList!.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>■Active Proposal </h2>
            <form onSubmit={(e) => onSubmitHandler(e)}>
              {proposals.map((proposal) => (
                <div key={proposal.proposalId.toString()} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId.toString()}
                          value={type}
                          // デフォルトで棄権票をチェックする
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p></p>
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              <p></p>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </main>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your FREE 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Minting now..." : "Mint your nft (FREE)"}
          </button>
        </main>
      </div>
    )
  }
};

export default Home;
