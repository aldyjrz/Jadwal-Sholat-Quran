FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install 

# Copy sisa source code
COPY . .

# Jalankan build dengan benar
RUN npm run build
EXPOSE 3131
CMD ["sh", "-c", "npm start"]
