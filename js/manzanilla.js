 function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

var Manzanilla = function () {
	var user_id;
	var username;
};

/*Manzanilla.id_layer_categories = '5771bb21f9ca0a01005bddb8';
Manzanilla.id_layer_concepts = '5771bb21f9ca0a01005bddba';
Manzanilla.id_layer_relations = '5771bb21f9ca0a01005bddbc';
Manzanilla.id_layer_vpks = '5771bb21f9ca0a01005bddbe';
Manzanilla.id_corpus = '5771bb21f9ca0a01005bddb6';*/

// current medium
Manzanilla.medium = '';


// === SETTING UP CAMOMILE =============================================================================================================================
Manzanilla.prototype.setup = function(){
	this.getCamomileIDs();
	Camomile.setURL('http://manila.ugr.es:3000');
}

  var callback_default = function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  };

Manzanilla.prototype.aunthenticate  = function(callback){
	
	callback = callback || callback_default;

	this.setup();
	var that = this;
	// already logged in? --> to main.html
	Camomile.me(function(err, response){
		
		if (err){
			window.location = 'index.html';
		} 
		else {

			$('#greeting').html(response.username);
			that.user_id = response._id;
			that.username = response.username;
			//Manzanilla.username = response.username;
			callback(err, response);
		}
	});
	
	
}

Manzanilla.prototype.login = function(){
	this.setup();
	var username = $('#username').val();
	var password = $('#password').val();

	if (username != '' && password != '')
		Camomile.login(username, password, function(err,response){
			if (err)
				window.location = 'index.html';
			else
				window.location = 'main.html';
		});
}

Manzanilla.prototype.getCamomileIDs = function(){

	Manzanilla.id_layer_categories = config.layer_categories_id;
	Manzanilla.id_layer_concepts = config.layer_concepts_id;
	Manzanilla.id_layer_relations = config.layer_relations_id;
	Manzanilla.id_layer_vpks = config.layer_vpks_id;
	Manzanilla.id_corpus = config.corpus_id;

	/*$.getJSON('config.json').done(function(response){
		Manzanilla.id_layer_categories = response.layer_categories_id;
		Manzanilla.id_layer_concepts = response.layer_concepts_id;
		Manzanilla.id_layer_relations = response.layer_relations_id;
		Manzanilla.id_layer_vpks = response.layer_vpks_id;
		Manzanilla.id_corpus = response.corpus_id;
	});*/
}


// ===  SEARCH ECOLEXICON IMAGES ======================================================================================================================
Manzanilla.prototype.loadImages = function(event){


	// search in the images tagged in Camomile instead of in EcoLexicon DB
	var concept = $('#concept').val();
	Camomile.getAnnotations(function(err,response){
		if (err)
			showError(err);
		else if (response.length > 0){
			var list = {};
			$.each(response, function(key, annotation){
				if (annotation.data.concept.includes(concept)){
					//console.log(annotation);

					if (typeof list[annotation.data.concept] === "undefined"){
						list[annotation.data.concept] = {};
						list[annotation.data.concept].id = annotation.data.id;
						list[annotation.data.concept].annotations = [];
					}
						

					list[annotation.data.concept].annotations.push(annotation);

				}
			});

			$.each(list, function(concept, data){
				console.log(concept);
				var listHTML = '<li class="list-group-item"><strong class="text-capitalize">' + concept+'</strong><ul class="list-inline"  id="concept-'+data.id+'">';
				$.each(data.annotations, function(key, anno){
					
					Camomile.getMedium(anno.id_medium, function(err, response){	
							var responseHTML = "<li class='img-selector'>";

							responseHTML += '<div class="image-result">';
							responseHTML += "<img id='eco-image-"+response._id+"' id-image='"+response._id+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + response.name + "' class='img-thumbnail centered' title='"+  response.description+"' onerror='javascript:hideImage(this);'/>";

							// add buttons
							responseHTML += '<div class="over-image">';
							responseHTML += "<a class='btn btn-xxs btn-primary' style='display:block;float:right;margin-right:3px;' target='_blank' href='tag_categories.php?id=" + response._id+"&img="+response.name+"'>Edit tags</a>";
							responseHTML += "<a class='btn btn-xxs btn-info'  style='display:block;float:right;' target='_blank' href='image_tags.php?id=" + response._id+"&img="+response.name+"'>View tags</a>";

							responseHTML += "</div></div></li>";
							$('#concept-'+anno.data.id).append(responseHTML);
						
					});
				});


				listHTML += '</ul></li>';

				$('#concepts').append(listHTML);
			});
		}
		else 
			console.log('no images associated with the concept :(')

	}, {filter: {id_layer:Manzanilla.id_layer_concepts} });
}

