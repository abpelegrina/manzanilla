// CORPUS

var id_layer_conceptos=0;

function showCorpus(){
	Camomile.getCorpora(function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			console.log(response);

			$.each(response, function(key, value){
				$('#info').append('<p>Found corpus: ' + value.name + '</p>');
				showLayers(value._id);
				showImagesCorpus(value._id);
			});
		}
	}, {filter:{name:'Ecolexicon Images'}});
}

function deleteCorpus(name){
	Camomile.getCorpora(function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			console.log(response);

			$.each(response, function(key, value){
				$('#info').append('Deleting corpus: ' + name);
				Camomile.deleteCorpus(value._id);
			});
		}
	}, {filter:{name:name}});
}

function createCorpus(name){
	Camomile.createCorpus('Ecolexicon Images', 'corpus with all the images in Ecolexicon',function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			$('#info').append('<p>Corpus '+name+' successfuly created</p>');
			createLayers(response._id);
			addImagesToCorpus(response._id);
		}
	});
}



// LAYERS
function createLayers(corpus){
	$('#info').append('<p>Creating layers...</p>');
	Camomile.createLayer(corpus, 'layer_image_types', 'layer for the images types', 'global', 'image_type', [], 
		function(error, data){
			if (error) $('#info').append('<p>ERROR:' + err + '</p>');
			else {
				console.log(data);
				$('#info').append('<p>Created layer with id: ' + data._id + '</p>');
			}
	});

	Camomile.createLayer(corpus, 'layer_concepts', 'layer for the concepts', 'global', 'concept', [], 
		function(error, data){
			if (error) $('#info').append('<p>ERROR:' + err + '</p>');
			else {
				console.log(data);
				id_layer_conceptos = data._id;
				$('#info').append('<p>Created layer with id: ' + data._id + '</p>');
			}
	});

	Camomile.createLayer(corpus, 'layer_relations', 'layer for the relations', 'global', 'relation', [], 
		function(error, data){
			if (error) $('#info').append('<p>ERROR:' + err + '</p>');
			else {
				console.log(data);
				$('#info').append('<p>Created layer with id: ' + data._id + '</p>');
			}
	});

	Camomile.createLayer(corpus, 'layer_VPKs', 'layer for the VPKs', 'local', 'vpk', [], 
		function(error, data){
			if (error) $('#info').append('<p>ERROR:' + err + '</p>');
			else {
				console.log(data);
				$('#info').append('<p>Created layer with id: ' + data._id + '</p>');
			}
	});
}

function showLayers(corpus){
	Camomile.getLayers(function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			console.log(response);

			$.each(response, function(key, value){
				$('#info').append('<p>&nbsp;Found layer: ' + value._id + '</p>');
				getAnnotations(value._id);
			});
		}
	}, {filter:{id_corpus:corpus}});
}



// IMAGES
function showImagesCorpus(corpus){
	Camomile.getMedia(function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			console.log(response);
			$.each(response, function(key, value){
				$('#info').append('<p>&nbsp;Found image: ' + value.name + '</p>');
			});
		}
	}, {filter:{id_corpus:corpus}});
}

function addImagesToCorpus(corpus){
	$('#info').append('<p>uploading images from EcoLexicon...</p>');
	var params = {term:''}

	$.getJSON('http://manila.ugr.es/puertoterm/manzanilla/get_images_concept.php',params).done(function(response){
		$.each(response, function(key, val){
			console.log(val.concept);

			$.each(val.images, function(key,value){
				console.log('\t'+value.filename);
				Camomile.createMedium(corpus, value.filename, 'http://manila.ugr.es/visual/imagenes/'+value.filename, value.description, function(err,response){
					if (err)
						$('#info').append('ERROR while creating media in Camomile: ' + err);
					else {
						console.log(response);
						$('#info').append('<p>&nbsp;Image created: ' + response.name + '</p>');


						var data = {id:value.id_concepto, concepto:value.concepto};

						if (id_layer_conceptos != 0)
							Camomile.createAnnotation(id_layer_conceptos, response._id, '', data, function(err,response){
								if (err)
									$('#info').append('ERROR while creating annotation in Camomile: ' + err);
								else {
									$('#info').append('<p>Added annotation for concept: '+value.concepto+'</p>');
									console.log(response);
								}
							});

					}
				});
			});
		});
	});
}



// ANNOTATIONSN
function getAnnotations(layer){
	Camomile.getAnnotations(function(err,response){
		if (err)
			$('#info').append('ERROR:' + err);
		else {
			console.log(response);
			$.each(response, function(key, value){
				$('#info').append('<p>&nbsp;Found annotation: ' + value.data.concepto + '</p>');
			});
		}
	}, {filter:{id_layer:layer}});
}




$(function (){

	Camomile.setURL('http://manila.ugr.es:3000');

	
	Camomile.login('root', 'manzanilla_wisi_99', function(err,response){
		if (err)
			$('#info').append('<p>ERROR:' + err + '</p>');
		else {
			$('#info').append('<p>Login successful!!</p>');
			/*deleteCorpus('Ecolexicon Images');
			createCorpus('Ecolexicon Images');*/

			showCorpus();



			//
		}
	});


});


/*Camomile.login('root', 'manzanilla_wisi_99', function(err,response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});*/

	/*Camomile.createCorpus('Ecolexicon Images', 'corpus with all the images in Ecolexicon',function(err,response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});*/


	/**/

	/*Camomile.logout(function(err, response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});*/