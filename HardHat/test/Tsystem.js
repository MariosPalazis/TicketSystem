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

  
  it("token should work", async function () {
      // Get output from functions
      const ownerTest = await contract.owner();

      expect(ownerTest).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      //expect(await contract.getTotalSupplyUser(ownerTest)).to.equal("1000");
      //expect(await contract.getTotalSupplyUser(contract.target)).to.equal("1000");
      expect(await contract.getTotalSupplyUser(owner)).to.equal("0");
      expect(await contract.getTotalSupplyUser(addr1)).to.equal("0");

      expect(await contract.getTotalSupply()).to.equal("1000");
  });
  
  

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


  });

});

describe("User purchase tickets + tokens", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  const ethToWei = web3.utils.toWei(0.001724973651027, 'ether');
  const ethToWei2 = web3.utils.toWei(0.0052094367209715, 'ether');
  const ethToWei4 = web3.utils.toWei(0.0069, 'ether');


  beforeEach(async function () {
    // Create the smart contract object to test from
    [owner , addr1, addr2] = await ethers.getSigners();
    const TestContract = await ethers.getContractFactory("TicketingSystem");
    contract = await TestContract.deploy();

    console.log("eth->wei  ",ethToWei, ethToWei2, ethToWei4)
    await contract.createEvent("eve1", 10, ethToWei);
    await contract.createEvent("eve2", 14, ethToWei);
    await contract.createEvent("eve2", 33, ethToWei);
    // await contract.createEvent("eve3", 33, '276396');
    await contract.createEvent("eve4", 44, ethToWei2);

  });

  it("Buy tickets & retrieve balance", async function () {
    await contract.connect(addr1).purchaseTickets(0,1,0, { from: addr1 , value: ethToWei });
    await contract.connect(addr1).purchaseTickets(2,3,0, { from: addr1 , value: "51749209530824421" });
    eventList = await contract.connect(addr1).getEventList();    
    

    const userTickets = await contract.connect(addr1).getUsersTickets();
    console.log(userTickets)

    console.log("balance", await contract.connect(owner).getContractBalance())

      await contract.connect(owner).withdrawToOwner(421);
      console.log("balance", await contract.connect(owner).getContractBalance())

      expect(eventList[0].ticketsAvailable).to.equal(9);
      expect(eventList[2].ticketsAvailable).to.equal(30);
  })

  it("Buy tickets with token ", async function () {
      await contract.connect(addr2).purchaseTickets(0,4,0, { value: ethToWei4 });
      const userTickets = await contract.connect(addr2).getUsersTickets();
      console.log(userTickets)

  })
  
  it("RewardLimit", async function () {
    console.log(await contract.connect(addr2).getTotalSupplyUser())
    console.log(await contract.connect(addr1).getTotalSupplyUser())
    console.log(await contract.connect(owner).getTotalSupplyUser())

    // console.log(await contract.connect(owner).getRemainSupply())
    // console.log(await contract.connect(owner).getTotalSupply())


    // console.log(await contract.connect(addr1).rewardLimit())
    // await contract.connect(owner).changeRewardLimit(20);
    // console.log(await contract.connect(addr1).rewardLimit())
    
  })
  
});
