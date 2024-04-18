// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract TCKToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("TICKET", "TCK") {
        _mint(msg.sender, initialSupply);
    }

    function mintToUser(address to, uint256 amount) external{ //add onlyOwner
        _mint(to, amount);
    }

}


contract TicketingSystem {
    struct Event {
        string name;
        uint256 ticketsAvailable;
        uint256 price;
        bool active;
        mapping(address => uint256) ticketsOwned;
    }

    struct EventInfo {
        uint256 eventId;
        string name;
        uint256 ticketsAvailable;
        uint256 price;  //in wei
        bool active;
    }

    struct UserTickets {
        uint256 eventId;
        string name;
        uint256 ticketsOwned;
    }

    mapping(uint256 => Event) public events;
    uint256 private eventIdCounter;

    address public owner;
    TCKToken private token;
    //AggregatorV3Interface internal dataFeed;


    event EventCreated(uint256 eventId, string name, uint256 ticketsAvailable, uint256 price);
    event EventRemoved(uint256 eventId);
    event TicketsPurchased(uint256 eventId, address purchaser, uint256 ticketsBought);
    event TicketsTransferred(uint256 fromEventId, uint256 toEventId, address sender, address recipient, uint256 ticketsTransferred);

    constructor() {
        owner = msg.sender;
        token = new TCKToken(1000);
        // dataFeed = AggregatorV3Interface(
        //     0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        // );
        //msg.sender !== contract address. On Token contractAddress=1000 msg.sender=200
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function getTotalSupply() public view returns(uint256){ //add onlyOwner
        return token.totalSupply();
    }
    function getTotalSupplyUser(address addr) public view returns(uint256){ //add onlyOwner
        return token.balanceOf(addr);
    }

    function createEvent(string memory _name, uint256 _ticketsAvailable, uint256 _price) external onlyOwner {
        Event storage newEvent = events[eventIdCounter];
        newEvent.name = _name;
        newEvent.ticketsAvailable = _ticketsAvailable;
        newEvent.price = _price;
        newEvent.active = true;
        eventIdCounter++;
        emit EventCreated(eventIdCounter - 1, _name, _ticketsAvailable, _price);
    }

    function removeEvent(uint256 _eventId) external onlyOwner {
        require(_eventId < eventIdCounter, "Invalid event ID");
        events[_eventId].active=false;
        emit EventRemoved(_eventId);
    }

    function setEventStatus(uint256 _eventId, bool status) external onlyOwner {
        require(_eventId < eventIdCounter, "Invalid event ID");
        events[_eventId].active = status;
    }

    function getEventList() external view onlyOwner returns(EventInfo[] memory){
        EventInfo[] memory result = new EventInfo[](eventIdCounter);
        for(uint256 i=0; i< eventIdCounter; i++){
            result[i] = EventInfo(i, events[i].name, events[i].ticketsAvailable, events[i].price, events[i].active);
        }
        return result;
    }
    function purchaseTickets(uint256 _eventId, uint256 _ticketsToBuy, uint256 tokensPay) external payable{
        require(_eventId < eventIdCounter, "Invalid event ID");
        Event storage selectedEvent = events[_eventId];

        require(selectedEvent.active, "Event is not active");
        require(selectedEvent.ticketsAvailable >= _ticketsToBuy, "Not enough tickets available");
        if(tokensPay>0){
            require(tokensPay <= getTotalSupplyUser(msg.sender), "Not enough tokens in your account");
        }

        uint256 cost = (_ticketsToBuy * selectedEvent.price) - (tokensPay * 5 * 55279);//solidity support for froating. is 276395.80 *100
        console.log(msg.value , cost);
        require(msg.value >= cost, "Not enough money send");
        if(tokensPay > 0){
            token.transferFrom(msg.sender, address(this), tokensPay);
        }
        selectedEvent.ticketsOwned[msg.sender] += _ticketsToBuy;
        selectedEvent.ticketsAvailable -= _ticketsToBuy;

        emit TicketsPurchased(_eventId, msg.sender, _ticketsToBuy);
    }

    function getUsersTickets() external view returns(UserTickets[] memory){
        UserTickets[] memory result = new UserTickets[](eventIdCounter);
        for(uint256 i=0; i< eventIdCounter; i++){
            if(events[i].active == true){
                if(events[i].ticketsOwned[msg.sender]>0){
                    result[i] = UserTickets(i, events[i].name, events[i].ticketsOwned[msg.sender]);
                }
            }
        }
        return result;
    }

    // function getChainlinkDataFeedLatestAnswer() public view returns (int) {
    //     // prettier-ignore
    //     (
    //         /* uint80 roundID */,
    //         int answer,
    //         /*uint startedAt*/,
    //         /*uint timeStamp*/,
    //         /*uint80 answeredInRound*/
    //     ) = dataFeed.latestRoundData();
    //     return answer;
    // }

    function transferTickets(uint256 _fromEventId, uint256 _toEventId, uint256 _ticketsToTransfer) external {
        // require(_fromEventId < eventIdCounter && _toEventId < eventIdCounter, "Invalid event IDs");

        // Event storage fromEvent = events[_fromEventId];
        // Event storage toEvent = events[_toEventId];

        // require(fromEvent.ticketsOwned[msg.sender] >= _ticketsToTransfer, "Not enough tickets to transfer");

        // fromEvent.ticketsOwned[msg.sender] -= _ticketsToTransfer;
        // toEvent.ticketsOwned[msg.sender] += _ticketsToTransfer;

        // emit TicketsTransferred(_fromEventId, _toEventId, msg.sender, msg.sender, _ticketsToTransfer);
    }

    receive() external payable {}
    fallback() external payable {}
}