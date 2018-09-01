'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAIEJKUy8EMBAHmysIzQE8BEqdYmvhBLEpIZCiIJO3dujxh94KZAEIQcznoRIOvHDemsaN9HNmO8VfjtBbdvjaxEbO2YUhqt90WZCAimJJa4wRDBW666Q4qoBbcQZBpXt4086FJhuHFa01ocH5HSZAEYyuy7CjWXBD6gaMZCgjQT8lnZB36R1f8NGMLQaCD2M0ZD"

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'pugpizza_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Pug Pizza no tienes permisos.');
    }
});

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message)
    }
}

function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu"
        }
    }
    callSendApi(messageData);
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
        function (err) {
            if (err) {
                console.log('Ha ocurrido un error')
            } else {
                console.log('Mensaje enviado')
            }
        }
    )
}

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando con el barto en el puerto: ', app.get('port'));
});
