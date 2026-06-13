FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Cloud Run usa PORT env variable
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
