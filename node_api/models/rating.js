var mongoose = require('mongoose');
var RatingSchema = mongoose.Schema({
    score :{
        type : String
    }
});

var Rating = module.exports = mongoose.model('Rating',RatingSchema);

module.exports.addRating = function(rating,callback){
    rating.save(callback);
};