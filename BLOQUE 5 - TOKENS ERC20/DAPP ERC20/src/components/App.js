import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import ERC20 from '../abis/ERC20Basic.json'


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
    console.log("Cuenta de Metamask activada: ", accounts[0])
    try {
      const balance = await ERC20.methods.balanceOf(this.state.direccion).call()
      console.log(balance)}
     catch (err) {
      console.log(err)
    } 

    const networkId = await web3.eth.net.getId()
    const networkData = ERC20.networks[networkId]
    if(networkData) {
      const abi = ERC20.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // Funcion que recibe la dirección de envío y envío tokens
  envio = (direccion, cantidad) => {
    this.state.ERC20.methods.enviar_tokens(direccion, cantidad).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        tokens: 10
      })
    })
  }

  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      balance: 0,
      direccion: '',
      tokens: 0,
      cantidad: 0
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
            DApp
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <h1>Envío de Tokens ERC20</h1>
 
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const direccion = this.direccion.value
                  const cantidad = this.cantidad.value
                  this.envio(direccion, cantidad)
                }}>
                  <h6>Dirección de destino</h6>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Dirección de envío'
                    ref={(input) => { this.state.direccion = input }}
                  />

                <h6>Cantidad de Tokens a enviar</h6>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Cantidad de tokens'
                    ref={(input) => { this.state.cantidad = input }}
                  />

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='ENVIAR TOKENS'
                  />
                </form>

                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://frogames.es/rutas-de-aprendizaje"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   APRENDE BLOCKCHAIN <u><b>AHORA! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
