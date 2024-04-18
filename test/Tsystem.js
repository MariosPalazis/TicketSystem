const { expect } = require("chai");


describe("Test contract Token", function () {
  let contract;
  let owner;

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
      expect(await contract.getTotalSupplyUser(contract.target)).to.equal("1000");
      expect(await contract.getTotalSupply()).to.equal("1000");
  });

  it("event system crud", async function () {
    await contract.createEvent("eve1", 10, 27639580);
    await contract.createEvent("eve2", 14, 27639580);
    await contract.createEvent("eve3", 33, 27639580);
    await contract.createEvent("eve4", 44, 82918740);
    
    await contract.setEventStatus(1, false);
    const eventList = await contract.getEventList();    
    expect(eventList.length).to.equal(4);;
  });

  it("Purchase tickets", async function () {

  });

});