const express = require('express');
const router = express.Router();
const Thing = require('../models/thing');
const {isConnected} = require('../functions');
const axios = require('axios');
const {checkIfAdmin} = require('../functions');

router.get('/', function(request, response, next) {
    let title = 'Travels application homepage';

    let userConnected = isConnected (request, response) ;
    Thing.Location.find()
    .then(
        function(allPlaces){
            response.render('index', {title, allPlaces, userConnected}) ;
        }
    )
   .catch(error => res.status(404).json({ error })) ;
});

module.exports = router;
