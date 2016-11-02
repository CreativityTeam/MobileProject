/**
 * Created by K on 10/31/2016.
 */

var mongoose = require('mongoose');
var PublicitySchema = mongoose.Schema({
    publicity_id: {
        type : String
    },

    publicity_name: {
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

var Publicity = module.exports = moongose.model('publicity', PublicitySchema);

/*Create Publicity*/
module.exports.createPublicity = function(newPublicity, callback){
    newPublicity.save(callback);
};

module.exports.getPublicityById = function(id, callback){
    Publicity.findById(id, callback);
};

module.exports.getPublicityByName = function(name, callback){
    var query = {'publicity_name' : name};
    Publicity.find(name, callback);
};

module.exports.getPublicityByPrice = function(price, callback){
    var query = {'ad_price' : price};
    Publicity.find(price, callback);
};

/*Remove Publicity*/
module.exports.removePublicity = function(id, callback){
    Publicity.findByIdAndRemove(id, callback);
};