''' 
Título del Proyecto: Mi propia Blockchain con Python 
Autor : Joan Amengual
'''

# Importaciones necesarias
import datetime
import hashlib
import json
from flask import Flask, jsonify

# Clase de Blockchain 
class Blockchain:

    # Constructor
    def __init__(self):
        self.chain = []
        self.create_block(proof=1, previous_hash='0')

    # ---------------------------------------------------------------

    # Añadir bloques futuros en la cadena de bloques 
    def create_block(self, proof, previous_hash):
        block = {'index': len(self.chain)+1, 
                'timestamp': str(datetime.datetime.now()),
                'proof': proof, 
                'previous_hash': previous_hash}
        self.chain.append(block)
        return block

    # ---------------------------------------------------------------

    # Devuelve el último bloque de la cadena de bloques
    def print_previous_block(self):
        return self.chain[-1]

    # ---------------------------------------------------------------

    # Prueba de trabajo -> Proof of Work (PoW)
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False

        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2-previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else: 
                new_proof += 1
        
        return new_proof

    # ---------------------------------------------------------------

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    # ---------------------------------------------------------------

    def chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1

        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False 
            
            previous_block = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_block**2).encode()).hexdigest()

            if hash_operation[:4] != '0000': 
                return False 
            
            previous_block = block
            block_index += 1
        
        return True 

    # ---------------------------------------------------------------

# Creacion de la Web App usando flask 
app = Flask(__name__)

# Crear un objeto blockchain 
blockchain = Blockchain()

# ---------------------------------------------------------------

# Minar un nuevo bloque 
@app.route('/mine_block', methods = ['GET'])
def mine_block():
    previous_block = blockchain.print_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof,previous_hash)

    response = {'message': '¡Nuevo bloque minado!',
                'index' : block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash': block['previous_hash']}
    
    return jsonify(response), 200

# ---------------------------------------------------------------

# Obtención de la cadena 
@app.route('/get_chain', methods = ['GET'])
def display_chain():
    response = {'chain': blockchain.chain, 
                'length': len(blockchain.chain)}

    return jsonify(response), 200

# ---------------------------------------------------------------

# Validación de la blockchain 
@app.route('/valid', methods = ['GET'])
def valid():
    valid = blockchain.chain_valid(blockchain.chain)

    if valid: 
        response = {'message': 'La Blockchain de Joan FUNCIONA :)'}
    else: 
        response = {'message': 'La Blockchain de Joan NO FUNCIONA :('}

    return jsonify(response), 200


# Ejecución de flask en el servidor local 
app.run(host = '0.0.0.0', port = 5000)
