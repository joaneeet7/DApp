// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 < 0.7.0;
pragma experimental ABIEncoderV2;
import "./ERC20.sol";


contract main {
    
    // Instancia del contato token
    ERC20Basic private token;
    
    // Owner del contrato
    address public owner;

    // Dirección del contrato
    address public contrato;
    
    // Constructor 
    constructor () public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);
    }
    
    function getOwner() public view returns (address){
        return owner;
    }

    function getContract() public view returns (address){
        return contrato;
    }

    function send_tokens (address _reciever, uint _numTokens) public {
        token.transfer(_reciever, _numTokens);
    }
    
    function balance_direccion(address _direccion) public view returns (uint) {
        return token.balanceOf(_direccion);
    }
    
    function balance_total() public view returns (uint) {
        return token.balanceOf(address(this));
    }
    
    
}