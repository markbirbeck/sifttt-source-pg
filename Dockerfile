FROM node:6-alpine

# Create app directory and set as working directory:
#
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies as global node modules:
#
ENV NODE_PATH /usr/local/lib/node_modules

COPY package.json /usr/src/app

# Install Sifttt:
#
RUN apk add --no-cache git && npm install --quiet sifttt

# Install all dependencies and required dev tools:
#
RUN npm install --quiet

# Bundle app source
#
COPY . .

# Set the path so that tools can be found:
#
# (Would have thought this would be in the node image.)
#
ENV PATH="./node_modules/.bin:${PATH}"

# Launch the app:
#
CMD ["mocha"]
