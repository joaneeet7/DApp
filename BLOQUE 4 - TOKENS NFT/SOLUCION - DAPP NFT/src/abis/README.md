# EthereumReactJSTemplate
Plantilla per compilar i desplegar un Smart Contract desenvolupat amb Solidity a Ethereum, i accedir-hi mitjançant una aplicació desenvolupada amb una aplicació web amb interfície web ReactJS. Es pot executar a NodeJS o Docker.

## Execution with NodeJS

### Requirements for NodeJS execution
Requirements: [Node 12.13.0](https://nodejs.org/en/download/).

To install all dependencies, if necessary:
```
npm install
```

### Commands with NodeJS
To compile the smart contract:
```
npm run ethereum_compile
```

To deploy to Rinkeby test network:
```
npm run ethereum_deploy
```

To execute test:
```
npm run ethereum_test
```

To deploy to GitHub Pages:
```
npm run deploy
```

To start React JS development server:
```
npm run start
```

## Execution with Docker

### Requirements for Docker execution
Requirements: [Docker](https://docs.docker.com/get-docker/).

To install all dependencies, if necessary:
```
docker run -v "$PWD":/app -w /app node:12.13 npm install
```

### Commands with NodeJS
To compile the smart contract:
```
docker run -v "$PWD":/app -w /app node:12.13 npm run ethereum_compile
```

To deploy to Rinkeby test network:
```
docker run -v "$PWD":/app -w /app node:12.13 npm run ethereum_deploy
```

To execute test:
```
docker run -v "$PWD":/app -w /app node:12.13 npm run ethereum_test
```

To deploy to GitHub Pages:
```
docker run -v "$PWD":/app -w /app node:12.13 npm run deploy
```

To start React JS development server:
```
docker run -i -p 3000:3000 -v "$PWD":/app -w /app node:12.13 npm run start
```

