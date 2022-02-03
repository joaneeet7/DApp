const { assert } = require("chai");

// Llamada al contrato 'Main'
const Main = artifacts.require('Main');

contract('Main', accounts => {
    it('Funcion: getOwner()', async () => {
        // Smart contract desplegado
        let instance = await Main.deployed()
        const direccionOwner = await instance.getOwner.call()
        console.log('Accounts[0]: ',accounts[0])
        console.log('Dirección del Owner: ',direccionOwner)
        assert.equal(accounts[0], direccionOwner)


    });

    it ('Función: send_tokens(address _destinatario, uint _numTokens)', async () => {
        // Smart contract desplegado
        let instance = await Main.deployed()
        // Balance inicial
        inicial_balance_direccion = await instance.balance_direccion.call(accounts[0])
        inicial_balance_contrato = await instance.balance_total.call()
        console.log('Balance de accounts[0]:', inicial_balance_direccion)
        console.log('Balance del Smart Contract:', inicial_balance_contrato)
        // Envío de tokens
        await instance.send_tokens(accounts[0], 10, {from: accounts[0]})
        // Balance una vez hecha la transacción
        balance_direccion = await instance.balance_direccion.call(accounts[0])
        balance_contrato = await instance.balance_total.call()
        console.log('Balance de accounts[0]:', balance_direccion)
        console.log('Balance del Smart Contract:', balance_contrato)
        // Verificaciones
        assert.equal(balance_direccion, parseInt(inicial_balance_direccion) + 10)
        assert.equal(balance_contrato, parseInt(inicial_balance_contrato) - 10)
    });



})