import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import web3 from '../ethereum/web3'
import contrato_token from '../abis/main.json'

class App extends Component {

  async componentWillMount(){
    // Carga de Web3
    await this.loadWeb3()
    // Carga de los datos de la Blockchain
    await this.loadBlockchainData()
  }

  // Carga de Web3
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3 (window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3 (window.web3.currentProvider)
    }
    else{
      window.alert('Non ethereum browser detected. You should consider trying Metamask!')
    }
  }

  // Carga de los datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    // Carga de la cuenta
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log('account', this.state.account)
    const networkId = await web3.eth.net.getId() // Rinkeby -> 4 , Ganache -> 5777
    console.log('networkId: ', networkId)
    const networkData = contrato_token.networks[networkId]
    console.log('networkData: ', networkData)

    if(networkData) {
      const abi = contrato_token.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
      // Direccion del Smart Contract
      const smart_contract = await this.state.contract.methods.getContract().call()
      this.setState({direccion_smart_contract: smart_contract}) 
      console.log('Dirección Smart Contract:' , smart_contract)
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }
  }

  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      direccion_smart_contract: '',
      owner: '',
      direccion: '',
      cantidad: 0,
      loading: false,
      errorMessage: '',
      address_balance: '',
      num_tokens: 0
    }
  }

  // Funcion para realizar la compra de tokens
  envio = async (direccion, cantidad, ethers, mensaje) => {
    try {
      console.log(mensaje)
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.send_tokens(direccion, cantidad).send({from: accounts[0], value: ethers })
    } catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion para visualizar el balance de tokens de un usuario
  balance_persona = async (address_balance, mensaje) => {
    try {
      console.log(mensaje)
      // Balance de la persona
      const balance_direccion = await this.state.contract.methods.balance_direccion(address_balance).call()
      alert(parseFloat(balance_direccion))
      this.setState({address_balance: balance_direccion})
    }catch(err){
      this.setState({errorMessage: err.message})
    }finally{
      this.setState({loading: false})
    }
  }

  // Funcion para visualizar el balance de tokens del Smart Contract
  balance_contrato = async (mensaje) => {
    try {
      console.log(mensaje)
      // Balance del Smart Contract
      const balance = await this.state.contract.methods.balance_total().call()
      alert(parseFloat(balance))
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }


  // Funcion para incrementar el número de tokens del Smart Contract
  incremento_tokens = async (num_tokens, mensaje) => {
    try{
      console.log(mensaje)
      const accounts = await web3.eth.getAccounts()
      // Incrementar el balance de tokens del Smart Contract
      await this.state.contract.methods.GeneraTokens(num_tokens).send({from: accounts[0]})
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally{
      this.setState({loading: false})
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://blockstellart.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp
          </a>
          <ul className="navbar-nav px-3"> 
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.direccion_smart_contract}</span></small>

            </li>

           </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Comprar tokens ERC-20</h1>
                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const direccion = this.direccion.value
                    const cantidad = this.cantidad.value
                    const ethers = web3.utils.toWei(this.cantidad.value, 'ether')
                    const mensaje = 'Compra de tokens en ejecución...'
                    this.envio(direccion, cantidad, ethers, mensaje)
                }}>  
                
                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Dirección de destino'
                        ref = {(input) => {this.direccion = input}}/> 
                
                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Cantidad de Tokens a comprar (1 Token = 1 Ether)'
                        ref = {(input) => {this.cantidad = input}}/> 
         
                
                <input type = 'submit'
                        className= 'btn btn-block btn-danger btn-sm'
                        value = 'COMPRAR TOKENS'/> 
                
                
                </form>

                &nbsp;

                <h1> Balance total de tokens de un usuario </h1>

                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const address = this.address_balance.value
                    const mensaje = 'Balance de tokens de una persona en ejecución...'
                    this.balance_persona(address, mensaje)
                }}>  

                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Dirección del usuario'
                        ref = {(input) => {this.address_balance = input}}/> 


                <input type = 'submit'
                        className= 'btn btn-block btn-success btn-sm'
                        value = 'BALANCE DE TOKENS'/> 


                </form>

                &nbsp;


                <h1>Balance de tokens del Smart Contract</h1>

                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const mensaje = 'Balance de tokens del Smart Contract en ejecución...'
                    this.balance_contrato(mensaje)
                }}>  

                <input type = 'submit'
                        className= 'btn btn-block btn-primary btn-sm'
                        value = 'BALANCE DE TOKENS'/> 

                </form>

                &nbsp;

                <h1> Añadir nuevos Tokens </h1>

                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const mensaje = 'Incremento de tokens del Smart Contract en ejecución...'
                    const num_tokens = this.num_tokens.value
                    this.incremento_tokens(num_tokens, mensaje)
                }}>  

                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Cantidad de tokens a incrementar'
                        ref = {(input) => {this.num_tokens = input}}/> 


                <input type = 'submit'
                        className= 'btn btn-block btn-warning btn-sm'
                        value = 'INCREMENTO DE TOKENS'/> 

                </form>
              


              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
