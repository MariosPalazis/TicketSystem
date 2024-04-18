const { expect } = require("chai");
const web3 = require('web3');

describe("Test contract Token", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;


  beforeEach(async function () {
    // Create the smart contract object to test from
    [owner , addr1, addr2] = await ethers.getSigners();
    const TestContract = await ethers.getContractFactory("TicketingSystem");
    contract = await TestContract.deploy();
  });

  /*
  it("token should work", async function () {
      // Get output from functions
      const ownerTest = await contract.owner();

      expect(ownerTest).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      //expect(await contract.getTotalSupplyUser(ownerTest)).to.equal("1000");
      expect(await contract.getTotalSupplyUser(contract.target)).to.equal("1000");
      expect(await contract.getTotalSupply()).to.equal("1000");
  });
  */
  

  it("event system crud", async function () {
    const ethToWei = web3.utils.toWei('0.0017249736510274807', 'ether');
    const ethToWei2 = web3.utils.toWei('0.0052094367209715', 'ether');

    console.log("eth->wei  ",ethToWei, ethToWei2)
    await contract.createEvent("eve1", 10, ethToWei);
    await contract.createEvent("eve2", 14, ethToWei);
    await contract.createEvent("eve2", 33, ethToWei);
    // await contract.createEvent("eve3", 33, '276396');
    await contract.createEvent("eve4", 44, ethToWei2);
    
    await contract.setEventStatus(1, false);
    let eventList = await contract.getEventList();  
    console.log(eventList);  
    expect(eventList.length).to.equal(4);


    await contract.purchaseTickets(0,1,0, { from: addr1 , value: ethToWei });

    eventList = await contract.getEventList();    
    expect(eventList[0].ticketsAvailable).to.equal(9);

  });

});