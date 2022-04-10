// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    
    // Direccion del owner
    address owner;
    
    // Numero asteroids
    uint public numberAsteroids;
    
    // Evento que reciba datos del oraculo
    event __calbackNewData();
    
    // Constructor 
    constructor () public {
        owner = msg.sender;
    }
    
    // Restriccion de la ejecucion de las funciones
    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner');
        _;
    }
    
    // Recibe datos del oraculo
    function update() public onlyOwner {
        emit __calbackNewData();
    }
    
    // Funcion para configuracion manual del numero de asteroids 
    function setNumberAsteroids(uint _num) public onlyOwner {
        numberAsteroids = _num;
    }
    
    
}