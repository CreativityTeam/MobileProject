var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var User = require('../models/user');
var jwt = require('jwt-simple');
var configAuth = require('../config/auth');

function getMesSender(id, callback) {
    var listMessage = [{
        idSender: String,
        nameReceiver: String,
        content: String,
        date: Date
    }];
    Message.getMessageSender(id, function (err, messageList) {
        if (err) throw err;
        var listQuery = [];
        for (var i in messageList) {
            listQuery.push(
                new Promise(function(resolve,reject){
                    User.getUserById(messageList[i].receiverid,function(err,User){
                        if(err) reject(err);
                        var message = {
                            idSender: id,
                            nameReceiver: User.local.name,
                            content: messageList.content,
                            date: messageList.time_created   
                        };
                        resolve(message);
                    });   
                })
            );
        }
        Promise.all(listQuery)
        .then(function(messageArray){
            listMessage.push(messageArray);
            callback(listMessage);
        })
        .catch(function (err){
            console.log(err);
        });
    });
};

router.get('/getMessageSender/:token',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    var listMessage = getMesSender(decoded._id);
    getMesSender(decoded._id,function(listMessage){
        if (listMessage.length == 0) {
            res.json({
                success: false,
                msg: "You dont have any mails",
            });
        } else {
            res.json({
                success: true,
                msg: "Get Done",
                data: listMessage
            });
        }
    });
});

module.exports = router;