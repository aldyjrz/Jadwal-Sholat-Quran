FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies
RUN npm install 
RUN npm build
# Copy sisa source code
COPY . .

EXPOSE 3131
CMD ["sh", "-c", "npm start"]
