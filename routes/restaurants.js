var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Restaurant = require('../models/restaurant');

router.post('/register',function(req,res){
    var userid = req.body._id;
    var res_name = req.body.name;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var newRestaurant = new Restaurant({
        user_id : userid,
        res_name : res_name,
        location:{
            longitude : longitude,
            latitude : latitude
        }
    });
    Restaurant.findOneRes(newRestaurant.location.longitude,newRestaurant.location.latitude,function(err,restaurant){
        if(err) throw err;
        if(restaurant){
            res.json({
                success : false,
                msg : "You have created restaurant at current location",
                data : restaurant 
            });    
        }else{
            Restaurant.createRestaurant(newRestaurant,function(err,restaurant){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Create Restaurant",
                    data : restaurant 
                });
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : restaurant information */
router.get('/findinfo/:id',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        res.json({
            success:true,
            data : restaurant
        });
    });
});

/**Input : User ID */
/**Output : Admin of Rrestaurant */
router.get('/findad/:token',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    Restaurant.findAdmin(decoded._id,function(err,restaurant){
        if(err) throw err;
        if(!restaurant){
            res.json({
                success:false,
                msg : "You dont have any restaurant, Please create it"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant
            });
        }
    });
});

/**Input : Restaurant ID *(not necessary)/
/**Output : User of Rrestaurant */
router.get('/finduser/:id',function(req,res){
    Restaurant.findUserBelong(req.params.id,function(err,restaurant){
        if(err) throw err;
        res.json({
            success: true,
            msg: "Find done",
            data: restaurant.user_id
        });
    });
});

/**Input : Name res*/
/**Output : List Restaurants */
router.get('/findres/:name',function(req,res){
    Restaurant.findRes(req.params.name,function(err,restaurant){
        if(err) throw err;
        if(!restaurant){
            res.json({
                success:false,
                msg : "No restaurant is found"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant
            });
        }
    });
});

/**Input : Location x,y*/
/**Output : Restaurant */
router.get('/findreslocation/:longitude/:latitude',function(req,res){
    Restaurant.findResLocation(req.params.longitude,req.params.latitude,function(err,restaurant){
        if(err) throw err;
        if(!restaurant){
            res.json({
                success:false,
                msg : "No restaurant is found"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : commend of Rrestaurant */
router.get('/findcomment/:id',function(req,res){
    Restaurant.findCommentOfRestaurant(req.params.id,function(err,restaurant){
        if(err) throw err;
        if(restaurant.comments == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no comment"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.comments
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : Rating of Rrestaurant */
router.get('/findrating/:id',function(req,res){
    Restaurant.findRating(req.params.id,function(err,restaurant){
        if(err) throw err;
        if(restaurant.ratings == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no ratting"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.ratings
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : Photo of Rrestaurant */
router.get('/findphoto/:id',function(req,res){
    Restaurant.findPhotoBeLong(req.params.id,function(err,restaurant){
        if(err) throw err;
        if(restaurant.photos == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no photo"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.photos
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : Service of Rrestaurant */
router.get('/findservice/:id',function(req,res){
    Restaurant.findServiceBeLong(req.params.id,function(err,restaurant){
        if(err) throw err;
        if(restaurant.services == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no service"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.services
            });
        }
    });
});

/**Input : Restaurant ID */
/**Output : Publicities of Rrestaurant */
router.get('/findpublicity/:id',function(req,res){
    Restaurant.findPublicitiesBeLong(req.params.id,function(err,restaurant){
        if(err) throw err;
        if(restaurant.publicities == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no publicities"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.publicities
            });
        }
    });
});

/**Input : ID Photo */
/**Output : Array Restaurant */
router.put('/updatephoto/:id/:idphoto',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.photos.push(req.params.idphoto);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID comments */
/**Output : Array Restaurant */
router.put('/updatecomment/:id/:idcomment',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.comments.push(req.params.idcomment);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID ratings */
/**Output : Array Restaurant */
router.put('/updaterating/:id/:idrating',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.ratings.push(req.params.idrating);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID services */
/**Output : Array Restaurant */
router.put('/updateservices/:id/:idservice',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.services.push(req.params.idservice);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID publicities */
/**Output : Array Restaurant */
router.put('/updatepublicities/:id/:idpublicity',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.publicities.push(req.params.idpublicity);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID Restaurant */
/**Output : Restaurant */
router.put('/updateinfo/:id',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        restaurant.res_name = req.body.name;
        restaurant.location.longitude = req.body.longitude;
        restaurant.location.latitude = req.body.latitude;
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data : restaurant
            });
        });
    });
});

router.delete('/deletecomment/:id/:idcomment',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        for(var i = 0;i < restaurant.comments.length ; i++){
            if(restaurant.comments[i] == req.params.idcomment){
                restaurant.comments.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) throw err;
                    res.json({
                        success : true,
                        msg : "Successfully Delete",
                        data : restaurant.comments
            });
        });
    });
});

router.delete('/deletephoto/:id/:idphoto',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        for(var i = 0;i < restaurant.photos.length ; i++){
            if(restaurant.photos[i] == req.params.idphoto){
                restaurant.photos.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : restaurant.photos
            });
        });
    });
});

router.delete('/deleteservice/:id/:idservice',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        for(var i = 0;i < restaurant.services.length ; i++){
            if(restaurant.services[i] == req.params.idservice){
                restaurant.services.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : restaurant.services
            });
        });
    });
});

router.delete('/deletepublicity/:id/:idpublicity',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) throw err;
        for(var i = 0;i < restaurant.publicities.length ; i++){
            if(restaurant.publicities[i] == req.params.idpublicity){
                restaurant.publicities.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : restaurant.publicities
            });
        });
    });
});

router.delete('/deleterestaurant/:id',function(req,res){
    Restaurant.deleteRestaurant(req.params.id,function(err){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});

module.exports = router;