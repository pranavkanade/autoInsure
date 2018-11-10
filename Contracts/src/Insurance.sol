pragma solidity ^0.4.24;

contract InsuranceCompany {
    mapping(uint => address) public FlightsInsured;
    // uint [] public AllInsuredFlights;

    function registerFlight(uint id, uint from, uint to) public {
        address flightInsuranceInstance = new Insurance(id, from, to);
        FlightsInsured[id] = flightInsuranceInstance;
    }

    function getInsuredFlight(uint id) public view returns(address) {
        return FlightsInsured[id];
    }
}

contract Insurance {
    uint public flightId;
    uint public flightFromCity;
    uint public flightToCity;
    uint public subscriberCount;
    address[] private subscriberList;

    enum InsurancePackage {
        NONE,
        BASIC,
        REGULAR,
        PREMIUM
    }

    struct Subscriber {
        bool cIsInsured;
        address cInsuredCustomer;
        InsurancePackage cPackage;
    }

    mapping(address => Subscriber) flightSubscribers;

    modifier onlyIfSelectedValidPackage(uint package) {
        require(package <= 3 && package >= 1);
        _;
    }

    constructor(uint id, uint from, uint to) public {
        flightId = id;
        flightFromCity = from;
        flightToCity = to;
    }

    function addSubscriber(uint package)
        public
        payable
        onlyIfSelectedValidPackage(package)
        returns(bool)
    {
        subscriberList.push(msg.sender);
        Subscriber memory newSubscriber = Subscriber({
            cIsInsured: true,
            cInsuredCustomer: msg.sender,
            cPackage: InsurancePackage(package)
        });
        flightSubscribers[msg.sender] = newSubscriber;
        subscriberCount++;
        return true;
    }

    function getSubscriberCount()
        public
        view
        returns(uint)
    {
        return subscriberCount;
    }

    function settleContract()
        public
        payable
        returns (bool)
    {
        uint settlementAmt = address(this).balance/subscriberList.length;
        for(uint i = 0; i < subscriberList.length; i++){
            subscriberList[i].transfer(
                settlementAmt
            );
        }
        return true;
    }
}