# Imagen base de node
FROM node:14.17.6

# Creación de un directorio
WORKDIR /usr/src/app

# Instalación de módulos necesarios
COPY package*.json ./
RUN rm -rvf node_modules/ package-lock.json
RUN npm install
RUN npm install -g truffle@5.4.5

# Copia del código dentro del contenedor de Docker
COPY . .

# Exposición de un puerto del contenedor de Docker
EXPOSE 3000

# Entrypoint para la ejecución de la DApp
ENTRYPOINT [ "sh" ]

