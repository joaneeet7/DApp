import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import contrato_loteria from '../abis/loteria.json'
// Imagenes 
import loteria from '../imagenes/loteria.png';
import tokens from '../imagenes/tokens.png';

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
    const networkId = '5777' 
    console.log('networkId: ', networkId)
    const networkData = contrato_loteria.networks[networkId]
    console.log('networkData: ', networkData)

    if(networkData) {
      const abi = contrato_loteria.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }
  }
  
   // Constructor
   constructor(props) {
    super(props)
    this.state = {
      contract: null,
      loading: false,
      errorMessage: '',
      num_tokens: 0,
      direccion: '',
      cantidad: 0,
      boletos_comprados: 0,
      devolucion: 0
    }
  }
  

  // Funcion para realizar la compra de tokens
  envio = async (comprador_tokens,cantidad, ethers, mensaje) => {
    try {
      console.log(mensaje)
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      // TODO: introducir una direccion en el Smart Contract
      await this.state.contract.methods.CompraTokens(comprador_tokens,cantidad).send({from: accounts[0], value: ethers })
    } catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion para visualizar el balance de tokens de un usuario
  balance_persona = async (direccion, mensaje) => {
    try {
      console.log(mensaje)
      // Balance de la persona
      // TODO: introducir una direccion en el smart contract
      const balance_direccion = await this.state.contract.methods.MisTokens(direccion).call()
      alert(parseFloat(balance_direccion))
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
      const balance = await this.state.contract.methods.TokensDisponibles().call()
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
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      console.log(mensaje)
      // Incrementar el balance de tokens del Smart Contract
      await this.state.contract.methods.GeneraTokens(num_tokens).send({from: accounts[0]})
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally{
      this.setState({loading: false})
    }
  }

  // Funcion para visualizar el bote
  bote = async (mensaje) => {
    try {
      console.log(mensaje)
      // Bote de la lotería
      const bote = await this.state.contract.methods.Bote().call()
      alert(parseFloat(bote))
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion para visualizar el precio de un boleto
  precio_boleto = async (mensaje) => {
    try {
      console.log(mensaje)
      // Bote de la lotería
      const precio_boleto = await this.state.contract.methods.PrecioBoleto().call()
      alert(parseFloat(precio_boleto))
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion para comprar boletos
  compra_boletos = async (boletos_comprados, mensaje) => {
    try {
      console.log(mensaje)
      console.log(boletos_comprados)
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      alert("¡Mucha suerte para el sorteo!")
      // Compra de boletos
      await this.state.contract.methods.CompraBoleto(boletos_comprados).send({from: accounts[0]})
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion generar un ganador
  ganador = async (mensaje) => {
    try {
      console.log(mensaje)
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()

      // Generación de un ganador
      await this.state.contract.methods.GenerarGanador().send({from: accounts[0]})
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

   // Funcion para visualizar mi número de boletos
   ver_ganador = async (mensaje) => {
    try {
      console.log(mensaje)
      // Ver el ganador
      // TODO: hacer la direccion del ganador publica en el Smart Contract
      const ganador = await this.state.contract.methods.direccion_ganador().call()
      console.log('El ganador es la dirección:', ganador)
    }catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  // Funcion para devolver tokens (tokens -> ethers)
  devolver_tokens = async (devolucion, mensaje) => {
    try {
      console.log(mensaje)
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.DevolverTokens(devolucion).send({from: accounts[0]})
    } catch(err){
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
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

          <ul className="navbar-nav px-3"> 
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">Cuenta activa: {this.state.account}</span></small>

            </li>

           </ul>

        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                
              <h1>Lotería con Tokens ERC-20</h1>

              &nbsp;

              <h2>Gestión y control de Tokens de la Lotería</h2>

              <a  href="http://www.linkedin.com/in/joanamengual7"
                  target="_blank"
                  rel="noopener noreferrer">
              <p> </p>
              <img src={tokens} width="450" height="400" alt=""/>
              </a>
              <p> </p>

              &nbsp;
             
              <h3>Comprar tokens ERC-20</h3>
                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const comprador_tokens = this.comprador_tokens.value
                    const cantidad = this.cantidad.value
                    const web3 = window.web3
                    const ethers = web3.utils.toWei(this.cantidad.value, 'ether')
                    const mensaje = 'Compra de tokens en ejecución...'
                    this.envio(comprador_tokens,cantidad, ethers, mensaje)
                }}>  
                
                
                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Dirección del comprador de tokens'
                        ref = {(input) => {this.comprador_tokens = input}}/> 
         

                <input type= 'text' 
                        className='form-control mb-1' 
                        placeholder = 'Cantidad de Tokens a comprar (1 Token = 1 Ether)'
                        ref = {(input) => {this.cantidad = input}}/> 
         
                
                <input type = 'submit'
                        className= 'bbtn btn-block btn-danger btn-sm'
                        value = 'COMPRAR TOKENS'/> 
                
                
                </form>

                &nbsp;

              <h3> Balance total de tokens de un usuario </h3>

                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const direccion = this.direccion.value
                    const mensaje = 'Balance de tokens de una persona en ejecución...'
                    this.balance_persona(direccion, mensaje)
                }}>  

                <input type= 'text' 
                    className='form-control mb-1' 
                    placeholder = 'Dirección del propietario'
                    ref = {(input) => {this.direccion = input}}/> 

                <input type = 'submit'
                        className= 'bbtn btn-block btn-success btn-sm'
                        value = 'BALANCE DE TOKENS'/> 


                </form>  
             
                &nbsp;

              <h3>Balance de tokens del Smart Contract</h3>

              <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Balance de tokens del Smart Contract en ejecución...'
                this.balance_contrato(mensaje)
              }}>  

              <input type = 'submit'
                    className= 'bbtn btn-block btn-primary btn-sm'
                    value = 'BALANCE DE TOKENS'/> 

              </form>

              &nbsp;

            <h3> Añadir nuevos Tokens </h3>

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
                    className= 'bbtn btn-block btn-warning btn-sm'
                    value = 'INCREMENTO DE TOKENS'/> 

              </form>
              
            &nbsp;

            <h2>Gestión y control de compra de boletos de Lotería</h2>


              <a  href="http://www.linkedin.com/in/joanamengual7"
                  target="_blank"
                  rel="noopener noreferrer">
              <p> </p>
              <img src={loteria} width="500" height="350" alt=""/>
              </a>
              <p> </p>

            &nbsp;

            <h3> Bote </h3>

            <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Bote de tokens recolectado en ejecución...'
                this.bote(mensaje)
            }}>  

            <input type = 'submit'
                    className= 'bbtn btn-block btn-danger btn-sm'
                    value = 'BOTE DE TOKENS'/> 

            </form>

            &nbsp;

            <h3> Precio del boleto </h3>

            <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Precio del boleto en ejecución...'
                this.precio_boleto(mensaje)
            }}>  

            <input type = 'submit'
                    className= 'bbtn btn-block btn-success btn-sm'
                    value = 'PRECIO DEL BOLETO'/> 

            </form>

            &nbsp;

            <h3> Compra de boletos </h3>

            <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Compra de boletos en ejecución...'
                const boletos_comprados = this.boletos_comprados.value
                this.compra_boletos(boletos_comprados, mensaje)
            }}>  

            <input type= 'text' 
                    className='form-control mb-1' 
                    placeholder = 'Cantidad de boletos a comprar'
                    ref = {(input) => {this.boletos_comprados = input}}/> 


            <input type = 'submit'
                    className= 'bbtn btn-block btn-warning btn-sm'
                    value = 'BOLETOS A COMPRAR'/> 

            </form>

            &nbsp;

            <h3> Generar ganador </h3>

            <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Generar un ganador en ejecución...'
                this.ganador(mensaje)
            }}>  

            <input type = 'submit'
                    className= 'bbtn btn-block btn-success btn-sm'
                    value = 'GANADOR'/> 

            </form>

            &nbsp;

            <h3> Ver el ganador </h3>

            <form onSubmit = {(event) => {
                event.preventDefault()
                const mensaje = 'Ver el ganador en ejecución...'
                this.ver_ganador(mensaje)
            }}>  

            <input type = 'submit'
                    className= 'bbtn btn-block btn-info btn-sm'
                    value = 'VER GANADOR'/> 

            </form>

            &nbsp;

            <h3> Devolver Tokens </h3>
                <form onSubmit = {(event) => {
                    event.preventDefault()
                    const devolucion = this.devolucion.value
                    const mensaje = 'Devolución de tokens en ejecución...'
                    this.devolver_tokens(devolucion, mensaje)
                }}>  

            <input type= 'text' 
                    className='form-control mb-1' 
                    placeholder = 'Cantidad de tokens a devolver'
                    ref = {(input) => {this.devolucion = input}}/> 
                
                
            <input type = 'submit'
                    className= 'bbtn btn-block btn-info btn-sm'
                    value = 'DEVOLVER TOKENS'/> 
            
            
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
