import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Web3 from 'web3';


export default function Owner() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [eventList, setEventList] = useState(["m","n"]);



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
            console.log(eventListD)
            setEventList(eventListD)
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
        
        //const contractWithSigner = contract.connect(await signer);
    }, []);

  const weiToEther = () =>{
    return Web3.utils.fromWei(balance, 'ether');
  }

  return (
    <>
        <div className='info'>
            <div className='infoDetail'>Your account is {account && account.address}</div>
            <div className='infoDetail'>{balance && balance} wei  or {balance && weiToEther()} ether</div>
        </div>
        <div className='eventsList'>
            {eventList}
        </div>
    </>
  )
}
