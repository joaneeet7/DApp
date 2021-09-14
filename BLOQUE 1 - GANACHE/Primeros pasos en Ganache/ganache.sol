// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ganache {
    
    // Variables iniciales
    string message = "";
    uint [] list;
    
    // Publicar un mensaje en la cadena de bloques
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    // Visualizar el mensaje de la cadena de bloques 
    function getMessage() public view returns (string memory) { 
        return message;
    }
    
    // Aumentar el gasto de gas 
    function fullGas() public {
        for (uint i = 0; i<100; i++){
            list.push(i);
        }
    }
    
    // Visualizar los valores que consumen mucho gas
    function seeValues() public view returns (uint [] memory) {
        return list;
    }
       
}