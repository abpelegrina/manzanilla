var Manzanilla = function () {

};

Manzanilla.id_layer_categories = '5771bb21f9ca0a01005bddb8';
Manzanilla.id_layer_concepts = '5771bb21f9ca0a01005bddba';
Manzanilla.id_corpus = '5771bb21f9ca0a01005bddb6';
Manzanilla.medium = '';

Manzanilla.prototype.setup = function(){
	console.log(Camomile.setURL('http://manila.ugr.es:3000'));
}

Manzanilla.prototype.aunthenticate  = function(){
	this.setup();
	// already logged in? --> to main.html
	Camomile.me(function(err, response){
		if (err)
			window.location = 'index.html';
		else 
			$('#greeting').html(response.username);
	});
}

Manzanilla.prototype.login = function(){
	this.setup();
	var username = $('#username').val();
	var password = $('#password').val();

	console.log('username '+  username + ' password ' +password);

	if (username != '' && password != '')
		Camomile.login(username, password, function(err,response){
			if (err)
				window.location = 'index.html';
			else
				window.location = 'main.html';
		});
}

Manzanilla.prototype.loadImageMedium = function(filename, callback){

	if (Manzanilla.medium == '')
		Camomile.getMedia(function(err,response){
			if (response.length > 0){
				Manzanilla.medium = response[0];
				callback();
			}
		}, {filter:{id_corpus:Manzanilla.id_corpues, name:filename}});
}

Manzanilla.prototype.loadImages = function(event){
	var params = {term:$('#concept').val()}
	$('#concepts').html('');
	$.getJSON('http://manila.ugr.es/puertoterm/manzanilla/get_images_concept.php', params).done(function(response){
		$.each(response, function(id,concept){
			var list = '<li class="list-group-item" id="concepto-'+id+'"><strong class="text-capitalize">' + concept.concept+'</strong><ul class="list-inline">';

			$.each(concept.images, function(key,image){
				list += "<li><a href='tag_categories.php?img=" + image.filename + "&id="+image.id_image+"'>";
				list += "<img id='eco-image-"+image.id_image+"' id-image='"+image.id_image+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + image.filename + "' class='img-thumbnail' title='"+  image.description+"' onerror='javascript:hideImage(this);'/></a></li>";
			});


			list += '<li><button type="button" onclick="window.location=\'upload.html?concept='+id+'\';" class="btn btn-default btn-lg">Upload image <span class="glyphicon glyphicon-upload" aria-hidden="true"></span></button></li>';

			list += '</ul></li>';
			$('#concepts').append(list);
		});
	});
}

Manzanilla.prototype.tagCategory = function(event){
	console.log('selected category= '+$('#category').val());
	console.log('id image= ' + $('#id-image').val());

	var img = $('#image').val();
	var id_image = $('#id-image').val();
	var category = $('#category').val();
	var data = {category:category};

	console.log(img);


	if (Manzanilla.medium != ''){
		Camomile.getAnnotations(function(err,response){
			if (err){
				console.log('ERROR:' + err);
				showError(err);
			}
			else {
				if (response.length > 0){
					// actaulizamos la anotación
					console.log(response);
					console.log('la anotación ya existe');

					var annotation = response[0];

					if (annotation.data.category != category){
						console.log('la categoría ha cambiado --> guardando cambios');
						Camomile.updateAnnotation(annotation._id, {data:data}, function(err2,response2){
							if (err2){
								console.log('ERROR while updating annotation in Camomile: ' + err2);
								showError(err2);
							}
							else {
								console.log('updated annotation');
								console.log(response2);
								Manzanilla.gotoTagConcepts(img, id_image);
							}
						});
					}
					else 
						Manzanilla.gotoTagConcepts(img, id_image);
				}
				else {
					// creamos nueva anotación
					Camomile.createAnnotation(Manzanilla.id_layer_categories, Manzanilla.medium._id, '', data, function(err2,response2){
						if (err2) {
							console.log('ERROR while creating annotation in Camomile: ' + err2);
							showError(err2);
						}
						else {
							console.log(response2);
							Manzanilla.gotoTagConcepts(img, id_image);
						}
					});
				}
			}
		}, {filter:{id_layer:Manzanilla.id_layer_categories, id_medium:Manzanilla.medium._id}});
	}
	else
	// buscar el 'media' asociado a la imagen
	Camomile.getMedia(function(err,response){
		if (err) {
			console.log('ERROR:' + err);
			showError(err);
		}
		else {
			console.log(response);

			// recuperamos el id del medio
			if (response.length > 0 ) {
				Manzanilla.medium = response[0];

				var id_medium = response[0]._id;
				console.log(id_medium);

				Camomile.getAnnotations(function(err,response){
					if (err){
						console.log('ERROR:' + err);
						showError(err);
					}
					else {
						if (response.length > 0){
							// actaulizamos la anotación
							console.log(response);
							console.log('la anotación ya existe');

							var annotation = response[0];

							if (annotation.data.category != category){
								console.log('la categoría ha cambiado --> guardando cambios');
								Camomile.updateAnnotation(annotation._id, {data:data}, function(err2,response2){
									if (err2){
										console.log('ERROR while updating annotation in Camomile: ' + err2);
										showError(err2);
									}
									else {
										console.log('updated annotation');
										console.log(response2);
										Manzanilla.gotoTagConcepts(img, id_image);
									}
								});
							}
							else 
								Manzanilla.gotoTagConcepts(img, id_image);
						}
						else {
							// creamos nueva anotación
							Camomile.createAnnotation(Manzanilla.id_layer_categories, id_medium, '', data, function(err2,response2){
								if (err2) {
									console.log('ERROR while creating annotation in Camomile: ' + err2);
									showError(err2);
								}
								else {
									console.log(response2);
									Manzanilla.gotoTagConcepts(img, id_image);
								}
							});
						}
					}
				}, {filter:{id_layer:Manzanilla.id_layer_categories, id_medium:id_medium}});
			}
			else {
				showError('Image not found in Camomile :(');
			}
		}
	}, {filter:{name:img}});
}

