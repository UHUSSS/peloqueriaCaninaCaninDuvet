FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

# Copiar la configuracion personalizada de nginx para react router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la build de React/Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
