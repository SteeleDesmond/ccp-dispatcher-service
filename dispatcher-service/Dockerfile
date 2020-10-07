FROM registry.csplab.local:5000/ccp-image-base/ubi8-nodejs-12:v12.18.3 as builder

USER root

WORKDIR /app/build

COPY src src
# COPY test test
COPY swagger.config.json .
COPY tsconfig.json .
COPY package.json .

RUN npm install
RUN npm run build

USER node

FROM registry.csplab.local:5000/ccp-image-base/ubi8-nodejs-12:v12.18.3

USER root

RUN yum -y install python2

WORKDIR /app

COPY --from=builder /app/build/dist dist
COPY public public
COPY package.json .
RUN npm install --production

# ENV HOST=0.0.0.0 PORT=443

USER node

# EXPOSE 80
EXPOSE 3005

CMD ["npm", "run", "serve"]


# FROM node:12.18.2-alpine3.12 as builder
# # FROM registry.csplab.local:5000/ccp-image-base/ubi8-nodejs-12:v12.18.2 as builder
# # USER root
# WORKDIR /app/build

# COPY src src
# # COPY test test
# COPY swagger.config.json .
# COPY tsconfig.json .
# COPY package.json .

# RUN npm install
# RUN npm run build

# FROM node:12.18.2-alpine3.12
# # FROM registry.csplab.local:5000/ccp-image-base/ubi8-nodejs-12:v12.18.2
# RUN apk update && apk add --no-cache curl && apk add --no-cache bind-tools && apk add --no-cache iputils && apk add --no-cache make && apk add --no-cache python2

# WORKDIR /app

# COPY --from=builder /app/build/dist dist
# COPY public public
# COPY package.json .
# RUN npm install --production

# # ENV HOST=0.0.0.0 PORT=443

# # EXPOSE 80
# EXPOSE 3005
# # USER default

# CMD npm run serve