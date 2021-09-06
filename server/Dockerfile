FROM node:14-alpine

WORKDIR /usr/src/app

ENV PORT 8080
ENV NODE_ENV $NODE_ENV

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN if [ "${NODE_ENV}" = "production" ] ; then npm install --silent --only=production ; else npm install --silent ; fi
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD if [ "${NODE_ENV}" = "production" ] ; then npm run start ; else npm run dev ; fi
EXPOSE ${PORT}
