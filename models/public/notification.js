const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/sendToAll',(req,res)=>{
    'title': 'Notification Head',
    'text': 'Sub Heading'
};
var fcm_tokens=[];
 var notification_body={
     'notification': notification,
     'registration_ids':fcm_tokens
 }
    fetch('https://fcm.googleapis.com/fcm/send',{
        'method':'POST',
        'headers':{
            'Authorization': 'key='+ '',
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(notification_body)
    }).then(()=>{
        res.status(200).send('Notification send success');
    }).catch((error)=>{
        res.status(400).send('Something went wrong');
        console.log(error);
    })
});

module.exports= router