Manzanilla.gotoTagConcepts = function(img, id_image){
	window.location = 'tag_concepts.php?img=' + img + '&id=' + id_image+ '&success=ok';
}

Manzanilla.gotoTagRelations = function(img, id_image){
	window.location = 'tag_relations.php?img=' + img + '&id=' + id_image+ '&success=ok';
}

Manzanilla.prototype.getImgConcepts = function(){
	var img = $('#image').val();
	var id_image = $('#id-image').val();

	Camomile.getMedia(function(err,response){
		console.log(response);
		if (err){
			showError(err);
		}
		else {
			if (response.length > 0){
				var imagen = response[0];
				Manzanilla.medium = response[0];
				console.log('imagen encontrada con id ' + imagen._id)

				Camomile.getAnnotations(function(err,response){
					if (err){
						showError(err);
					} 
					else if (response.length > 0){
						$.each(response, function(key, annotation){
							console.log(annotation.data);
							Manzanilla.addConceptToAnnotationList(annotation._id, annotation.data.concept,'#concept-list', 'remove-concept', '&times;');
						});
					}
					else {
						console.log('no concepts associated with the image :(')
					}

				}, {filter:{id_layer: Manzanilla.id_layer_concepts, id_medium:imagen._id}});
			}
			else {
				showError('Image not found in Camomile');
			}
		}


	}, {filter:{name:img}});
}

Manzanilla.prototype.setAutocompleteConcept = function(){
	$("#concept").typeahead({
	    onSelect: function(item) {
	        console.log(item);

	        var concept_data = item.value.split('||');

	        var data = {id:concept_data[0], concept:concept_data[1]};
	        	console.log(data);
	        
	        console.log(Manzanilla.medium);

	        // add annotation
			Camomile.createAnnotation(Manzanilla.id_layer_concepts, Manzanilla.medium._id, '', data, function(err2,response2){
				if (err2) {
					console.log('ERROR while creating annotation in Camomile: ' + err2);
					showError(err2);
				}
				else {
					console.log(response2);
					Manzanilla.addConceptToAnnotationList(response2._id, response2.data.concept, '#concept-list', 'remove-concept', '&times;');
				}
			});
	    },
	    ajax: {
	        url: "/puertoterm/ecolexicon/concepts_by_term.php",
	        timeout: 500,
	        displayField: "label",
	        triggerLength: 3,
	        method: "get"
	    }
	});
}

Manzanilla.prototype.searchConcepts = function(term){
	var params = {query:term}
	console.log('search term: ' + term);
	$.getJSON('/puertoterm/ecolexicon/concepts_by_term.php', params).done(function(concepts){
		$('#search-concept-results').html('');
		$("#concept").typeahead('hide');
		$.each(concepts,function(key, concept){
			console.log(concept);
			var concept_data = concept.id.split('||');
			var id= concept_data[0];
			var concepto = concept_data[1];
			Manzanilla.addConceptToList(id, concept.label, concepto, '#search-concept-results', 'add-concept', '&plus;')
		});
	});
}

Manzanilla.prototype.removeAnnotation = function(id){
	Camomile.deleteAnnotation(id, function(err, response){
		if (err)
			showError(err);
		else {
			console.log(response);
		}
	});
}

Manzanilla.prototype.addAnnotationConcept = function(id_concept, concept){

	var data ={id:id_concept, concept:concept};

	// add annotation
	Camomile.createAnnotation(Manzanilla.id_layer_concepts, Manzanilla.medium._id, '', data, function(err2,response2){
		if (err2) {
			console.log('ERROR while creating annotation in Camomile: ' + err2);
			showError(err2);
		}
		else {
			console.log(response2);
			Manzanilla.addConceptToAnnotationList(response2._id, response2.data.concept, '#concept-list', 'remove-concept', '&times;');
		}
	});
}


Manzanilla.addConceptToAnnotationList = function(id, concept, list_id, clase, icon){
	$(list_id).append('<button type="button" class="list-group-item '+clase+'" id-anno="'+id+'"><span>'+icon+'</span>&nbsp;'+concept+'</button>');
}

Manzanilla.addConceptToList = function(id, label, concept, list_id, clase, icon){
	$(list_id).append('<button type="button" class="list-group-item '+clase+'" concept="'+concept+'" id-concept="'+id+'"><span>'+icon+'</span>&nbsp;'+label+'</button>');
}

function hideImage(image){
	$(image).parent().hide();
	console.log('hide!');
}

function showError(error){
	$('#error-tag').show();
	$('#error-msg').html('Error while saving annotation: ' + error);
}