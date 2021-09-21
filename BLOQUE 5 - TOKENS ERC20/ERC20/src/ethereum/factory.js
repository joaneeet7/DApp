import web3 from './web3';

const main = require('../abis/main.json');

const instance = new web3.eth.Contract(
    main.abi,
    main.address
);

export default instance;