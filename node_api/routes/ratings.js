var express = require('express');
var router = express.Router();
var Rating = require('../models/rating');

router.post('/addrating',function(req,res){
    var newRating = new Rating();
    newRating.score = req.body.score;
    Rating.addRating(newRating,function(err,newRating){
        if(err) throw err;
        res.json({
            success : true,
            data : newRating
        });
    });
});

module.exports = router;