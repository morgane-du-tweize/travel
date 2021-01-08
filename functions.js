const session = require('express-session');
const bcrypt = require('bcrypt');
const { NotExtended } = require('http-errors');
const Thing = require('./models/thing');


function handleErrors(response, message) {
    let titre = message ;
    response.render('error', {titre});
}

function checkAuth(request, response, next) {
    if (request.session.userID) {
        next();
    }
    else {
        response.redirect('/users/login');
    }
}


//   function (error, thingFound)
function checkIfAdmin(request, response, next) {
    if (isConnected (request, response)){
        Thing.User.findOne({_id :request.session.userID})
        .then(function(thingFound) {
            if (thingFound.isadmin){
                console.log('DIEU ====') ;
                next() ;
            }

            else {
                console.log('not admin') ;
                response.redirect('/') ;
            }
        })
        .catch(function(error){
            throw error ;
        })
            /*
            , function(error, thingFound){
            if (error){
                throw error ;
            }

            else if (thingFound.isadmin){
                console.log('DIEU ====') ;
                next() ;
            }

            else {
                console.log('not admin') ;
                response.redirect('/') ;
            }
        }*/
    }
    else {
        console.log('not admin') ;
        response.redirect('/') ;
    }

}

function isConnected (request, response) {
    let userConnected ;

    let connected = request.session ;

    // index navbar links are different according if user is connected or not
    if (request.session.userID === undefined || typeof request.session.userID === 'undefined'  ||   typeof connected === 'undefined' || connected === undefined){
        userConnected = false ;
    }

    else if (typeof request.session.userID == undefined || request.session == undefined){
        userConnected = false ;
    }
    else {
        if(request.session.userID) {
            userConnected = true ;
        }
    }
    return userConnected ;
}


exports.checkAuth = checkAuth ;
exports.isConnected = isConnected ;
exports.checkIfAdmin = checkIfAdmin ;