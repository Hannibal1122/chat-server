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

let clients = {
    '2e22b683-340d-4d91-917f-c6759b08ef17': {'uuid': '2e22b683-340d-4d91-917f-c6759b08ef17',
                                             'external_id': 1,
                                             'name': 'Vasiliy',
                                             'type': 'driver'},
    'a1053f60-9ed0-4f43-87e8-09693d2e20dc': {'uuid': 'a1053f60-9ed0-4f43-87e8-09693d2e20dc',
                                             'external_id': 2,
                                             'name': 'Nikolay',
                                             'type': 'driver'},
    'adb1b4d1-f793-4020-a274-9bca31d762cf': {'uuid': 'adb1b4d1-f793-4020-a274-9bca31d762cf',
                                             'external_id': 3,
                                             'name': 'Elisey',
                                             'type': 'driver'},
    '19be733e-e54d-480b-8e7c-bc0336dc94d4': {'uuid': '19be733e-e54d-480b-8e7c-bc0336dc94d4',
                                             'external_id': 4,
                                             'name': 'Jayson',
                                             'type': 'driver'},
    'dbcf4a87-8c52-4046-b535-2ca2ca2685b5': {'uuid': 'dbcf4a87-8c52-4046-b535-2ca2ca2685b5',
                                             'external_id': 5,
                                             'name': 'Semyon',
                                             'type': 'operator'},
}

let vehicles = {
    1: {'id': 1, 'type': 'vehicle_1'},
    2: {'id': 2, 'type': 'vehicle_2'},
    3: {'id': 3, 'type': 'vehicle_3'},
    4: {'id': 4, 'type': 'vehicle_4'},
    5: {'id': 5, 'type': 'vehicle_5'},
}

let messages = {
    'c3996b43-6c05-4bc7-b58f-705713cb45a9': {'uuid': 'c3996b43-6c05-4bc7-b58f-705713cb45a9',
                                             'type': 'text',
                                             'text': 'Hello, world!',
                                             'destination': {'id': 1, 'type': 'vehicle_1'},
                                             'creator': {'uuid': '2e22b683-340d-4d91-917f-c6759b08ef17',
                                                         'external_id': 1,
                                                         'name': 'Vasiliy',
                                                         'type': 'driver'},
                                             'send_time': 1645154887000,
                                             'delivery_time': 1645154887000,
                                             'confirm_time': 1645155007000,
                                             'status': 'send'},
    '1619da01-cffc-4426-a3d5-3974a63da769': {'uuid': '1619da01-cffc-4426-a3d5-3974a63da769',
                                             'type': 'text',
                                             'text': 'Привет, мир!',
                                             'destination': {'id': 2, 'type': 'vehicle_2'},
                                             'creator': {'uuid': 'a1053f60-9ed0-4f43-87e8-09693d2e20dc',
                                                         'external_id': 2,
                                                         'name': 'Nikolay',
                                                         'type': 'driver'},
                                             'send_time': 1644885007000,
                                             'delivery_time': 1644885067000,
                                             'confirm_time': 1644885127000,
                                             'status': 'delivered'},
    'b1db43c1-69c6-48a0-b47a-ba574966beeb': {'uuid': 'b1db43c1-69c6-48a0-b47a-ba574966beeb',
                                             'type': 'text',
                                             'text': 'Съешь ещё этих мягких французских булок, да выпей чаю',
                                             'destination': {'id': 3, 'type': 'vehicle_3'},
                                             'creator': {'uuid': '19be733e-e54d-480b-8e7c-bc0336dc94d4',
                                                         'external_id': 4,
                                                         'name': 'Jayson',
                                                         'type': 'driver'},
                                             'send_time': 1645154887000,
                                             'delivery_time': 1645154887000,
                                             'confirm_time': 1645155007000,
                                             'status': 'confirmed'},
    'dfdfb22f-9496-47c8-9cec-bcdc17e760c6': {'uuid': 'dfdfb22f-9496-47c8-9cec-bcdc17e760c6',
                                             'type': 'text',
                                             'text': 'Sample text',
                                             'destination': {'id': 1, 'type': 'vehicle_1'},
                                             'creator': {'uuid': '2e22b683-340d-4d91-917f-c6759b08ef17',
                                                         'external_id': 1,
                                                         'name': 'Vasiliy',
                                                         'type': 'driver'},
                                             'send_time': 1645154887000,
                                             'delivery_time': 1645154887000,
                                             'confirm_time': 1645155007000,
                                             'status': 'send'},
    '1559a0e5-bc45-4acf-8734-ba723b89ad30': {'uuid': '1559a0e5-bc45-4acf-8734-ba723b89ad30',
                                             'type': 'text',
                                             'text': 'Never give up',
                                             'destination': {'id': 2, 'type': 'vehicle_2'},
                                             'creator': {'uuid': 'dbcf4a87-8c52-4046-b535-2ca2ca2685b5',
                                                         'external_id': 5,
                                                         'name': 'Semyon',
                                                         'type': 'operator'},
                                             'send_time': 1644489127000,
                                             'delivery_time': 1644489367000,
                                             'confirm_time': 1644489607000,
                                             'status': 'confirmed'}
}

app.listen(PORT, () => {
  console.log(`Events service listening at ${PORT}`)
})

let activeClients = [];
function eventsHandler(request, response, next) {
    response.writeHead(200, headers);

    let id = request.query.external_id;
    let { uuid } = getCreator(Number(id));

    activeClients.push({
        uuid: uuid,
        response
    });

    console.log(`${ uuid } Connection open`);

    request.on('close', () => {
        console.log(`${ uuid } Connection closed`);
        activeClients = activeClients.filter(client => client.uuid !== uuid);
    });

    response.write(`data: ${ JSON.stringify({ uuid: uuid }) }\n\n`)
}

app.get('/stream/', eventsHandler);

function sendEventsToAll(message) {
    console.log("sendEventsToAll", activeClients.map(client => client.uuid).join("\n"))
    activeClients.forEach(client => client.response.write(`data: ${ JSON.stringify({ messages: [message] }) }\n\n`))
}

async function addMessage(request, response, next) {
    const message = request.body;
    message.uuid = getGUID();
    message.date = new Date().getTime();
    message.state = "delivered";
    message.creator = getCreator(Number(request.query.external_id));
    messages[message.uuid] = message;
    response.json(message)
    return sendEventsToAll(message);
}

app.get('/messages/', (request, response) => {
    let destination_id = request.query.destination_id;
    let out = [];
    for(let key in messages)
        if(Number(messages[key].destination.id) == destination_id)
            out.push(messages[key])
    response.json({ messages: out })
});
app.post('/messages/', addMessage);
app.post('/messages/*/set_status/', (request, response) => {
    let uuid = request.params[0];
    let message = messages[uuid];
    message.state = request.body.state;
    response.json(message);
    return sendEventsToAll(message);
});

function getCreator(id)
{
    for(let key in clients)
        if(clients[key].external_id === id)
            return clients[key];
}
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