import React, { useEffect, useState } from 'react'
import { ethers, fromTwos } from 'ethers';
import Web3 from 'web3';
import deleteImg from '../assets/delete.svg';
import GridLoader from "react-spinners/GridLoader";
import "../css/owner.css";

export default function Owner() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [rewardLimit, setRewardLimit] = useState(0);
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [eventList, setEventList] = useState([]);
    const [createEvent, setCreateEvent] = useState({name:"", capacity: 0, price: 0});

    const [totalSupply, setTotalSupply] = useState(null);
    const [ownerSupply, setOwnerSupply] = useState(null);
    const [stateUpdate, setStateUpdate] = useState(0);
    const [loading, setLoading] = useState(true);



    const contractAddress  = "0x9E6B90f4e859DDc48f396511fcdFA5721fCbe1D9";
    const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
      "stateMutability": "payable",
      "type": "fallback"
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
            setBalance(weiValue.toString())
            setContractWithSigner(contractWithSigner)
            const eventListD = await contractWithSigner.getEventList();
            setEventList(JSON.parse(JSON.stringify(eventListD, (key, value) =>
              typeof value === 'bigint'
                  ? value.toString()
                  : value // return everything else unchanged
          )));
          const totalSup = await contractWithSigner.getTotalSupply();
          const OwnerSup = await contractWithSigner.getTotalSupplyUser();
          setTotalSupply(totalSup.toString());
          setOwnerSupply(OwnerSup.toString());
        }

        if (typeof window !== "undefined") {
            if (window.ethereum) {
                setProvider(new ethers.BrowserProvider(window.ethereum)); 
                fetchInfo();
            } else {
                console.error("Please install MetaMask!");
                alert("Please install MetaMask!")
            }
        }
        setLoading(false);
        
        //const contractWithSigner = contract.connect(await signer);
    }, [stateUpdate]);

  const weiToEther = (wei) =>{
    return Web3.utils.fromWei(wei, 'ether');
  }
  const updateForm = (e) =>{
    setCreateEvent((prevEvent => ({
      ...prevEvent,
      [e.target.name]: e.target.value
    })));
  }

  const removeEvent = async(eventId) =>{
    console.log(eventId)
    setLoading(true);
    try{
      const createEv = await contractWithSigner.removeEvent(eventId)
      await createEv.wait()
    }catch(err){
      console.log(err)
    }
    setStateUpdate(stateUpdate+1);
    setLoading(false);
  }


  const submit = async (e) =>{
    setLoading(true);
    e.preventDefault()
    /* do validations */
    let amount = Web3.utils.toWei(createEvent.price, 'ether');
    amount = amount.toString();
    let numb = parseInt(createEvent.capacity)
    try{
      const createEv = await contractWithSigner.createEvent(createEvent.name, numb, amount)
      await createEv.wait()
    }catch(err){
      console.log(err)
    }
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
                    <div className='eventCol'>Event Id</div> <div className='eventCol'>Name</div> <div className='eventCol'>Available Tickets</div> <div className='eventCol'>Price (ether)</div> <div className='eventCol'>Remove</div>
                  </div>
                  {eventList.map((ev, key)=>{
                    {
                      if(ev[4]){
                        return <div className='eventRow' key={key}>
                                  <div className='eventCol'>{ev[0]}</div> <div className='eventCol'>{ev[1]}</div> <div className='eventCol'>{ev[2]}</div> <div className='eventCol'>{weiToEther(ev[3])}</div><div className='eventCol'><img src={deleteImg} className='imgStyle' alt="Delete" onClick={()=>{removeEvent(ev[0])}} /></div>
                                </div>
                      }
                    }
                  })}
              </div>
              <div className='eventForm'>
                  <div className='subTitle'>Create new event</div>
                  <div className='form'>
                      <div className='fieldSection'>
                        <label>
                          Event name:
                          <input name="name" onChange={updateForm}/>
                        </label>
                      </div>
                      <div className='fieldSection'>
                        <label>
                          Ticket number:
                          <input name="capacity" type='number' onChange={updateForm} />
                        </label>
                      </div>
                      <div className='fieldSection'>
                        <label>
                          Ticket price (ether):
                          <input name="price" type='number' onChange={updateForm} />
                        </label>
                      </div>
                      <div className='create' onClick={submit}>Create</div>
                  </div>
              </div>
            </div>
            <hr />
            <div className='tokenSection'>
              <div className='eventsList'>
                <div className='subTitle'>Tokens TCK</div>
                <div className='fieldSection'>
                  <label>
                    Total Supply: {totalSupply} tokens
                  </label>
                </div>
                <div className='fieldSection'>
                  <label>
                    Owner Supply: {ownerSupply}
                  </label>
                </div>
              </div>
              <div className='eventsList'>
                <div className='subTitle'>Reward Limit</div>
                <div className='fieldSection'>
                  <label>
                    Current reward limit: {rewardLimit} 
                  </label>
                </div>
                <div className='fieldSection'>
                  <label>
                    Reward Limit in ether
                    <input name="name"/>
                  </label>
                </div>
                <div className='fieldSection'>
                  <label>
                    Reward Limit in wei
                    <input name="name" disabled/>
                  </label>
                </div>
                <div className='create' onClick={submit}>Update</div>

              </div>
            </div>
          </>
        }
    </>
  )
}
