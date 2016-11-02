var express = require('express');
var router = express.Router();
var Photo = require('../models/photo');

router.post('/addphoto',function(req,res){
    var newPhoto = new Photo();
    newPhoto.url = req.body.path;
    Photo.addPhoto(newPhoto,function(err,newPhoto){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully Update",
            data : newPhoto
        });
    });
});

router.delete('/removephoto/:id',function(req,res){
    Photo.remove(req.params.id,function(err){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully remove",
        });
    });
});

module.exports = router;