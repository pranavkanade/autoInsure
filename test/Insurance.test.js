const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();

const web3 = new Web3(provider);

// add more event listerns
require('events').EventEmitter.defaultMaxListeners = 50;

const compiledInsuranceCompany = require('./../Contracts/build/InsuranceCompany.json')
const compiledInsuranceContract = require('./../Contracts/build/Insurance.json')
// settle the variables needed
let InsuranceCompany;
let InsuranceContractAddress;
let InsuranceContract;
let accounts;

// flight details for the testing purpose
let flightId = 1;
let cityFrom = 11;
let cityTo = 22;

beforeEach(
    async () => {
        accounts = await web3.eth.getAccounts();

        InsuranceCompany = await new web3.eth.Contract(
            JSON.parse(compiledInsuranceCompany.interface)
        )
            .deploy({ data: compiledInsuranceCompany.bytecode })
            .send({ from: accounts[0], gas:'5000000'});

        // register new contract for a single flight
        await InsuranceCompany
            .methods.registerFlight(flightId, cityFrom, cityTo)
                .send({ from: accounts[0], gas: '5000000'});

        // Find the address
        InsuranceContractAddress = await InsuranceCompany
            .methods.getInsuredFlight(flightId).call();

        // get the instance of the deployed contract
        InsuranceContract = await new web3.eth.Contract(
            JSON.parse(compiledInsuranceContract.interface),
            InsuranceContractAddress
        );
    }
);

describe("Insurance Company", () => {
    it("Gets deployed", async () => {
        assert.ok(InsuranceCompany.options.address);
    });

    it("Can deploy insurance contract and get its address back", async () => {
        assert.ok(InsuranceContract);
    });
});

describe("Insurance Contract", () => {
    let package = 1;
    it("Lets one subscribe to itself", async () => {
        await InsuranceContract.methods.addSubscriber(package)
            .send({
                from: accounts[1],
                value: web3.utils.toWei('1', 'ether'),
                gas: '5000000' });
        await InsuranceContract.methods.addSubscriber(package)
            .send({
                from: accounts[2],
                value: web3.utils.toWei('1', 'ether'),
                gas: '5000000' });

        let subsCount = await InsuranceContract.methods.getSubscriberCount()
                .call();
        assert.equal(2, subsCount);
    });

    it("Lets settle the contract", async () => {
        await InsuranceContract.methods.addSubscriber(package)
            .send({
                from: accounts[1],
                value: '2000',
                gas: '5000000' });
        await InsuranceContract.methods.addSubscriber(package)
            .send({
                from: accounts[2],
                value: '2000',
                gas: '5000000' });

        let bal = await web3.eth.getBalance(InsuranceContract.options.address);
        console.log("balance before settlement : ", bal);

        await InsuranceContract.methods.settleContract()
            .send({
                from: accounts[0],
                gas: '5000000'
            });

        bal = await web3.eth.getBalance(InsuranceContract.options.address);
        console.log("balance after settlement : ", bal);
    });
});