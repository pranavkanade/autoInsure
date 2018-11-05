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
let InsuranceContract;
let accounts;

beforeEach(
    async () => {
        accounts = await web3.eth.getAccounts();

        InsuranceCompany = await new web3.eth.Contract(
            JSON.parse(compiledInsuranceCompany.interface)
        )
            .deploy({ data: compiledInsuranceCompany.bytecode })
            .send({ from: accounts[0], gas:'5000000'});
    }
);

describe("Insurance Company", () => {
    it("gets deployed", async () => {
        assert.ok(InsuranceCompany.options.address);
    });
});