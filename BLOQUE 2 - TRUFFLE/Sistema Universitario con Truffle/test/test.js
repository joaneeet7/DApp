const notas = artifacts.require("notas");

contract ('notas', accounts =>  {
    it('1. Función evaluar(string memory _idAlumno, uint _nota):' , async () => {
        let instance = await notas.deployed();
        const tx = await instance.Evaluar('12345X', 9, {from: accounts[0]});
        console.log(accounts);
        console.log(tx);
        const nota_alumno = await instance.VerNotas.call('12345X', {from: accounts[2]});
        assert.equal(nota_alumno, 9);
    });

    it('2. Función Revisión(string memory _idAlumno):' , async () => {
        let instance = await notas.deployed();
        const tx = await instance.Revision('12345X', {from: accounts[2]});
        console.log(accounts);
        console.log(tx);
        const id_alumno = await instance.VerRevisiones.call({from: accounts[0]});
        assert.equal(id_alumno, '12345X');
    });

});