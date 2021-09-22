import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import web3 from '../ethereum/web3';
import contrato_token from '../abis/main.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = '5777'
    console.log('networkId', networkId)
    const networkData = contrato_token.networks[networkId]
    console.log('networkData', networkData)
    if(networkData) {
      const abi = contrato_token.abi
      const address = networkData.address
      console.log('address', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      // Direccion del contrato
      const direccion_smart_contract = await this.state.contract.methods.getContract().call();
      this.setState({direccion_smart_contract: direccion_smart_contract})
      console.log('Smart Contract: ', direccion_smart_contract)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // Funcion: Enviar una cantidad de tokens a una persona
  envio = async (direccion, cantidad) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await this.state.contract.methods.send_tokens(direccion, cantidad).send({from: accounts[0]});
    } catch (err) {
        this.setState({ errorMessage: err.message });
    } finally {
        this.setState({ loading: false });
    }
  };

  // Funcion: Visualizar el total de tokens del contrato
  balance_contrato = async (mensaje) => {
    try {
      console.log(mensaje)
      // Balance del contrato
      const balance = await this.state.contract.methods.balance_total().call();
      alert(parseFloat(balance))
    } catch (err) {
        this.setState({ errorMessage: err.message });
    } finally {
        this.setState({ loading: false });
    }

  };

   // Funcion: Visualizar el total de tokens del contrato
   balance_persona = async (address_balance, mensaje) => {
    try {
      console.log(mensaje)
      // Balance de la persona
      const balance_direccion = await this.state.contract.methods.balance_direccion(address_balance).call();
      alert(parseFloat(balance_direccion))
      this.setState({ address_balance: balance_direccion})
    } catch (err) {
        this.setState({ errorMessage: err.message });
    } finally {
        this.setState({ loading: false });
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      direccion_smart_contract: '',
      owner: '',
      direccion: '',
      cantidad: 0,
      deposit: '',
      loading: false,
      errorMessage: '',
      address_balance: ''
      
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DAPP
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
 
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const direccion = this.direccion.value
                  const cantidad = this.cantidad.value
                  this.envio(direccion, cantidad)
                }}>
  
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Dirección de destino'
                    ref={(input) => { this.direccion = input }}
                  />


                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Cantidad de tokens'
                    ref={(input) => { this.cantidad = input }}
                  />

                  <input
                    type='submit'
                    className='btn btn-block btn-danger btn-sm'
                    value='COMPRAR TOKENS'
                  />
                </form>
  
                &nbsp;

                <h1>Balance de tokens de un usuario</h1>
 
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const address = this.address_balance.value
                  const mensaje = 'Botón de Balance de Persona ejecutado'
                  this.balance_persona(address, mensaje)
                }}>
  
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Dirección de la persona'
                    ref={(input) => { this.address_balance = input }}
                  />

                  <input
                    type='submit'
                    className='btn btn-success'
                    value='BALANCE DE TOKENS'
                  />
                </form>
                
                &nbsp;

                <h1>Balance total de tokens del Smart Contract</h1>
 
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const mensaje = 'Botón de Balance ejecutado'
                    this.balance_contrato(mensaje)
                  }}>

                    <input
                      type='submit'
                      className='btn btn-block btn-primary btn-sm'
                      value='BALANCE DE TOKENS'
                    />
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
