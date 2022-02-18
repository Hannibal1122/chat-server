const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3000;
const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
};

var text = [
    "What movies did James Dean appear in?",
    "East of Eden",
    "What companies has AARP endorsed?",
    "AARP Services",
    "Colonial Penn Insurance",
    "PCS",
    "Famous people who have been Rhodes scholars.",
    "Maine Congressman Tom Allen",
    "Australian Labor leader Kim Beazley",
    "Alan Bersin",
    "Newark Councilman, Cory Booker",
    "What countries have Rhodes Scholars come from?",
    "Australia",
    "Canada",
    "Pakistan",
    "US",
    "In what countries are agouti's found?",
    "Brazil",
    "Cayman Islands",
    "Costa Rica",
    "Who have been members of the organization? (Black Panthers)",
    "Mumia Abu-Jamal",
    "Jamil Abdullah Al-Amin",
    "Bill Brent",
    "Elaine Brown",
    "Rap Brown",
    "Tony Bryant",
    "Stokeley Carmichael",
    "Mark Clark",
    "Who are the members of Insane Clown Poose?",
    "Douglas Dail",
    "Q:What albums has Insane Clown Poose made?",
    "The Amazing Jeckle Brothers",
    "Bizzar Bazaar",
    "What diseases are prions associated with?",
    "Bovine Spongiform Encephalopathy (BSE) or mad cow disease ",
    "Creutzfedlt-Jakob Disease (CJD) in humans",
    "What researchers have worked with prions?",
    "Adriano Aguzzi",
    "Dr. Paul Brown",
    "Dr. Byron Caughey"]

let clients = [{
    uuid: getGUID(),
    name: "Engineer 1",
    response: null
}, {
    uuid: getGUID(),
    name: "Engineer 2",
    response: null
}, {
    uuid: getGUID(),
    name: "Engineer 3",
    response: null
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
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    messages.push({
        uuid: getGUID(),
        text: text[random(0, text.length - 1)],
        date: date.getTime() + random(0, 1000000),
        destination: vehicles[random(0, vehicles.length - 1)],
        creator: clients[random(0, clients.length - 1)],
        state: "viewed"
    })
}

app.listen(PORT, () => {
  console.log(`Events service listening at http://192.168.0.196:${PORT}`)
})

let activeClients = [];
function eventsHandler(request, response, next) {
    response.writeHead(200, headers);

    let uuid = request.query.user_uuid;
    let i = 0;
    for(; i < clients.length; i++)
        if(clients[i].uuid === uuid) break;

    activeClients.push({
        uuid: clients[i].uuid,
        response
    });
    console.log(`${ clients[i].uuid } Connection open`);

    request.on('close', () => {
        console.log(`${ uuid } Connection closed`);
        activeClients = activeClients.filter(client => client.uuid !== uuid);
    });
}

app.get('/events', eventsHandler);

function sendEventsToAll(message) {
    console.log(activeClients.map(client => client.uuid).join("\n"))
    activeClients.forEach(client => client.response.write(`data: ${ JSON.stringify(message) }\n\n`))
}

async function addMessage(request, respsonse, next) {
    const message = request.body;
    message.uuid = getGUID();
    message.date = new Date().getTime();
    message.state = "delivered";
    messages.push(message);
    respsonse.json(message)
    return sendEventsToAll(message);
}

app.post('/message', addMessage);
app.get('/user_info', (request, response) => response.json({ user: clients[random(0, clients.length - 1)] }));
app.get('/messages', (request, response) => response.json({ messages: messages }));

// Получить сообщения
// Отправить сообщение
// Получить статус сообщения
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
/** Каждый элемент получает уникальный идентификатор */
function getGUID(/** 'S4' - Набор из 4 цифр в 16-ой системе */map = "S4S4-S4-S4-S4-S4-S4S4S4")
{
    return map.split("S4").reduce((prev, curr) => prev + S4() + curr);
}