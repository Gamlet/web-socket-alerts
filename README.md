### Purpose

Demonstrate how web sockets can be used to push messages from back-end to user agent.

### Prerequisite

node.js 10+

### Usage

1. `npm i` - install dependencies
1. `npm start` - start server locally
1. open `localhost:8080` in browser - WS connection will be registered by server
1. use any suitable tool to make POST request to `localhost:8080/msg` API

Request body:
`{ id: 'client_id', msg: 'message' }`

Example:

`curl -X POST -d '{ "id": "9dd005ba-f650", "msg": "Hello World!" }' -H 'Content-Type: application/json' 127.0.0.1:8080/msg`

### Useful links

https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
