 function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

var Manzanilla = function () {

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
	// already logged in? --> to main.html
	Camomile.me(function(err, response){
		
		if (err){
			window.location = 'index.html';
		} 
		else {

			$('#greeting').html(response.username);
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
	$.getJSON('config.json').done(function(response){
		Manzanilla.id_layer_categories = response.layer_categories_id;
		Manzanilla.id_layer_concepts = response.layer_concepts_id;
		Manzanilla.id_layer_relations = response.layer_relations_id;
		Manzanilla.id_layer_vpks = response.layer_vpks_id;
		Manzanilla.id_corpus = response.corpus_id;
	});
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
							var responseHTML = "<li class='img-selector'><a target='_blank' href='tag_categories.php?id=" + response._id+"&img="+response.name+"'>";
							responseHTML += "<img id='eco-image-"+response._id+"' id-image='"+response._id+"' src='http://ecolexicon.ugr.es/puertoterm/thumb.php?src=" + response.name + "' class='img-thumbnail' title='"+  response.description+"' onerror='javascript:hideImage(this);'/></a></li>";
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


// === CATEGORIES ======================================================================================================================================
Manzanilla.prototype.tagCategory = function(){
	

	var img = $('#image').val();
	var id_image = $('#id-image').val();
	var category = $('#category').val();
	var data = {category:category};

	Camomile.getAnnotations(function(err,response){
		if (err){
			console.log('ERROR:' + err);
			showError(err);
		}
		else {
			if (response.length > 0){
				// actaulizamos la anotación
				var annotation = response[0];

				if (annotation.data.category != category){
					
					Camomile.updateAnnotation(annotation._id, {data:data}, function(err2,response2){
						if (err2){
							console.log('ERROR while updating annotation in Camomile: ' + err2);
							showError(err2);
						}
						else {
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


// === ECOLEXICON CONCEPTS =============================================================================================================================
Manzanilla.prototype.getImgConcepts = function(){
	$('#loading').show();
	Camomile.getAnnotations(function(err,response){
		$('#loading').hide();
		if (err){
			showError(err);
		} 
		else if (response.length > 0){

			$.each(response, function(key, annotation){
				Manzanilla.addConceptToAnnotationList(annotation._id, annotation.data.concept,'#concept-list', 'remove-concept', '&times;');
			});
		}
		else {
			console.log('no concepts associated with the image :(')
		}

	}, {filter:{id_layer: Manzanilla.id_layer_concepts, id_medium:Manzanilla.medium._id}});
			
}

Manzanilla.prototype.setAutocompleteConcept = function(){
	$("#concept").typeahead({
	    onSelect: function(item) {

	        var concept_data = item.value.split('||');

	        var data = {id:concept_data[0], concept:concept_data[1]};
	       

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
	var params = {query:term};
	$.getJSON('/puertoterm/manzanilla/concepts_by_term.php', params).done(function(concepts){
		$('#search-concept-results').html('');
		$("#concept").typeahead('hide');
		$.each(concepts,function(key, concept){
			var concept_data = concept.id.split('||');
			var id= concept_data[0];
			var concepto = concept_data[1];
			Manzanilla.addConceptToList(id, concept.label, concepto, '#search-concept-results', 'add-concept', '&plus;')
		});
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
Manzanilla.prototype.getImgRelations = function(){
	$('#loading').show();
	Camomile.getAnnotations(function(err,response){
		$('#loading').hide();
		if (err){
			showError(err);
		} 
		else if (response.length > 0){
			$.each(response, function(key, annotation){
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

	var data ={ source: {id:id_source, concept:source}, relation:{id:id_relation, relation:relation}, target:{id:id_target, concept:target}};

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
	$(list_id).append('<button type="button" class="list-group-item '+clase+'" id-anno="'+id_annotation+'"><span>'+icon+'</span>&nbsp;'+label+'</button>');
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
var VPKS = function(image_path, canvas_id, container_id){

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

    this.img = new Image(); 
    var that = this;
	this.img.addEventListener("load", function(){that.drawImage()}, false);
	this.img.src = image_path;
	this.init();

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

		var annotation = $('#annotation').val();
		var type = $('#type').val();

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

VPKS.prototype.loadAnnotations = function(){
	var that = this;

	$('#loading').show();
	Camomile.getAnnotations(function(err,response){

		if (err){
			showError(err);
		} 
		else if (response.length > 0){


			$('#loading').hide();
			$.each(response, function(key, annotation){
				var entry = {};
				entry.id = annotation._id;
				entry.start = annotation.fragment.start;
				entry.size = annotation.fragment.size;
				entry.annotation = annotation.data.annotation;
				entry.type = annotation.data.type;

				that.annotations.push(entry);
				
				console.log(annotation);
				VPKS.addVPKSToAnnotationList(annotation._id, annotation.data.annotation,  '#vpks-list', 'vpks-list', '&times;', annotation.data.type);


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

	var data ={annotation: annotation.annotation, type: annotation.type};
	var fragment = {start:{x: annotation.start.x, y:annotation.start.y}, size:{width:annotation.size.width, height:annotation.size.height}}

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

	$(list_id).append('<button type="button" class="list-group-item '+clase+'" id-anno="'+id_annotation+'"><span>'+icon+'</span>&nbsp;'+annotation+'&nbsp;&nbsp;<span '+ color +' class="glyphicon '+glyph+'"  aria-hidden="true"></button>');
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
    	else 
    		that.ctx.strokeStyle = "red";
    	that.ctx.strokeRect(annotation.start.x, annotation.start.y, annotation.size.width, annotation.size.height);
    	//roundedRect(that.ctx,annotation.start.x, annotation.start.y, annotation.size.width, annotation.size.height, 6);
    });
    that.ctx.strokeStyle = "red";
    if (this.drag) 
    	this.ctx.strokeRect( this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    	//roundedRect(that.ctx, this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, 6);
}

VPKS.prototype.init = function() {
	var that = this;

	this.loadAnnotations();

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
Manzanilla.gotoTagConcepts = function(img, id_image){
	window.location = 'tag_concepts.php?img=' + img + '&id=' + id_image+ '&success=ok';
}

Manzanilla.gotoTagRelations = function(img, id_image){
	window.location = 'tag_relations.php?img=' + img + '&id=' + id_image;
}

Manzanilla.gotoTagVPKs = function(img, id_image){
	window.location = 'tag_vpks.php?img=' + img + '&id=' + id_image;
}

Manzanilla.gotoMain = function(img, id_image){
	window.location = 'main.html';
}

// === ERROR HANDLING ==================================================================================================================================
function showError(error){
	$('#error-tag').show();
	$('#error-msg').html('Error while saving annotation: ' + error);
}