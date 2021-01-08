const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {isConnected} = require('../functions');
const {checkIfAdmin} = require('../functions');
const saltRounds = 10 ;


const { check, validationResult } = require('express-validator');
const Thing = require('../models/thing');
const {checkAuth} = require('../functions');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(request, response, next) {
    let userConnected = isConnected (request, response) ;
    let title = 'connection' ;

    response.render('connection', {title, userConnected});
});

router.post('/login', function(request, response)  {
  
    let email = request.body.email;
    let passOfRequest = request.body.password;

    if (email && passOfRequest){
        Thing.User.findOne({email :email}, function (error, thingFound) {
            bcrypt.compare(passOfRequest, thingFound.password, function (error, result) {
                if (error){
                    response.status(404).json({ error }) ;
                }
                else if (result){
                    request.session.email = thingFound.email;
                    request.session.userID = thingFound._id;
                    response.redirect('/../');
                }
                else {
                    response.send('Incorrect Username and/or Password!');
                }
            })
        }) ;
    }
});


router.get('/allProfiles', checkAuth, function (request, response){
    let userConnected = isConnected (request, response) ;
    let title = "Liste de tous les utilisateurs" ;

    Thing.User.find()
        .then(
            function (things){
                response.render('allUsers', {title, things, userConnected});
            } 
        )
        .catch(error => response.status(404).json({ error })) ;
})


router.get('/myProfile', checkAuth, function (request, response){
    let userConnected = isConnected (request, response) ;
    let title = 'Profile user' ;

    let mailUser = request.session.email ;
    Thing.User.findOne({email : mailUser})
    .then (function(thing){
        response.render('myProfile', {title, thing, userConnected}) ;
    })
    .catch( error => response.status(404).json({ error }));
})


router.get('/signup', function(request, response, next) {
    let userConnected = isConnected (request, response) ;
    let title = 'inscription' ;
    response.render('signup', {title, userConnected});
});


 router.post('/register', function (request, response){
     const errors = validationResult(request);

    let newUser = request.body ;
    if (errors.isEmpty() && newUser.nom != "" && newUser.prenom != ""&& newUser.email != "" && newUser.password != "") {
        Thing.User.findOne({email :newUser.email}, function (error, thingFound) {
            if (!thingFound ){
                const thing = new Thing.User({
                    ...request.body
                  });
                  thing.save()
                    .then(
                        () => response.redirect('/../')
                      )
                    .catch(error => response.status(400).json({ error }));
                }
            else {
                response.redirect('/../') ;
            }
        })
    }
 })


router.post ('/newFirstName', checkAuth, function (request, response){
    Thing.User.updateOne(
        {email: request.session.email}, {firstname: request.body.newFirstName}, function (error, docs){
            if (error){ 
                console.log(error) 
            }
            else {
                response.redirect('/../') ;
            }
        }
    )
})

router.post ('/newLastName', checkAuth, function (request, response){
    Thing.User.updateOne (
        {email: request.session.email}, {lastname: request.body.newLastName}, function(error, docs){
            if (error){ 
                console.log(error) 
            }
            else {
                response.redirect('/../') ;
            }
        }
    )
})

router.post ('/newPassword', checkAuth, function (request, response){
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(request.body.newPassword, salt);

    Thing.User.updateOne(
        {email: request.session.email}, {password: hash}, function (error, docs){
            if (error){ 
                console.log(error) ;
            }
            else {
                response.redirect('/../') ;
            }
        }
    )
})

router.get('/logout', function(request, response, next) {
    request.session.userID = undefined ;
    request.session.destroy() ;
    response.redirect('../');
});

module.exports = router;
