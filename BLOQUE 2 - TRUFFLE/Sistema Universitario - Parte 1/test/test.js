// Llamada al contrato del Sistema Universitario
const notas = artifacts.require('notas');

contract ('notas' , accounts => {
    it ('1. Función: Evaluar(string memory _idAlumno, uint _nota)', async () => {
        // Smart Contract desplegado
        let instance = await notas.deployed();
        // Llamada al método de evaluación del Smart Contract
        const tx = await instance.Evaluar('12345X', 9, {from: accounts[0]});
        // Imprimir valores:
        console.log(accounts[0]); // Dirección del profesor
        console.log(tx);         // Transacción de la evaluación académica
        // Comprobación de la información de la Blockchain
        const nota_alumno = await instance.VerNotas.call('12345X', {from: accounts[1]});
        // Condición para pasar el test: nota_alumno = 9
        console.log(nota_alumno);
        assert.equal(nota_alumno, 9);
    }); 

    it('2. Función: Revision(string memory _idAlumno)', async () => {
        // Smart Contract desplegado
        let instance = await notas.deployed();
        // Llamada al método de revisar exámenes
        const rev1 = await instance.Revision('12345X', {from: accounts[1]});
        const rev2 = await instance.Revision('02468T', {from: accounts[2]});
        // Imprimir los valores recibidos de la revisión
        console.log(rev1);
        console.log(rev2);
        // Verificación del test
        const id_alumno = await instance.VerRevisiones.call({from: accounts[0]});
        console.log(id_alumno);
        // Comprobación de los datos de las revisiones
        assert.equal(id_alumno[0], '12345X');
        assert.equal(id_alumno[1], '02468T');
    });

});