// hides an image and its parent and grand-parent
function hideImage(image){
	$(image).parent().parent().hide();
	console.log('hide!');
}

// === PROMISES ========================================================================================================================================

Manzanilla.getCategoryPromise = function(){
	return new Promise (function(resolve,reject) {
		Camomile.getAnnotations(function(err,response){
			if (err)
				reject(err);
			else
				resolve(response);
		}, {filter:{id_layer:Manzanilla.id_layer_categories, id_medium:Manzanilla.medium._id}});
	});
}

Manzanilla.getConceptsPromise = function(){
	return new Promise (function(resolve,reject) {
		Camomile.getAnnotations(function(err,response){
			if (err)
				reject(err);
			else
				resolve(response);
		}, {filter:{id_layer:Manzanilla.id_layer_concepts, id_medium:Manzanilla.medium._id}});
	});
}

Manzanilla.getRelationsPromise = function(){
	return new Promise (function(resolve,reject) {
		Camomile.getAnnotations(function(err,response){
			if (err)
				reject(err);
			else
				resolve(response);
		}, {filter:{id_layer:Manzanilla.id_layer_relations, id_medium:Manzanilla.medium._id}});
	});
}

Manzanilla.getVPKsPromise = function(){
	return new Promise (function(resolve,reject) {
		Camomile.getAnnotations(function(err,response){
			if (err)
				reject(err);
			else
				resolve(response);
		}, {filter:{id_layer:Manzanilla.id_layer_vpks, id_medium:Manzanilla.medium._id}});
	});
}

Manzanilla.getGroupUsers = function(){
	return new Promise (function(resolve,reject) {
		Camomile.getGroup(config.id_user_group, function(err,response){
			if (err)
				reject(err);
			else
				resolve(response);
		});
	});
}

// === GET IMAGE MEDIUM ================================================================================================================================
Manzanilla.loadImageMedium = function(filename, callback){
	
	if (Manzanilla.medium == '') {
		Camomile.getMedium(filename,function(err,response){
			if (err)
				console.log(err);
			else {
				Manzanilla.medium = response;
				callback();
			}
		});
	}
}


Manzanilla.getAllImagesAnnotatios = function (filename, callback){
	var data = {};

	var calls = [Manzanilla.getCategoryPromise(), Manzanilla.getConceptsPromise(), Manzanilla.getRelationsPromise(), Manzanilla.getVPKsPromise(),];


	Promise.all(calls).then(function(results){



		data.category = results[0];
		data.concepts = results[1];
		data.relations = results[2];
		data.vpks = results[3];
		console.log(data);

		callback(data);
	});
}

Manzanilla.getAllImagesAnnotationsByUser = function (filename, callback){
	var data = {};

	var calls = [Manzanilla.getCategoryPromise(), Manzanilla.getConceptsPromise(), Manzanilla.getRelationsPromise(), Manzanilla.getVPKsPromise()];


	Promise.all(calls).then(function(results){


		$.each(results[0], function(key,annotation){
			
			if (typeof(annotation.data.author) !== 'undefined'){

				if (typeof(data[annotation.data.author]) == 'undefined')
					data[annotation.data.author] = {};

				if (typeof(data[annotation.data.author].category) == 'undefined')
					data[annotation.data.author].category = [];

				data[annotation.data.author].category.push(annotation);
			}
		});

		$.each(results[1], function(key,annotation){
			if (typeof(annotation.data.author) !== 'undefined'){
				if (typeof(data[annotation.data.author]) == 'undefined')
					data[annotation.data.author] = {};

				if (typeof(data[annotation.data.author].concepts) == 'undefined')
					data[annotation.data.author].concepts = [];
				data[annotation.data.author].concepts.push(annotation);
			}
		});

		$.each(results[2], function(key,annotation){
			if (typeof(annotation.data.author) !== 'undefined'){
				if (typeof(data[annotation.data.author]) == 'undefined')
					data[annotation.data.author] = {};

				if (typeof(data[annotation.data.author].relations) == 'undefined')
					data[annotation.data.author].relations = [];
				data[annotation.data.author].relations.push(annotation);
			}
		});

		$.each(results[3], function(key,annotation){
			if (typeof(annotation.data.author) !== 'undefined'){
				if (typeof(data[annotation.data.author]) == 'undefined')
					data[annotation.data.author] = {};

				if (typeof(data[annotation.data.author].vpks) == 'undefined')
					data[annotation.data.author].vpks = [];
				data[annotation.data.author].vpks.push(annotation);
			}
		});

		console.log(data);

		callback(data);
	});
}


