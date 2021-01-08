const express = require('express');
const router = express.Router();
const {checkAuth} = require('../functions');
const {isConnected} = require('../functions');


const multer = require('multer') ;
const Thing = require('../models/thing');
const { route } = require('.');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads/') ;
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname ) ;
    }
})


router.get('/allPlaces/:place', function (request, response){
    let userConnected = isConnected (request, response) ;

    let nameOfPlace = request.params.place ;
    let title = request.params.place ;
    let hasAlreadyVoted = false ;
    Thing.Location.findOne({nom: nameOfPlace})
    .then (function(oneLocation){
        let numberOfLikes = oneLocation.likes.length ;
        let allComments = oneLocation.comments ;
          if (userConnected === true){
            Thing.User.findOne ({_id: request.session.userID})
            .then (function(user){
                let nameOfUser = user.firstname ;
                let userID = request.session.userID;

                for (let aLike of oneLocation.likes){
                    if (userID == aLike){
                      hasAlreadyVoted = true ;
                    }
                }

                response.render('place', {title, oneLocation, userConnected, allComments, nameOfUser, userID, hasAlreadyVoted, numberOfLikes}) ;
            })
            .catch( error => res.status(404).json({ error }));
        }

        else {
          response.render('place', {title, oneLocation, userConnected, allComments, numberOfLikes}) ;
        }
  })
  .catch( error => res.status(404).json({ error }));
})


// route used for ajax request on index page
router.get("/custom/:place", function(request, response){
  
    let nameOfPlace = request.params.place ;

    Thing.Location.find({nom: {
        $regex: new RegExp(nameOfPlace, "ig")
    }})
    .then(function(thing){
      response.send(thing) ; 
    })
    .catch(
       error => res.status(404).json({ error })
    );
})


router.get('/newLocation', checkAuth, function(request, response, next) {
  let userConnected = isConnected (request, response) ;
    let title = 'Nouveau lieu' ;
    response.render('newLocation', {title, userConnected});
});

router.post('/newLocation',  function (request, response, next){
    var upload = multer({ storage : storage}).single('imageOfLocation');
    upload(request, response, function(err) {
        if(err) {
            return response.end("Error uploading file.");
        }
        let newLocation = {
          nom: request.body.nameOfLocation,
          description: request.body.descriptionOfLocation,
          image: "",
  };
    newLocation.image = '/uploads/' + request.file.filename;

    let thing = new Thing.Location(newLocation) ;
      thing.save()
      .then(
        () => response.redirect('/../')
      )
      .catch(error => response.status(400).json({ error }));
    });  
});


router.post('/newComment', checkAuth, function (request, response){
    let newPost = request.body.formData ;

      let newComment = {
            userName: newPost.auteur,
            Comment: newPost.message,
            date: Date.now()
        } ;
      Thing.Location.findOne({nom: newPost.place}, function (error, thingFound){
          if (error){
              console.log("ERREUR", error) ;
          }
          thingFound.comments.push(newComment);
          thingFound.save();
          response.status(200).send(newComment);
      })
})



router.post('/like', checkAuth, function (request, response){

    let place = request.body.nameOfPlace ;
    let user = request.body.userID ;
    Thing.Location.findOne({nom: request.body.formData.place}, function (error, thingFound){
      let hasAlreadyVoted = false ;

      if (error){
        console.log("ERREUR", error) ;
      }

      for (let aLike of thingFound.likes){
          if (aLike == user){
            hasAlreadyVoted = true ;
            response.redirect('/') ;
          }
      }

      if (hasAlreadyVoted == false){
        thingFound.likes.push(request.body.formData.user);
        thingFound.save() ;
        let numberOfLikes = thingFound.likes.length ;
        response.status(200).send({numberOfLikes});
      }

  })
})

module.exports = router;