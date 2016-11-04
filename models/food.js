var mongoose = require('mongoose');
var FoodSchema = mongoose.Schema({
    food_name: {
        type: String
    },
    description: {
        type: String
    },
    res_belong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    type : {
        type: String
    },
    price : {
        type: Number
    },
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    photos : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo' 
    }],
    ratings : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating' 
    }]
});

var Food = module.exports = mongoose.model('Food',FoodSchema);

/**Create Food */
module.exports.createFood = function(newFood,callback){
    newFood.save(callback);
};

module.exports.getFoodById = function(id,callback){    
    Food.findById(id,callback);
};

module.exports.getAllFood = function(callback){    
    Food.find(callback);
};

/**Find Food by name */
module.exports.findFoodByName = function(name,callback){
    var query = { food_name : name };
    Food.find(query, callback);
};

/**Find Food by type */
module.exports.findFoodByType = function(type,callback){
    var query = { type : type };
    Food.find(query, callback);
};

/**Find Food with price equals to an amount */
module.exports.findFoodByPrice = function(price,operator,callback){
    if (operator === 'gt'){
        var query = { price : {$gt : price} };
    }
    else if (operator === 'lt'){
        var query = { price : {$lt : price} };
    }
    else if (operator === 'eq'){
        var query = { price : price };
    }
    
    Food.find(query, callback);
};

/**Find the Restaurant that Food belongs to */
module.exports.findRestaurant = function(id,callback){
    var query = { res_belong : id }
    Food.find(query,callback);
};

/**Find all comments belong to this Food */
module.exports.findCommentsBelong = function(id,callback){
    Food.findById(id).populate('comments').exec(callback);
};

/**Find all photos belong to this Food */
module.exports.findPhotosBelong = function(id,callback){
    Food.findById(id).populate('photos').exec(callback);
};

/**Find all ratings belong to this Food */
module.exports.findRatings = function(id,callback){
    Food.findById(id).populate('ratings').exec(callback);
};

/**Remove Food */
module.exports.removeFood = function(id,callback){
    Food.findByIdAndRemove(id, callback);
};


