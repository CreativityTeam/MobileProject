/**
 * Created by K on 11/1/2016.
 */

var mongoose = require('mongoose');
var ServiceSchema = mongoose.Schema({
    service_id: {
        type: String
    },
    service_name: {
        type: String
    },
    desciption: {
        type: String
    },
    price:{
        type: Number
    }
})
