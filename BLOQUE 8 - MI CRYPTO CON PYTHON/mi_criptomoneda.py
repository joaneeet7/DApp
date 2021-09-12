'''
Título del proyecto: Mi criptomoneda con Python
Autor: Joan Amengual
'''

# Importaciones
import hashlib
import datetime
import json
import pprint
from time           import time  

# ------------------------ BLOQUE ------------------------
class Block:

    # Constructor
    def __init__(self, timeStamp, trans, previousBlock = ''):
        self.timeStamp = timeStamp
        self.trans = trans
        self.previousBlock = previousBlock
        self.difficultyIncrement = 0
        self.hash = self.calculateHash(trans, timeStamp, self.difficultyIncrement)

    # Función para calcular el hash 
    def calculateHash(self, data, timeStamp, difficultyIncrement):
        data = str(data) + str(timeStamp) + str(difficultyIncrement)
        data = data.encode()
        hash = hashlib.sha256(data)
        return hash.hexdigest()

    # Función para realizar el minado de bloques
    def mineBlock(self, difficulty):
        # Hash : 00000...005faqft62...
        difficultyCheck = "0" * difficulty
        # 00000005faqft62szvyqvy7262...
        while self.hash[:difficulty] != difficultyCheck:
            self.hash = self.calculateHash(self.trans, self.timeStamp, self.difficultyIncrement)
            self.difficultyIncrement += 1


# ------------------------ CADENA DE BLOQUES ------------------------
class Blockchain:
    # Constructor
    def __init__(self):
        self.chain = [self.GenesisBlock()]
        self.difficulty = 5 
        self.pendingTransaction = []
        self.reward = 20

# Enlace para acceder al Bloque 0 de BTC: # https://www.blockchain.com/btc/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
    def GenesisBlock(self):
        genesisBlock = Block(str(datetime.datetime.now()), "Soy el Bloque 0 de la Cadena de Bloques")
        return genesisBlock

    def getLastBlock(self):
        return self.chain[len(self.chain)-1]

    def minePendingTrans(self, minerRewardAddress):
        newBlock = Block(str(datetime.datetime.now()), self.pendingTransaction)
        newBlock.mineBlock(self.difficulty)
        newBlock.previousBlock = self.getLastBlock().hash

        print(f"Hash del bloque previo: {newBlock.previousBlock}")
        
        testChain = []
        for trans in newBlock.trans:
            temp = json.dumps(trans.__dict__, indent=5, separators=(',',':'))
            testChain.append(temp)
        pprint.pprint(testChain)

        self.chain.append(newBlock)
        print(f"Hash del bloque: {newBlock.hash}")
        print("¡NUEVO BLOQUE AÑADIDO!")

        rewardTrans = Transaction("Sistema" , minerRewardAddress, self.reward)
        self.pendingTransaction.append(rewardTrans)
        self.pendingTransaction = []

    def isChainValid(self):
        for x in range(1, len(self.chain)):
            currentBlock = self.chain[x]
            previousBlock = self.chain[x-1]

            if (currentBlock.previousBlock != previousBlock.hash):
                print("La cadena no es válida!")
        
        print("¡La cadena es válida y segura!")

    def createTrans(self, transaction):
        self.pendingTransaction.append(transaction)

    def getBalance(self, walletAddress):
        balance = 0
        for block in self.chain:
            if block.previousBlock == "":
                continue
            for transaction in block.trans:
                if transaction.fromWallet == walletAddress:
                    balance -= transaction.amount
                if transaction.toWallet == walletAddress:
                    balance += transaction.amount
        return balance

# ------------------------ TRANSACCION ------------------------
class Transaction:
    # Constructor
    def __init__(self, fromWallet, toWallet, amount):
        self.fromWallet = fromWallet
        self.toWallet = toWallet
        self.amount = amount

# -----------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------
# ------------------------ ZONA DE TESTEO ------------------------
# -----------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------

mi_crypto = Blockchain()

print("AlbertoPousada empezó a minar...")

mi_crypto.createTrans(Transaction("Macia", "JB", 0.01))
mi_crypto.createTrans(Transaction("Magdalena", "Joan", 100))
mi_crypto.createTrans(Transaction("Joan", "Damian", 0.2))

tiempo_inicio = time()
mi_crypto.minePendingTrans("AlbertoPousada")
tiempo_final = time()
print(f"AlbertoPousada tardó: {tiempo_final-tiempo_inicio} secs")

print('-'*20)

print("JoanAmengual empezó a minar...")

mi_crypto.createTrans(Transaction("Joan", "JB", 1))
mi_crypto.createTrans(Transaction("Maria", "Alba", 40))
mi_crypto.createTrans(Transaction("Alba", "Joan", 2))

tiempo_inicio = time()
mi_crypto.minePendingTrans("JoanAmengual")
tiempo_final = time()
print(f"JoanAmengual tardó: {tiempo_final-tiempo_inicio} secs")

print('-'*20)

print("NuriaMerce empezó a minar...")

mi_crypto.createTrans(Transaction("David", "Biel", 0.0001))
mi_crypto.createTrans(Transaction("Javi", "Joan", 4))
mi_crypto.createTrans(Transaction("Jaume", "Joan", 20))

tiempo_inicio = time()
mi_crypto.minePendingTrans("NuriaMerce")
tiempo_final = time()
print(f"NuriaMerce tardó: {tiempo_final-tiempo_inicio} secs")

print('-'*20)
print("AlbertoPousada tiene " +str(mi_crypto.getBalance("AlbertoPousada")) + " JoanCoins en su Wallet")
print("JoanAmengual tiene " +str(mi_crypto.getBalance("JoanAmengual")) + " JoanCoins en su Wallet")
print("NuriaMerce tiene " +str(mi_crypto.getBalance("NuriaMerce")) + " JoanCoins en su Wallet")
print('-'*20)

# Hash de los bloques de la cadena 
for x in range(len(mi_crypto.chain)):
    print(f"Hash del Bloque {x}: {mi_crypto.chain[x].hash}")

print(mi_crypto.isChainValid())
