const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildpath = path.resolve(__dirname, 'build');

// remove previously built versions of the contracts
fs.removeSync(buildpath);

const InsurancePath = path.resolve(__dirname, 'src', 'Insurance.sol');
const source = fs.readFileSync(InsurancePath, 'utf-8');

const compiledContracts = solc.compile(source , 1).contracts;

for (eachContract in compiledContracts) {
    fs.outputJSONSync(
        path.resolve(buildpath, eachContract.replace(':', '') + '.json'),
        compiledContracts[eachContract]
    );
}