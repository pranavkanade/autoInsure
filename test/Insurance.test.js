const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();

const web3 = new Web3(provider);

const compiledInsuranceContract = require('./../Contracts/build/Insurance.json')
// settle the variables needed
let InsuranceContract;
let accounts;

beforeEach(
    async () => {
        accounts = await web3.eth.getAccounts();

        InsuranceContract = await new web3.eth.Contract(
            JSON.parse(compiledInsuranceContract.interface)
        )
            .deploy({ data: compiledInsuranceContract.bytecode })
            .send({ from: accounts[0], value: '1000000', gas:'5000000'});
    }
);

describe("Insurance Contract", () => {
    it("gets deployed", async () => {
        assert.ok(InsuranceContract);
    });
});