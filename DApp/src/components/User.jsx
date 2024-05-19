import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Web3 from 'web3';
import GridLoader from "react-spinners/GridLoader";
import "../css/user.css";

export default function User() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [userTicketsList, setUserTicketsList] = useState([]);

  const [stateUpdate, setStateUpdate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState(null);
  const [userSupply, setUserSupply] = useState(0);
  const [buyEvent, setBuyEvent] = useState({eventId:"", number: 0, tokens: 0});


  const contractAddress  = "0xcB6d501905Ee8C9Ce1DfD1DAd72F2688895BD0B9";
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketsAvailable",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "EventCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "EventRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "purchaser",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketsBought",
          "type": "uint256"
        }
      ],
      "name": "TicketsPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fromEventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "toEventId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketsTransferred",
          "type": "uint256"
        }
      ],
      "name": "TicketsTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rewardLimit",
          "type": "uint256"
        }
      ],
      "name": "changeRewardLimit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_ticketsAvailable",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "createEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_eventId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_ticketsToBuy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokensPay",
          "type": "uint256"
        }
      ],
      "name": "purchaseTickets",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_eventId",
          "type": "uint256"
        }
      ],
      "name": "removeEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_eventId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "setEventStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawToOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "events",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "ticketsAvailable",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEventList",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "eventId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "ticketsAvailable",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct TicketingSystem.EventInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalSupplyUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUsersTickets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "eventId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "ticketsOwned",
              "type": "uint256"
            }
          ],
          "internalType": "struct TicketingSystem.UserTickets[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  useEffect(() => {

    async function fetchInfo() {
        const contract = new ethers.Contract(contractAddress, abi, provider); // Instantiate the contract
        const signer = await new ethers.BrowserProvider(window.ethereum).getSigner(); // Assumes Metamask or similar is injected in the browser
        const weiValue = await new ethers.BrowserProvider(window.ethereum).getBalance(signer.address);
        const contractWithSigner = contract.connect(await signer);
        setContract(contract);
        setAccount(signer);
        setBalance(weiValue.toString());
        setContractWithSigner(contractWithSigner);
        
        const eventListD = await contractWithSigner.getEventList();
        setEventList(JSON.parse(JSON.stringify(eventListD, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value // return everything else unchanged
        )));
        const ticketsList = await contractWithSigner.getUsersTickets();
        setUserTicketsList(JSON.parse(JSON.stringify(ticketsList, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value // return everything else unchanged
        )));
        try{
          const userSup = await contractWithSigner.getTotalSupplyUser();
          setUserSupply(userSup.toString());
        }catch(err){
          console.log(err)
        }
    }

    async function listenMMAccount() {
      window.ethereum.on("accountsChanged", async function() {
        fetchInfo()
      });
    }

    if (typeof window !== "undefined") {
      if (window.ethereum) {
          const providerr = new ethers.BrowserProvider(window.ethereum);
          setProvider(providerr); 
          fetchInfo();
          listenMMAccount();

      } else {
          console.error("Please install MetaMask!");
          alert("Please install MetaMask!")
      }
    }
    setLoading(false);
  },[stateUpdate]);

  const weiToEther = (wei) =>{
    return Web3.utils.fromWei(wei, 'ether');
  }

  const updateForm = (e) =>{
    setBuyEvent((prevEvent => ({
      ...prevEvent,
      [e.target.name]: e.target.value
    })));
  }

  const buy = async (e) =>{
    setLoading(true);
    e.preventDefault()
    /* do validations */
    const eventPrice = eventList.find((x)=>x[0]==buyEvent.eventId)
    const cost = buyEvent.number *eventPrice[3];
    console.log(cost)
    // try{
    //   const createEv = await contractWithSigner.purchaseTickets(buyEvent.eventId, buyEvent.number, buyEvent.tokens).send({
    //     from: account,
    //     value: web3.utils.toWei('1', 'ether'), // Sending 1 Ether
    // });
    //   await createEv.wait()
    // }catch(err){
    //   console.log(err)
    // }
    setStateUpdate(stateUpdate+1);
    setLoading(false);
  }

  return (
    <>
      {
          loading
          ?<GridLoader
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          :
          <>
            <div className='info'>
                <div className='infoDetail'>Your account is {account && account.address}</div>
                <div className='infoDetail'>{balance && balance} wei  or {balance && weiToEther(balance)} ether</div>
            </div>
            <hr />
            <div className='eventSection'>
              <div className='eventsList'>
                <div className='subTitle'>Event List</div>
                <div className='eventRow'>
                  <div className='eventCol'>Event Id</div> <div className='eventCol'>Name</div> <div className='eventCol'>Available Tickets</div> <div className='eventCol'>Price (ether)</div> 
                </div>
                {eventList.map((ev, key)=>{
                  {
                    if(ev[4]){
                      return <div className='eventRow' key={key}>
                                <div className='eventCol'>{ev[0]}</div> <div className='eventCol'>{ev[1]}</div> <div className='eventCol'>{ev[2]}</div> <div className='eventCol'>{weiToEther(ev[3])}</div>
                              </div>
                    }
                  }
                })}
              </div>
              <div className='eventForm'>
                  <div className='subTitle'>Your tickets</div>
                  {
                    userTicketsList.length > 0
                    ?<>
                      <div className='eventRow'>
                        <div className='eventCol'>Event Id</div> <div className='eventCol'>Event Name</div> <div className='eventCol'>Tickets Owned</div>
                      </div>
                      {userTicketsList.map((ev, key)=>{
                      {
                        return <div className='eventRow' key={key}>
                                  <div className='eventCol'>{ev[0]}</div> <div className='eventCol'>{ev[1]}</div> <div className='eventCol'>{ev[2]}</div>
                                </div>
                        
                      }
                    })}
                    </>
                    :<div className='noTickets'>You don't have any Tickets</div>
                  }
                  
              </div>
            </div>
            <hr />
            <div className='tokenSection'>
              <div className='eventsList'>
                <div className='subTitle'>Tokens TCK</div>
                <div className='fieldSection'>
                  <label>
                    Your tokens owned: {userSupply} tokens
                  </label>
                </div>
              </div>
              <div className='eventsList'>
                <div className='subTitle'>Purchase tickets</div>
                <div className='form'>
                    <div className='fieldSection'>
                      <label>
                        Event Id:
                        <input name="eventId" onChange={updateForm}/>
                      </label>
                    </div>
                    <div className='fieldSection'>
                      <label>
                        Number of tickets:
                        <input name="number" type='number' onChange={updateForm} />
                      </label>
                    </div>
                    <div className='fieldSection'>
                      <label>
                        Tokens:
                        <input name="tokens" type='number' onChange={updateForm} />
                      </label>
                    </div>
                    <div className='create' onClick={buy}>Buy</div>
                </div>

              </div>
            </div>
            
          </>
      }
    </>
  )
}
