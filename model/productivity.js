/**
 * Created by K on 10/31/2016.
 */

var mongoose = require('mongoose');
var ProductivitySchema = mongoose.Schema({
    productivitye_id: {
        type : String
    },

    productivitye_name: {
        type: String
    },

    desciption: {
        type: String
    },

    photos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photo'
    }],

    ad_price: {
        type: Number
    }
});
