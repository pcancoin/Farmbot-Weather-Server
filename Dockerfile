FROM node:12

# Create app directory
WORKDIR /usr/src/farmbot-interface

COPY . .

RUN npm ci --only=production

RUN mkdir client && \
    cd client && \
    git clone --depth=1 https://github.com/pcancoin/Farmbot-Weather-Client.git && \
    cd Farmbot-Weather-Client && \
    npm ci --only=production && \
    npm run build && \
    cd .. && \
    cp -r Farmbot-Weather-Client/build/* . && \
    rm -rf Farmbot-Weather-Client && \
    ls -a


EXPOSE 5000
CMD [ "node", "index.js" ]
