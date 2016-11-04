var express = require('express');
var app = express();
var port = process.env.port || 3000;
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var LocalStratery = require('passport-local').Stratery;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressvalidator = require('express-validator');
var flash = require('connect-flash');
var cors = require('cors');


function abc(n,callback){
    var c = [];
     for(var i =0;i<n;i++){
        c.push(i);
    }   
    callback(c);    
}

app.get('/test',
    function(req,res,next){
        abc(5,function(c){
            if(c.length == 0) {
                console.log("Ko fan tu");
            }else{
                 console.log("Co fan tu");
                 console.log(c);
            }
        });
    });


/**Set up Server */
app.listen(port,function(){
    console.log("Server is running at :" + port);
})