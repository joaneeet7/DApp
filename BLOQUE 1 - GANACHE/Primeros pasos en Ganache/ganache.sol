// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ganache {
    
    string message = "";
    event newMessage(string message);
    uint [] list;
    
    // Publicar un mensaje en la cadena
    function setMessage(string memory _message) public{
        message = _message;
        emit newMessage(_message);
    }
    
    // Visualizar el mensaje de la cadena
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    // Visualizar el gasto de gas en aumento
    function fullGas() public {
        for (uint i = 0; i < 100; i++){
            list.push(i);
        }
        
    }
    
    // Visualizar los parametros guardados
    function seeGas() public view returns (uint [] memory){
        return list;
    }
    
    
}