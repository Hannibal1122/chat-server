const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3000;

let clients = [{
    uuid: "1",
    name: "Engineer 1"
}, {
    uuid: "2",
    name: "Engineer 2"
}];

let vehicles = [{
    id: 1,
    name: "Vehicle 1"
}, {
    id: 2,
    name: "Vehicle 2"
}, {
    id: 3,
    name: "Vehicle 3"
}]

let messages = [];
for(let i = 0; i < 100; i++)
{
    messages.push({
        uuid: "",
        text: "",
        date: "",
        destination: {
            id: 1,
            name: ""
        },
        creator: {
            uuid: "",
            name: ""
        },
        state: "send"
    })
}

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://192.168.0.196:${PORT}`)
})

function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(facts)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
}

app.get('/events', eventsHandler);

function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}

async function addMessage(request, respsonse, next) {
    const message = request.body;
    messages.push(message);
    respsonse.json(message)
    return sendEventsToAll(message);
}

app.post('/message', addMessage);

// Получить сообщения
// Отправить сообщение
// Получить статус сообщения
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function S4()
{
    return (((1 + Math.random()) * 0x
}