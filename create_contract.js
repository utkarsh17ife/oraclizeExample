const solc = require('solc');
const fs = require('fs');
const web3 = require('./sideCode/establish_web3').web3;

const config_data = require('./contract_config');

let account = config_data.account;
let password = config_data.password;
let http_link = config_data.http_link;
let contract_name = config_data.contract_name;


web3.setProvider(new web3.providers.HttpProvider(http_link), (err, res)=>{
    if(err){
        console.log('Could not establish connection to blockchain!');
        return;
    }
    console.log('connected to blockchain');
});

let contract_code = fs.readFileSync('./contracts_data/' + contract_name);
let contract = solc.compile(contract_code.toString());
bytecode = '0x' + contract.contracts[':' + contract_name].bytecode;
interface = contract.contracts[':' + contract_name].interface;
fs.writeFileSync('./contracts_data/'+ contract_name + '_byteCode', bytecode);
fs.writeFileSync('./contracts_data/'+ contract_name + '_ABI', interface);



//unlock the account
console.log(web3.personal.unlockAccount(account, password));

//create the contract
var ContractABI = web3.eth.contract(JSON.parse(interface));
var SaveContract = ContractABI.new(
    {
        from: account,
        data: bytecode,
        gas: '93048696279858031'
    }, function (e, contract) {
        if(e){
            console.log(e, contract);
            return;
        }

        if (typeof contract.address !== 'undefined') {
            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
            fs.writeFileSync('./contracts_data/'+ contract_name + '_final', 'Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash)
            return; 
        }

    });




