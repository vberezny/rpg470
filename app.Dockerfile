FROM node:10-alpine as node
COPY . .
RUN rm -rf frontend/node_modules
RUN rm -rf frontend/build
RUN npm install --prefix frontend/
RUN npm run build --prefix frontend/

#GOLANG
FROM golang:latest
LABEL version="1.5"

RUN mkdir -p /go/src/sfu.ca/apruner/cmpt470finalprojectrpg

COPY --from=node . /go/src/sfu.ca/apruner/cmpt470finalprojectrpg
WORKDIR /go/src/sfu.ca/apruner/cmpt470finalprojectrpg

RUN go get -u github.com/golang/dep/cmd/dep


RUN dep ensure
RUN cp db/dbconf.docker.yml db/dbconf.yml

RUN go build main.go

EXPOSE 8000
ENV COMPOSE true

CMD ["./main"]