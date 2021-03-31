const webSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs').promises;

// map which contains all established web socket connections
const authorizedConnections = {};

// simple request handler
const listener = async (req, res) => {
    switch (req.url) {
        case '/':
            const html = await fs.readFile('src/index.html');
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write(html);
            res.end();
            break;
        case '/msg':
            let data = '';

            req.on('data', chunk => {
                data += chunk;
            });

            req.on('end', () => {
                const { id, msg } = JSON.parse(data);

                // if client with given id exists, send message to him using web socket connection
                if (authorizedConnections.hasOwnProperty(id)) {
                    authorizedConnections[id].sendUTF(msg);
                    console.log(`Sent message '${msg}' to client ${id}`);
                }

                res.writeHead(200);
                res.end();
            });
            break;
        default:
            res.writeHead(400);
            res.end();
            break;
    }
};

const server = http.createServer(listener);

server.listen(8080);

const wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', request => {
    const connection = request.accept(null, request.origin);

    connection.on('message', ({ utf8Data }) => {
        // utf8Data - user token or id sent from front-end
        // replace next line with auth logic (find user id DB, check permissions etc.)
        const userId = utf8Data;

        if (!authorizedConnections.hasOwnProperty(userId)) {
            authorizedConnections[userId] = connection;
            console.log(`connected: ${userId}`);
            console.log(`clients list: ${Object.getOwnPropertyNames(authorizedConnections)}`);

            connection.on('close', () => {
                delete authorizedConnections[userId];
                console.log(`disconnected: ${userId}`);
            });
        }
    });
});
