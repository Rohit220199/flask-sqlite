# Dockerfile for frontend microservice
FROM node:20-alpine

WORKDIR /app

RUN npm install express@4.18.2 node-fetch@2.6.12

# Copy rest of the code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
