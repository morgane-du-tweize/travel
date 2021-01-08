// searchbar for location by title on index page
$(document).ready(function(){
    $('#searchLocation').on('click', function(event){
        let searchText = $('#nameOfLocation').val();
        getLocation(searchText);
        event.preventDefault();
    });
});

function getLocation(searchText){
    let adresse = `location/custom/${searchText}` ;
    let toDsiplay = $('#searchResult') ;
    toDsiplay.html('') ;

    $.ajax({
        type: 'GET',
        data: {name: searchText},
        url: adresse,
        dataType: 'JSON',
        success: function(data, status){
            if (data.length == 0 ) {
               $('#searchResult').append(`<li>Sorry, no result matching</li><br>`) ;
            }
            else {
                if (data[0].validated == true){
                    $('#searchResult').append(`<li><a href="location/allPlaces/${data[0].nom}">${data[0].nom}</li><br>`) ;
                }

            }
        }
    })
}


$(document).ready(function(){
    $('#formComments').on('click', function(event) {
        event.preventDefault();
        
        let nameOfPlace = $('#placeName').text() ;
        let nameOfUser = $('#userName').text() ;
        let message = $('#commentaryOfPlace').val() ;

        let formData = {
            'auteur':nameOfUser,
            'place':nameOfPlace,
            'message' : message
        };

        $.ajax({ 
            url:'/location/newComment',
            type: 'POST',
            data: {formData},
            dataType:'json',

            success: function(data, status){
                $('#listOfComments').append(`<p>${nameOfUser}</p><br>`) ;
                $('#listOfComments').append(`<p>${message}</p><br>`) ;
            },
            error: function (res, status, err) {
                console.log("erreur ====", err);
            },
            complete : function(resultat, statut){
            }
        })
    })  
})

$(document).ready(function(){
    $('#newLike').on('click', function(event){
        event.preventDefault();
        let nameOfPlace = $('#placeName').text() ;

        let userID =  $('#userID').text() ;
        let formData = {
            'user': userID,
            'place': nameOfPlace
        };

        $.ajax({
            url:'/location/like',
            type: 'POST',
            data: {formData},
            dataType:'json',
            success: function(data, status){
                $('#newLike').addClass("hidden");
                $('#numberOfLikes').text(data.numberOfLikes);

            },

            error: function (res, status, err) {
                console.log(res);
            },
            complete : function(resultat, statut){
            }
        })

    })
})