// === CATEGORIES ======================================================================================================================================
Manzanilla.prototype.tagCategory = function(eval=false){
	

	var img = $('#image').val();
	var id_image = $('#id-image').val();
	var category = $('#category').val();
	var data = {category:category, author:this.username, id_author:this.user_id};

	var that = this;

	if (category == 'none') return;

	Camomile.getAnnotations(function(err,response){
		if (err){
			console.log('ERROR:' + err);
			showError(err);
		}
		else if (response.length > 0 ){
				
			$.each(response, function(key, annotation){

				if (annotation.data.author == that.username && annotation.data.category != category){
					
					Camomile.updateAnnotation(annotation._id, {data:data}, function(err2,response2){
						if (err2){
							console.log('ERROR while updating annotation in Camomile: ' + err2);
							showError(err2);
						}
						else 
							Manzanilla.gotoTagConcepts(img, id_image, eval);
					});
				} 
				else 
					Manzanilla.gotoTagConcepts(img, id_image, eval);
			});
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
					Manzanilla.gotoTagConcepts(img, id_image, eval );
				}
			});
		}
	}, {filter:{id_layer:Manzanilla.id_layer_categories, id_medium:Manzanilla.medium._id}});
}



// === ECOLEXICON CONCEPTS =============================================================================================================================
Manzanilla.prototype.getImgConcepts = function(filter_author = false){
	$('#loading').show();
	var that = this;
	Camomile.getAnnotations(function(err,response){
		$('#loading').hide();
		if (err){
			showError(err);
		} 
		else if (response.length > 0){
			console.log(response);
			$.each(response, function(key, annotation){

				if (!filter_author || annotation.data.author == that.username){
					Manzanilla.addConceptToAnnotationList(annotation._id, annotation.data.concept,'#concept-list', 'remove-concept', '&times;');
				}
			});

			that.getConceptSuggestions(response);
		}
		else {
			console.log('no concepts associated with the image :(')
		}

	}, {filter:{id_layer: Manzanilla.id_layer_concepts, id_medium:Manzanilla.medium._id}});		
}

Manzanilla.prototype.setAutocompleteConcept = function(){
	var that = this;
	$("#concept").typeahead({
	    onSelect: function(item) {

	        var concept_data = item.value.split('||');

	        var data = {id:concept_data[0], concept:concept_data[1], author:that.username, id_author:that.user_id};
	       

			if (data.id == -21)
				window.open('http://manila.ugr.es/puertoterm/concepto.php?eleccion=nuevo');
			else {
		        // add annotation
				Camomile.createAnnotation(Manzanilla.id_layer_concepts, Manzanilla.medium._id, '', data, function(err2,response2){
					if (err2) {
						console.log('ERROR while creating annotation in Camomile: ' + err2);
						showError(err2);
					}
					else {
						Manzanilla.addConceptToAnnotationList(response2._id, response2.data.concept, '#concept-list', 'remove-concept', '&times;');
					}
				});
			}
	    },
	    title: 'title',
	    alignWidth: false,
	    ajax: {
	        url: "/puertoterm/manzanilla/concepts_by_term.php",
	        displayField: "label",
	        loadingClass: 'loadinggif',
	        timeout: 200,
	        triggerLength: 3,
	        method: "get"
	    }
	});
}


Manzanilla.prototype.setAutocompleteConceptVPK = function(){
	var that = this;
	$("#concept").typeahead({
	    onSelect: function(item) {

	        var concept_data = item.value.split('||');

	        var data = {id:concept_data[0], concept:concept_data[1], author:that.username, id_author:that.user_id};
	       

			$('#concept_id').val(data.id);
	    },
	    title: 'title',
	    alignWidth: false,
	    ajax: {
	        url: "/puertoterm/manzanilla/concepts_by_term.php",
	        displayField: "label",
	        loadingClass: 'loadinggif',
	        timeout: 200,
	        triggerLength: 3,
	        method: "get"
	    }
	});
}

