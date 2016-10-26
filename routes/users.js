var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var configAuth = require('../config/auth');
var cors = require('cors');
var jwt = require('jwt-simple');


router.post('/register',function(req,res){
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password
    var password2 = req.body.password2;
    /**Validate Information */
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password is not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.send(errors);
    }
    else{
        var newUser = new User({
            local : {
                email : email,
                name : name,
                password : password
            }
        });
        User.getUserByEmail(newUser.local.email,function(err,user){
            if(err) res.status(500).send();
            if(user){
                res.json({
                    success : false,
                    msg : 'This email is registered'
                });
            }else{
                User.createUser(newUser,function(err,user){
                if(err){
                    res.status(500).send();
                }else{
                    var token = jwt.encode(user, configAuth.secret);
                    res.json({
                        success : true,
                        msg : 'Successfully create account',
                        token : token
                        });
                    }
                });
            }
        });
    }
});

/**Local Authetication */
passport.use(new LocalStrategy(
    function(username,password,done){
        User.getUserByEmail(username,function(err,user){
            if(err) throw err;
            if(!user){
                return done(null,false);
            }
            if(User.comparePassword(password,user.local.password)){
                return done(null,user);
            }else{
                return done(null,false);
            }
        });
}));


/**Login function */
router.post('/login',function(req,res,next){
   passport.authenticate('local',function(err,user,info){
       if(err) return next(err);
       if(!user){
            return res.json({
                success : false,
                msg : 'PLease check your username or password'
            });   
       }else{
           User.getUserById(user._id,function(err,newuser){
               if(err) throw err;
               var currentDate = new Date();
               var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
               newuser.last_login = newDate;
               User.updateUser(newuser,function(err,newuser){
                    var token = jwt.encode(newuser, configAuth.secret);
                    return res.json({
                        success : true,
                        msg : 'Login successful',
                        token : token
                    });    
               });
           });
       }
   })(req, res, next);
});

/**Login with facebook */
router.post('/createFace',function(req,res){
    User.getUserByFacebookId(req.body.id,function(err,user){
        var currentDate = new Date();
        var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
        if(err) throw err;
        if(user){
            user.last_login = newDate;
            User.updateUser(user,function(err,newuser){
                var token = jwt.encode(newuser, configAuth.secret);
                res.json({
                    success : true,
                    msg : 'Login successful',
                    token : token
                  });    
               });
        }else{
            var id = req.body.id;
            var name = req.body.name;
            var newUser = new User({
                facebook : {
                    id : id,
                    name : name
                },
                last_login : newDate
            }); 
            User.createUserOther(newUser,function(err,newuser){
                if(err){
                    res.status(500).send();
                }else{
                    var token = jwt.encode(newuser, configAuth.secret);
                    res.json({
                        success : true,
                        msg : 'Successfully create account',
                        token : token
                    });
                }
            });
        }
    });
});

/**Search Name */
router.get('/find/:name',function(req,res){
    User.findUserByName(req.params.name,function(err,users){
        if(err) throw err;
        if(users){
            res.json({
                success : true,
                data : users
            });
        }else{
            res.json({
                success : false,
                msg : "No User Found"
            });
        }
    });    
});

router.get('/findone/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) throw err;
        res.json({
                success : true,
                data : user
            });
        });
    }else{
        res.json({
                success : false,
                msg : "No token Provided"
            }); 
    }
});

router.put('/update/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) throw err;
        user.role = req.body.role;
        user.avatar = req.body.url;
        user.gender = req.body.gender;
        user.birthday = req.body.bod;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.about = req.body.about;
        user.other = req.body.other;
        User.updateUser(user,function(err,user){
                if(err) throw err;
                res.json({
                    success : true,
                    masg : "Successfully Updated"
                });
            });
        });
    }
});

router.put('/addresfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) throw err;
        user.res_favorite.push(req.body._id);
        User.updateUser(user,function(err,user){
                if(err) throw err;
                res.json({
                    success : true,
                    masg : "Successfully Updated"
                });
            });
        });
    }
});

router.put('/addfoodfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) throw err;
        user.foods_favorite.push(req.body._id);
        User.updateUser(user,function(err,user){
                if(err) throw err;
                res.json({
                    success : true,
                    masg : "Successfully Updated"
                });
            });
        });
    }
});

router.get('/findresfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.findResFav(decoded_id,function(err,user){
            if(err) throw err;
            if(user.res_favorite.length == 0){
                res.json({
                    success : false,
                    msg : "You dont like any restaurants"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                });
            }
        });
    }
});

router.get('/findfoodfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.findFoodFav(decoded_id,function(err,user){
            if(err) throw err;
            if(user.foods_favorite.length == 0){
                res.json({
                    success : false,
                    msg : "You dont like any foods"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                });
            }
        });
    }
});

module.exports = router;