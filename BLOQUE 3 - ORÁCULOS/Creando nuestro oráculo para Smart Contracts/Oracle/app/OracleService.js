// Llamada a las dependencias del proyecto
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const fetch = require('node-fetch')

// Llamada a los archivos .json
const contractJson = require('../build/contracts/Oracle.json')

// Instancia de web3
const web3 = new Web3('ws://127.0.0.1:7545')

// Información de direcciones de Ganache
const addressContract = '0x627dc8b5C8Be25CA28a9ccCc63B54ceAb83Ab439'
const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract)
const privateKey = Buffer.from('1de22a209f21ba42d1bac8bc4e3a79663ceee1d5c5e1512ece80355b0ba320dc', 'hex')
const address = '0xb29A882e52d3a32075A0d3Ed22293107F87471e2'

// Obtener el número de bloque
web3.eth.getBlockNumber()
    .then(n => listenEvent(n - 1))

// Función: listenEvent()
function listenEvent(lastBlock) {
    contractInstance.events.__calbackNewData({}, { fromBlock: lastBlock, toBlock: 'latest' }, (err, event) => {
        event ? updateData() : null
        err ? console.log(err) : null
    })
}

// Función: updateData()
function updateData() {
    // start_date = 2015-09-07
    // end_date = 2015-09-08
    // api_key = DEMO_KEY
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY' 

    fetch(url)
    .then(response => response.json())
    .then (json => setDataContract(json.element_count))
}

// Función: setDataContract(_value)
function setDataContract(_value) {
    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.setNumberAsteroids(_value).estimateGas({}, (err, gasAmount) => {
            let rawTx = {
                nonce: web3.utils.toHex(txNum),
                gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                gasLimit: web3.utils.toHex(gasAmount),
                to: addressContract,
                value: '0x00',
                data: contractInstance.methods.setNumberAsteroids(_value).encodeABI()
            }

            const tx = new Tx(rawTx)
            tx.sign(privateKey)
            const serializedTx = tx.serialize().toString('hex')
            web3.eth.sendSignedTransaction('0x' + serializedTx)
        })
    })
}