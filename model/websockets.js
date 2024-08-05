const {WebSocket} = require('ws');
const jwt = require('jsonwebtoken');
const clients = new Map();

const WebSocketHandler = (expressServer) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/api/transactions/events"
    })

    expressServer.on("upgrade", (req, socket, head) => {
        websocketServer.handleUpgrade(req, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, req);
        })
    })

    websocketServer.on("connection" , (websocketConnection, connectionReq) => {
        const [_path, params] = connectionReq?.url?.split("?");
        const [key, token] = params.split("=");
        
        if(key !== "token") {
            websocketServer.close(1008, "Missing token");
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            let connectionArray = clients.get(decoded.mail);
            if(!connectionArray) {
                connectionArray = [websocketConnection];
                clients.set(decoded.mail, connectionArray);
            } else {
                connectionArray.push(websocketConnection);
            }
            websocketConnection.on("close", () => {
                for (let i = 0; i < connectionArray.length; i++) {
                    if(connectionArray[i] === websocketConnection) {
                        connectionArray.splice(i, 1);
                    }
                }
            })
        } catch (err) {
            websocketServer.close(1008, err);
        }
    })


    return websocketServer;
}

module.exports = {WebSocketHandler, clients};