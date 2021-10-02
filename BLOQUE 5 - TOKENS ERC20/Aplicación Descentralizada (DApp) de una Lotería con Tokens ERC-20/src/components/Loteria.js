import React, {Component} from 'react'
import './App.css'
import Web3 from 'web3'
import contrato_loteria from '../abis/loteria.json'
import {Icon} from 'semantic-ui-react'
import tokens from '../imagenes/loteria.png'

class Loteria extends Component {

    async componentWillMount(){
        // 1. Carga de Web3
        await this.loadWeb3()
        // 2. Carga de datos de la Blockchain
        await this.loadBlockchainData()
    }

     // 1. Carga de Web3
     async loadWeb3(){
         if(window.ethereum) {
             window.web3 = new Web3(window.ethereum)
             await  window.ethereum.enable()
         }

         else if(window.web3) {
             window.web3 = new Web3(window.web3.currentProvider)
         }
         else {
             window.alert('¡No hay ningún navegador detectado. Deberías considerar usar Metamask!')
         }

     }

     // 2. Carga de datos de la Blockchain
     async loadBlockchainData() { 
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        console.log('Account:', this.state.account)
        const networkId = '97' // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
        console.log('networkid:', networkId)
        const networkData = contrato_loteria.networks[networkId]
        console.log('NetworkData:', networkData)

        if(networkData) {
            const abi = contrato_loteria.abi
            console.log('abi', abi)
            const address = networkData.address
            console.log('address:',address)
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
            errorMessage:"",
            account: "",
            num_boletos: 0
         }
     }

     // Función para visualizar el boto de la lotería
     bote = async (mensaje) => {
        try {
            console.log(mensaje)
            const bote_loteria = await this.state.contract.methods.Bote().call()
            alert(parseFloat(bote_loteria))
        }catch(err){
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading:false})
        }
     }

     // Función para visualizar el precio del boleto
     precio_boleto = async (mensaje) => {
        try {
            console.log(mensaje)
            const precio = await this.state.contract.methods.PrecioBoleto().call()
            alert(parseFloat(precio))
        }catch(err){
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading:false})
        }
     }


     // Función para comprar boletos
     compra_boletos = async (boletos_comprados,mensaje) => {
        try {
            console.log(mensaje)
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts()
            alert('¡Mucha suerte!')
            await this.state.contract.methods.CompraBoleto(boletos_comprados).send({from: accounts[0]})
        }catch(err){
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading:false})
        }
     }

     // TODO: Función para visualizar los números de los boletos que tiene una persona 


    // Render de la DApp
    render () {
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

                <h2>Gestión y control de los boletos de lotería</h2>
    
                <a href="http://www.linkedin.com/in/joanamengual7"
                target ="_blank"
                rel ="noopener noreferrer">
                <p> </p>
                <img src={tokens} width = "500" height="350" alt=""/>
                </a>
                <p> </p>


                <h3> <Icon circular inverted color='blue' name='eye' />Bote</h3>

                <form onSubmit={(event) => {
                        event.preventDefault()
                        const mensaje = "Bote total de la lotería en ejecución..."
                        this.bote(mensaje)
                    }
                }>

                <input type="submit"
                        className='bbtn btn-block btn-primary btn-sm'
                        value='BOTE'/>


                </form>


                <h3> <Icon circular inverted color='orange' name='money bill alternate outline' />Precio boleto</h3>

                <form onSubmit={(event) => {
                        event.preventDefault()
                        const mensaje = "Precio del boleto de la lotería en ejecución..."
                        this.precio_boleto(mensaje)
                    }
                }>

                <input type="submit"
                        className='bbtn btn-block btn-info btn-sm'
                        value='PRECIO DEL BOLETO'/>


                </form>


                <h3> <Icon circular inverted color='yellow' name='payment' />Comprar boletos</h3>

                <form onSubmit={(event) => {
                        event.preventDefault()
                        const num_boletos = this.num_boletos.value
                        const mensaje = "Precio del boleto de la lotería en ejecución..."
                        this.compra_boletos(num_boletos, mensaje)
                    }
                }>

                <input type="text"
                        className='form-control mb-1'
                        placeholder="Número de boletos a comprar"
                        ref={(input) => this.num_boletos = input} /> 

                <input type="submit"
                        className='bbtn btn-block btn-warning btn-sm'
                        value='PRECIO DEL BOLETO'/>


                </form>


        </div>
            </main>
        </div>
        </div>
    </div>
        



    )
    }


}

export default Loteria