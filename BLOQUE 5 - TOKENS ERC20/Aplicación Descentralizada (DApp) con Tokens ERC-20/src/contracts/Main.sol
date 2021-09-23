// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.7.0;
import "./ERC20.sol";


contract main {
    
    // Instancia del contrato token 
    ERC20Basic private token;
    
    // Owner del contrato 
    address public owner;
    
    // Direccion del Smart Contract 
    address public contrato;
    
    // Constructor 
    constructor () public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);
    }
    
    // Obtenemos la direccion del Owner
    function getOwner() public view returns (address) {
        return owner;
    }
    
    // Obtenemos la direccion del Smart Contract
    function getContract() public view returns (address){
        return contrato;
    }
    
    // Establecer el precio de un token 
    function PrecioTokens(uint _numTokens) internal pure returns (uint) {
        // Conversion de Tokens a ethers: 1 token -> 1 Ether
        return _numTokens*(1 ether);
    }

    // Compramos tokens mediante: direccion de destino y cantidad de tokens 
    function send_tokens (address _destinatario, uint _numTokens) public payable {
        // Filtrar el numero de tokens a comprar
        require (_numTokens <= 10, "La cantidad de tokens es demasiado alta.");
        // Estavlecer el precio de los tokens
        uint coste = PrecioTokens(_numTokens);
        // Se evalua la cantidad de ethers que paga el cliente
        require(msg.value >= coste, "Compra menos tokens o paga con más ethers");
        // Diferencia de lo que el cliente paga 
        uint returnValue = msg.value - coste;
        // Retorna la cantidad de tokens determinada
        msg.sender.transfer(returnValue);
        // Obtener el balance de tokens disponibles
        uint Balance = balance_total();
        require(_numTokens <= Balance, "Compra un número menor de tokens");
        // Transferencia de los tokens al destinatario
        token.transfer(_destinatario, _numTokens);
    }

    // Generacion de tokens al contrato
    function GeneraTokens(uint _numTokens) public onlybyOwner(){
        token.increaseTotalSuply(_numTokens);
    }

    // Modificador que permita la ejecución tan solo por el owner
    modifier onlybyOwner() {
        require(msg.sender == owner, "No tienes permisos para esta funcion");
        _;
    }
    
    // Obtenemos el balance de tokens de una direccion 
    function balance_direccion(address _direccion) public view returns (uint){
        return token.balanceOf(_direccion);
    }
    
    // Obtenemos el balance de tokens total del smart contract 
    function balance_total() public view returns (uint) {
        return token.balanceOf(contrato);
    }
    
}





