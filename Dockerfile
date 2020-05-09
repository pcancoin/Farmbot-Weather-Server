FROM node:12

# Create app directory
WORKDIR /usr/src/farmbot-interface

COPY . .

RUN npm ci --only=production


EXPOSE 5000
CMD [ "node", "index.js" ]