Manzanilla.prototype.searchConcepts = function(term){
	$('#no-results').hide();
	var params = {query:term};
	$.getJSON('/puertoterm/manzanilla/concepts_by_term.php', params).done(function(concepts){
		$('#search-concept-results').html('');
		$("#concept").typeahead('hide');

		if(concepts.length > 0)
			$.each(concepts,function(key, concept){
				var concept_data = concept.id.split('||');
				var id= concept_data[0];
				var concepto = concept_data[1];
				Manzanilla.addConceptToList(id, concept.label, concepto, '#search-concept-results', 'add-concept', '&plus;')
			});
		else
			$('#no-results').show();
	});
}

Manzanilla.prototype.addAnnotationConcept = function(id_concept, concept){

	var data ={id:id_concept, concept:concept, author:this.username, id_author:this.user_id};

	// add annotation
	Camomile.createAnnotation(Manzanilla.id_layer_concepts, Manzanilla.medium._id, '', data, function(err2,response2){
		if (err2) {
			console.log('ERROR while creating annotation in Camomile: ' + err2);
			showError(err2);
		}
		else {
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

// === ECOLEXICON RELATIONS ============================================================================================================================ 
Manzanilla.prototype.getImgRelations = function(filter_author = false){
	var that=this;
	$('#loading').show();
	Camomile.getAnnotations(function(err,response){
		$('#loading').hide();
		if (err){
			showError(err);
		} 
		else if (response.length > 0){
			$.each(response, function(key, annotation){
				console.log(annotation);
				if (!filter_author || annotation.data.author == that.username)
					Manzanilla.addRelationToAnnotationList(annotation._id, annotation.data.source.id, annotation.data.source.concept, annotation.data.relation.id, annotation.data.relation.relation, annotation.data.target.id, annotation.data.target.concept,'#relation-list', 'remove-concept', '&times;');
			});
		}
		else {
			console.log('no relations associated with the image :(')
		}

	}, {filter:{id_layer: Manzanilla.id_layer_relations, id_medium:Manzanilla.medium._id}});	
}

Manzanilla.prototype.setAutocompleteRelation = function(target){
	target.typeahead({
	    onSelect: function(item) {
	       
	        var concept_data = item.value.split('||');
	        var id=concept_data[0], concept=concept_data[1];
	        var label_id = '#'+target.attr('id')+'-id';
	        var label_concept = '#'+target.attr('id')+'-concept';

	        $(label_id).val(id);
	        $(label_concept).val(concept);
	    },
	    title: 'title',
	    alignWidth: false,
	    ajax: {
	        url: "/puertoterm/manzanilla/concepts_by_term.php",
	        displayField: "label",
	        triggerLength: 3,
	        timeout: 200,
	        loadingClass: 'loadinggif',
	        method: "get"
	    }
	});
}

Manzanilla.addAnnotationRelation = function(id_source, source, id_relation, relation, id_target, target, callback){

	var data = { 
		source: {
			id:id_source, 
			concept:source
		},    
		relation:{
			id:id_relation, 
			relation:relation
		},
		target:{
			id:id_target, 
			concept:target
		}
	};

	console.log(data);

	Camomile.createAnnotation(Manzanilla.id_layer_relations, Manzanilla.medium._id, '', data, function(err,response){
		if (err) {
			console.log('ERROR while creating annotation in Camomile: ' + err);
			showError(err);
		}
		else {
			callback(response);
		}
	});
}


Manzanilla.prototype.addAnnotationRelation = function(id_source, source, id_relation, relation, id_target, target, callback){

	var data = { 
		source: {
			id:id_source, 
			concept:source
		},    
		relation:{
			id:id_relation, 
			relation:relation
		},
		target:{
			id:id_target, 
			concept:target
		},

		author:this.username, id_author:this.user_id};

	console.log(data);

	Camomile.createAnnotation(Manzanilla.id_layer_relations, Manzanilla.medium._id, '', data, function(err,response){
		if (err) {
			console.log('ERROR while creating annotation in Camomile: ' + err);
			showError(err);
		}
		else {
			callback(response);
		}
	});
}

Manzanilla.addRelationToAnnotationList = function(id_annotation, id_source, source, id_relation, relation, id_target, target, list_id, clase, icon){
	var label = '<span class="relation">'+source + '</span><span class="relation">' + relation + '</span><span class="relation">' + target +'</span>';
	$(list_id).append('<button type="button" id-source="'+id_source+'" r-target="'+target+'" id-target="'+id_target+'" r-source="'+source+'" id-relation="'+id_relation+'" r-relation="'+relation+'"  class="list-group-item '+clase+'" id-anno="'+id_annotation+'"><span>'+icon+'</span>&nbsp;'+label+'</button>');
}

// === GENERIC REMOVE ANNOTATION =======================================================================================================================
Manzanilla.prototype.removeAnnotation = function(id){
	Camomile.deleteAnnotation(id, function(err, response){
		if (err)
			showError(err);
		else {
			console.log(response);
		}
	});
}


Manzanilla.removeAnnotation = function(id){
	Camomile.deleteAnnotation(id, function(err, response){
		if (err)
			showError(err);
		else {
			console.log(response);
		}
	});
}

// === VPKS ============================================================================================================================================
var VPKS = function(image_path, canvas_id, container_id, username='', filter_author=false){

	/*	List of annotations. Structure of annotation:		
		var annotation = {
			id:_,
			start: {x:_, y:_},
			size: {width:_, height:_},
			annotation:"",
			type:aType
		}
	*/
	this.annotations = [];
	this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext("2d");	
    this.rect = {};
    this.drag = false;
    this.container = container_id;
    this.selected = '';
    this.username = username;

    this.img = new Image(); 
    var that = this;
	this.img.addEventListener("load", function(){that.drawImage()}, false);
	this.img.src = image_path;
	this.init(filter_author);

	$(document.body).on('mouseover', '.vpks-list', function(event){
		var id_anno = $(event.target).attr('id-anno');
		that.selected = id_anno;
		that.ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
		that.draw();
    });

    $(document.body).on('mouseleave', '.vpks-list', function(event){
		that.selected = '';
		that.ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
		that.draw();
    });

    // stop drawing when escape key is pressed
	$(document).keyup(function(e) {
	     if (e.keyCode == 27 && that.drag) { // escape key maps to keycode `27` 
	     	that.drag = false;
	     	that.draw();
	    }
	});


	$('#vpk-dialog').on('shown.bs.modal', function () {
		$('#annotation').focus()
	});


	$('#vpk-dialog').on('hidden.bs.modal', function () {
		that.rect = {};
		that.ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
		that.draw();
	});

	$('#save-vpk').click(function(event){
		$('#vpk-dialog').modal('hide');

		var type = $('#type').val();
		var annotation = $('#annotation').val();

		if (type == 'concept'){
			annotation = 'Concept "' + $('#concept').val() + '"';
		}

	    if (annotation != null) {
		    var note = {
					start: {x:that.rect.startX, y:that.rect.startY},
					size: {width:that.rect.w, height:that.rect.h},
					annotation: annotation,
					type:type
				};

			that.annotations.push(note);
			that.addAnnotationVPKs(note, function(annotation){
		    	note.id = annotation._id;
		    	VPKS.addVPKSToAnnotationList(annotation._id, annotation.data.annotation,  '#vpks-list', 'vpks-list', '&times;', annotation.data.type);
		    	console.log(that.annotations);
			});	
		}

		that.rect = {};
		that.ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
		that.draw();
		$('#vpk-dialog').modal('hide');
	});

	$(document.body).on('click', '.vpks-list', function(event){
      //removeConceptAnnotation($(this));
      var id = $(this).attr('id-anno');

      if(confirm('Do you really want to delete the annotation?')){
        $(this).remove();
        Manzanilla.removeAnnotation(id);
        //$.each(that.annotations, function(key, annotation){

        var found = false;
        for (var i=0;  i<that.annotations.length && !found; i++){
        	if (that.annotations[i].id == id){
        		found = true;
        		that.annotations.splice(i, 1);
        	}
        }

        that.draw();
      }
    });
}


// --- Dealing with Camomile -----

VPKS.prototype.loadAnnotations = function(filter_author=false){
	var that = this;

	$('#loading').show();
	Camomile.getAnnotations(function(err,response){

		if (err){
			showError(err);
		} 
		else if (response.length > 0){


			$('#loading').hide();
			$.each(response, function(key, annotation){

				console.log(annotation);

				if (!filter_author || annotation.data.author == that.username){
					var entry = {};
					entry.id = annotation._id;
					entry.start = annotation.fragment.start;
					entry.size = annotation.fragment.size;
					entry.annotation = annotation.data.annotation;
					entry.type = annotation.data.type;
					that.annotations.push(entry);
					VPKS.addVPKSToAnnotationList(annotation._id, annotation.data.annotation,  '#vpks-list', 'vpks-list', '&times;', annotation.data.type);
				}
				//
				//Manzanilla.removeAnnotation(annotation._id);
			});
			that.ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
			that.draw();
		}
		else {
			$('#loading').hide();
			console.log('no vpks for the image :(')
		}

	}, {filter:{id_layer: Manzanilla.id_layer_vpks, id_medium:Manzanilla.medium._id}});	
}

VPKS.prototype.addAnnotationVPKs = function(annotation, callback){


	var data ={annotation: annotation.annotation, type: annotation.type, author:this.username, id_author:this.user_id};
	var fragment = {start:{x: annotation.start.x, y:annotation.start.y}, size:{width:annotation.size.width, height:annotation.size.height}};

	console.log(data);

	Camomile.createAnnotation(Manzanilla.id_layer_vpks, Manzanilla.medium._id, fragment, data, function(err,response){
		if (err) {
			console.log('ERROR while creating annotation in Camomile: ' + err);
			showError(err);
		}
		else {
			console.log(response);
			callback(response);
		}
	});
}

// --- UI Stuff ------------------
VPKS.addVPKSToAnnotationList = function(id_annotation, annotation,  list_id, clase, icon, type){
	console.log('adding ' + type + ' to list');

	var glyph ='';
	var color = '';
	if (type == 'label'){
		glyph = 'glyphicon-tag';
		color = 'style="color:green"';
	}
	else if (type == 'arrow'){
		glyph = 'glyphicon-arrow-right';
		color = 'style="color:red"';
	}
	else if (type == 'color'){
		glyph = 'glyphicon-tint';
		color = 'style="color:blue"';
	}
	else if (type == 'concept'){
		glyph = 'glyphicon-tree-conifer';
		color = 'style="color:orange"';
	}


	if (icon != '')
		icon = '&nbsp;&nbsp;<span class="glyphicon glyphicon-remove remove-vpk"  aria-hidden="true"></span>';

	$(list_id).append('<button type="button" class="list-group-item '+clase+'" id-anno="'+id_annotation+'">'+
				'<span '+ color +' class="glyphicon '+glyph+'"  aria-hidden="true"></span>&nbsp;'+annotation + icon +'</button>');
}

// --- Canvas drawing ------------
VPKS.prototype.drawImage = function(){
	if (this.img.width > $('#'+this.container).width()){
		this.canvas.width = $('#'+this.container).width();
		this.canvas.height = this.canvas.width * (this.img.height / this.img.width);
	}
	else {
		this.canvas.width = this.img.width;
		this.canvas.height = this.img.height;
	}

	this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
}

VPKS.prototype.mouseDown = function(e) {
    this.rect.startX = e.pageX - $(e.target).offset().left;
   	this.rect.startY = e.pageY - $(e.target).offset().top;
    this.drag = true;
}

VPKS.prototype.mouseUp = function() {
    this.drag = false;
    

    $('#vpk-dialog').modal('show');
    
    /*var annotation =  prompt("Please enter the text for the annotation", "");

    if (annotation != null) {
	    var note = {
				start: {x:this.rect.startX, y:this.rect.startY},
				size: {width:this.rect.w, height:this.rect.h},
				annotation:annotation,
				type:aType;
			};

		this.annotations.push(note);
		var that = this;
		this.addAnnotationVPKs(note, function(annotation){
	    	note.id = annotation._id;
	    	VPKS.addVPKSToAnnotationList(annotation._id, annotation.data.annotation,  '#vpks-list', 'vpks-list', '&times;');
	    	console.log(that.annotations);
		});	
	}

	this.rect = {};
	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.draw();*/
}

VPKS.prototype.mouseMove = function(e){
	
	if (this.drag) {
		this.rect.w = (e.pageX - $(e.target).offset().left) - this.rect.startX;
		this.rect.h = (e.pageY - $(e.target).offset().top) - this.rect.startY ;
		this.ctx.clearRect(0,0, this.canvas.width,  this.canvas.height);
		this.draw();
		
	}
}

VPKS.prototype.draw = function () {
	this.ctx.lineWidth = 2;
    this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    var that = this;
    $.each(this.annotations, function(key, annotation){
    	
    	if (that.selected == annotation.id)
    		that.ctx.strokeStyle = "yellow";
    	else if (annotation.type == 'arrow')
    		that.ctx.strokeStyle = "red";
    	else if (annotation.type == 'color')
    		that.ctx.strokeStyle = "blue";
    	else if (annotation.type == 'label')
    		that.ctx.strokeStyle = "green";
    	else if (annotation.type == 'concept')
    		that.ctx.strokeStyle = "orange";
    	else 
    		that.ctx.strokeStyle = "red";
    	that.ctx.strokeRect(annotation.start.x, annotation.start.y, annotation.size.width, annotation.size.height);
    });
    that.ctx.strokeStyle = "red";
    if (this.drag) 
    	this.ctx.strokeRect( this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    	//roundedRect(that.ctx, this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, 6);
}

VPKS.prototype.init = function(filter_author=false) {
	var that = this;

	this.loadAnnotations(filter_author);

    this.canvas.addEventListener('mousedown', function(e){that.mouseDown(e);}, false);
    this.canvas.addEventListener('mouseup',   function(e){that.mouseUp(e);},   false);
    this.canvas.addEventListener('mousemove', function(e){that.mouseMove(e);}, false);
}



function roundedRect(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
}


// === NAVIGATON =======================================================================================================================================
Manzanilla.gotoTagConcepts = function(img, id_image, eval=false){

	var eval_sufix = '_eval';
	if (!eval)
		eval_sufix = '';
	window.location = 'tag_concepts'+ eval_sufix +'.php?img=' + img + '&id=' + id_image+ '&success=ok';

}

Manzanilla.gotoTagRelations = function(img, id_image, eval=false){
	var eval_sufix = '_eval';
	if (!eval)
		eval_sufix = '';
	window.location = 'tag_relations'+ eval_sufix +'.php?img=' + img + '&id=' + id_image;
}

Manzanilla.gotoTagVPKs = function(img, id_image, eval=false){
	var eval_sufix = '_eval';
	if (!eval)
		eval_sufix = '';
	window.location = 'tag_vpks'+ eval_sufix +'.php?img=' + img + '&id=' + id_image;
}

Manzanilla.gotoMain = function(img, id_image){
	window.location = 'main.html';
}

Manzanilla.gotoMine = function(img, id_image){
	window.location = 'mine.php';
}

Manzanilla.close = function(){
	window.close();
}

// == SUGGESTIONS ======================================================================================================================================

function remove_duplicates(objectsArray) {
    var usedObjects = {};

    for (var i=objectsArray.length - 1;i>=0;i--) {
        var so = JSON.stringify(objectsArray[i]);

        if (usedObjects[so]) {
            objectsArray.splice(i, 1);

        } else {
            usedObjects[so] = true;          
        }
    }

    return objectsArray;

}

Manzanilla.prototype.getConceptSuggestions = function(response){
	Promise.all(
        response.map(function(val){                    	
        	return $.getJSON('/puertoterm/manzanilla/concepts_suggestions.php?id='+ val.data.id+'&get_id=1'); 
			
		})
    ).then(function(relations){

    	var concepts = [];
    	var added = [];
    	//remove_duplicates([].concat.apply([], relations));

    	relations.forEach(function(x){
    		added.push(x.id_concept);
    		x.suggestions.forEach(function(y){
    			concepts.push(y.source);
    			concepts.push(y.target);
    		});
    	});
    	concepts = remove_duplicates(concepts);

    	$('#loading2').hide();
		$.each(concepts, function(key, c){
			if (added.indexOf(c.id) == -1 )
				Manzanilla.addConceptToList(c.id, c.concept, c.concept, '#suggestions', 'add-concept', '+');
		});
	});	
}

Manzanilla.prototype.getRelationSuggestions = function(){

	Camomile.getAnnotations(function(err,response){
		if (err){
			showError(err);
		} 
		else if (response.length > 0){
			Promise.all(
                response.map(function(val){                    
                	return $.getJSON('/puertoterm/manzanilla/concepts_suggestions.php?id='+val.data.id); 
				})
            ).then(function(relations){
            	var relations2 = remove_duplicates([].concat.apply([], relations));
            	$('#loading2').hide();
				$.each(relations2, function(key, relationship){
					Manzanilla.addRelationToAnnotationList('-1', relationship.source.id, relationship.source.concept, relationship.relation.id, relationship.relation.relation,  relationship.target.id,  relationship.target.concept, '#suggestions', 'add-relation', '+');
				});
			});
		}
		else {
			console.log('no relationa associated with the image :(')
		}

	}, {filter:{id_layer: Manzanilla.id_layer_concepts, id_medium:Manzanilla.medium._id}});		
}
// === USERS' TAGS =====================================================================================================================================
Manzanilla.prototype.loadImagesTaggedbyUser = function(){
	var username = this.username;

	var ids_layer = [];
	ids_layer.push(Manzanilla.id_layer_concepts);
	ids_layer.push(Manzanilla.id_layer_relations);
	ids_layer.push(Manzanilla.id_layer_vpks);
	ids_layer.push(Manzanilla.id_layer_categories);
	

	Promise.all(
        ids_layer.map(function(val){                    
        	// 57718983f9ca0a01005c0d02/annotation?id_medium=577189e2f9ca0a01005c2578
        	return $.ajax({
   				url: 'http://manila.ugr.es:3000/layer/'+val+'/annotation',
				xhrFields: {
				      withCredentials: true
				}
			}); 
        	//Camomile.getAnnotations(function(err,response){annotations.concat(response)}, {filter:{id_layer: val, data:{concept:'snow'}}});
    	})
    ).then(function(annotations){
     	annotations = [].concat.apply([], annotations);
       	//console.log(annotations);
       	var userTags = [];
       	annotations.forEach(function(x){

	    	if (typeof x.data.author !== "undefined" && x.data.author == username){
	       		userTags.push(x.id_medium);
	       		console.log(x);
	       	}
       	});

       	userTags = remove_duplicates(userTags);
       	console.log(userTags);

       	userTags.forEach(function(img){
       		Camomile.getMedium(img, function(err, response){	
					var responseHTML = "<li><a target='_blank' href='image_tags.php?id=" + response._id+"&img="+response.name+"'>";
					responseHTML += "<img id='eco-image-"+response._id+"' id-image='"+response._id+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + response.name + "' class='img-thumbnail' title='"+  response.description+"' onerror='javascript:hideImage(this);'/></a></li>";
					$('#concepts').append(responseHTML);
				
			});
       });
    });

}


// === TOOL EVALUATION =================================================================================================================================

Manzanilla.prototype.loadEvalImages = function(imgs){
    Promise.all(
        imgs.map(function(img){                    
        	Camomile.getMedia(
        		function(err, response){
        			console.log(response);

        			response.forEach(function(img){
        				var responseHTML = "<li><a target='_blank' href='tag_categories_eval.php?id=" + img._id+"&img="+img.name+"'>";
						responseHTML += "<img id='eco-image-"+img._id+"' id-image='"+img._id+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + img.name + "' class='img-thumbnail' title='"+  img.description+"' onerror='javascript:hideImage(this);'/></a></li>";
						$('#concepts').append(responseHTML);
        			});

        		}

        	,{filter:{name:img,id_corpus:Manzanilla.id_corpus}});
    	})
    ).then(function(images){
    	console.log('all images loaded');
    });
}


Manzanilla.prototype.loadResultImages  = function(imgs){
    Promise.all(
        imgs.map(function(img){                    
        	Camomile.getMedia(
        		function(err, response){
        			console.log(response);

        			response.forEach(function(img){
        				var responseHTML = "<li><a target='_blank' href='all_tags.php?id=" + img._id+"&img="+img.name+"'>";
						responseHTML += "<img id='eco-image-"+img._id+"' id-image='"+img._id+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + img.name + "' class='img-thumbnail' title='"+  img.description+"' onerror='javascript:hideImage(this);'/></a></li>";
						$('#concepts').append(responseHTML);
        			});

        		}

        	,{filter:{name:img,id_corpus:Manzanilla.id_corpus}});
    	})
    ).then(function(images){
    	console.log('all images loaded');
    });
}


Manzanilla.prototype.getAllTags = function(){

}

// === ERROR HANDLING ==================================================================================================================================
function showError(error){
	$('#error-tag').show();
	$('#error-msg').html('Error while saving annotation: ' + error);
}