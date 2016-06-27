function setup(){
	Camomile.setURL('http://manila.ugr.es:3000');
}

function aunthenticate (){

	setup();
	// already logged in? --> to main.html
	Camomile.me(function(err, response){
		if (err)
			console.log('something went wrong!!');
		else 
			$('#greeting').html(response.username);
	});

	// search for the login form

	// everything else fails? to login.html

}

function login(){
	setup();
	var username = $('#username').val();
	var password = $('#password').val();

	console.log('username '+  username + ' password ' +password);

	if (username != '' && password != '')

		Camomile.login(username, password, function(err,response){
			if (err)
				console.log('ERROR:' + err);
			else
				window.location = 'main.html';
		});
}


function loadImages(event){
	var params = {term:$('#concept').val()}
	$('#concepts').html('');
	$.getJSON('http://manila.ugr.es/puertoterm/manzanilla/get_images_concept.php', params).done(function(response){
		$.each(response, function(id,concept){
			var list = '<li class="list-group-item" id="concepto-'+id+'">' + concept.concept+'<ul class="list-inline">';

			$.each(concept.images, function(key,image){
				list += "<li><img id='eco-image-"+image.id_image+"' id-image='"+image.id_image+"'src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + image.filename + "' class='img-thumbnail' title='"+  image.description+"' onerror='this.style.display = \"none\"'/></li>";
			});

			list += '</ul></li>';
			$('#concepts').append(list);
		});
	});
}