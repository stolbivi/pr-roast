FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
ENV HOST="0.0.0.0"
ENV PORT="8080"
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
