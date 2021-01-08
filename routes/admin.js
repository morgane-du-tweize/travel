const express = require('express');
const router = express.Router();
const {checkAuth} = require('../functions');
const {checkIfAdmin} = require('../functions');
const {isConnected} = require('../functions');
const methodOverride = require('method-override');

const multer = require('multer') ;
const Thing = require('../models/thing');
const { route } = require('.');


router.get('/', checkIfAdmin, function(request, response, next) {
    let title = "admin page" ;
    let userConnected = isConnected (request, response) ;

    Thing.Location.find()
    .then(
        function(allPlaces){
            response.render('admin', {title, allPlaces, userConnected}) ;
        }
    )
    .catch(function(error){
        throw error ;
    }) ;
});


router.put('/:place', checkIfAdmin, function (request, response){
    Thing.Location.updateOne(
        { nom: request.params.place }, {validated: true}, function(error, docs){
        if (error){ 
            console.log(error) 
        }
        else{ 
            response.redirect('/../') ;
        } 
    })
})

router.delete('/:place', checkIfAdmin, function (request, response){
    Thing.Location.deleteOne ({nom: request.params.place}, function(error, docs){
        if (error){ 
            console.log(error) 
        }
        else{ 
            response.redirect('/../') ;
        } 
    });

})


module.exports = router;
