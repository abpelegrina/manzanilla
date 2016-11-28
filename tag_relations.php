
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">

    <title>Manzanilla · Image tagger for EcoLexicon</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Manzanilla</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li><a href="main.html">Home</a></li>
            <li><a href="#">Hello, <span id='greeting'>user</span></a></li> 
             <li><a href="mine.php">My tags</a></li>
            <li><a href="tag.html">Tag image</a></li>
            <li><a href="logout.html">Log out</a></li>
            <!--li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li-->
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    

<div class="container" id='search-container'>
  <div class="page-header">
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with relations between EcoLexicon concepts.</small></h1>
  </div>

  <div class="row">
    <div class="col-md-6">
       <?php echo "<img  id='the-image' src='http://ecolexicon.ugr.es/visual/imagenes/".$_GET['img']."' class='img-responsive img-thumbnail'/>";?>
    </div>
    <div class="col-md-6"  id='tag-form'>

      <h4>Current annotations</h4>
      <div class='loadinggif' id='loading'>Loading list</div>
      <div id='relation-list' class="list-group"></div>

      <hr>
      <h4>Add new annotations</h4>


      <form class="form-inline">


        <input type="hidden" name="source-id" id="source-id" value=""/>
        <input type="hidden" name="source-concept" id="source-concept" value=""/>
        <input type="hidden" name="target-id" id="target-id" value=""/>
        <input type="hidden" name="target-concept" id="target-concept" value=""/>

        <div class="form-group">
          <div class="input-group">
            <!--div class="input-group-addon">Source</div-->
            <input type="text" class="form-control"  autocomplete="off" name="source" id="source" placeholder="Source concept">
          </div>
        </div>
        <div class="form-group">
          <label class="sr-only" for="exampleInputPassword3">Password</label>
          <select class="form-control" name="relation" id="relation">
            <optgroup label="Generic-specific relations">
              <option value="1">type of</option>
            </optgroup>

            <optgroup label="Part-whole relations">
              <option value="3">part of</option>
              <option value="9">made of</option>
              <option value="16">delimited by</option>
              <option value="11">located at</option>
              <option value="31">takes place in</option>
              <option value="33">phase of</option>
            </optgroup>

            <optgroup label="Non-hierarchical relations">
              <option value="18">affects</option>
              <option value="14">attribute of</option>
              <option value="32">causes</option>              
              <option value="2">opposite of</option>              
              <option value="20">studies</option>             
              <option value="23">measures</option>              
              <option value="22">represents</option>
              <option value="5">result of</option>
              <option value="26">effected by</option>
              <option value="7">has function</option>
            </optgroup>            
          </select>
        </div>
        <div class="form-group">
          <div class="input-group">
            <!--div class="input-group-addon">Target</div-->
            <input type="text" class="form-control"  autocomplete="off" id="target" placeholder="Target concept">
          </div>
        </div>
        <button type='button' id='add-anno-relation' class="btn btn-primary">Add</button>
      </form>

      <!--div class="input-group">
          <input type="text" class="form-control" id="concept" size="100" placeholder="Search concept">
          <span class="input-group-btn" style="width:0;">
            <button class="btn btn-primary" id="search-concept" type="button">Search &nbsp;
              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
          </span>
      </div-->
      <br/>
      

      <input type='hidden' name='id-image' id='id-image' value="<?php echo $_GET['id']?>"/>
      <input type='hidden' name='image' id='image' value="<?php echo $_GET['img']?>"/>


      <div class="list-group" id='search-concept-results'></div>

      <div class="alert alert-danger" role="alert" id='error-tag'>
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>
          <span id='error-mgs'></span>
      </div>

      <div id='search-concept-results'></div>

      <div class="panel panel-default" id="panel-suggestions">
        <div class="panel-heading">
          <h4  class="panel-title">
            <a data-toggle="collapse" data-target="#collapseOne" href="#collapseOne">
              Suggestions from EcoLexicon
            </a>
          </h4>

        </div>
        <div  id="collapseOne" class="panel-collapse collapse">
          <div class='loadinggif' id='loading2'>Loading suggestions</div>
          <div id='suggestions' class="list-group"></div>
        </div>
      </div>

      <hr/>
      <div class="input-group">
        <button type="button" class="btn btn-primary" id='tag-relation'>Go to tag VPKs »</button>
      </div>

      <!--
      <div class="form-group">
        <label for="category" class="control-label">Choose one category</label>
        <select name="category" id="category" class="form-control">
          <option value="photo">Photography</option>
          <option value="drawing">Drawing</option>
          <option value="flow">Flow chart</option>
        </select>
      </div>
      
      <button type="button" class="btn btn-primary" id='tag-category'>Next step »</button>
      -->
    </div>
  </div>

</div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="config.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-typeahead.min.js"></script>
    <script src="js/fermata.js"></script>
    <script src="js/camomile.js"></script>
    <script src="js/manzanilla.js"></script>

    <script language=javascript>
      $(function (){
        var mnz = new Manzanilla();
        mnz.aunthenticate();

        Manzanilla.loadImageMedium($('#id-image').val(),function(){
          $('#the-image').attr('title', Manzanilla.medium.description);
          
          mnz.getImgRelations();
          mnz.getRelationSuggestions();

          mnz.setAutocompleteRelation($('#source'));
          mnz.setAutocompleteRelation($('#target'));

          $(document.body).on('click', '.remove-concept', function(event){
            //removeConceptAnnotation($(this));
            console.log($(this).attr('id-anno'));

            if(confirm('Do you really want to delete the annotation?')){
              console.log('remove annotation');
              $(this).remove();
              mnz.removeAnnotation($(this).attr('id-anno'));
            }
          });


          $(document.body).on('click', '.add-relation', function(event){
            //removeConceptAnnotation($(this));
            console.log($(this).attr('id-anno'));

            if(confirm('Do you really want to tag this relation to the image?')){
              console.log('add annotation');
              var that = this;

              var id_source = $(this).attr('id-source');
              var source = $(this).attr('r-source');
              var id_relation = $(this).attr('id-relation');
              var relation = $(this).attr('r-relation');
              var id_target = $(this).attr('id-target');
              var target = $(this).attr('r-target');

              Manzanilla.addAnnotationRelation(id_source, source, id_relation, relation, id_target, target,function(annotation){
                Manzanilla.addRelationToAnnotationList(annotation._id, annotation.data.source.id, annotation.data.source.concept, annotation.data.relation.id, annotation.data.relation.relation, annotation.data.target.id, annotation.data.target.concept,'#relation-list', 'remove-concept', '&times;');
                $(that).remove();
              });
            }
          });

          $('#tag-relation').click(function(){
            Manzanilla.gotoTagVPKs($('#image').val(), $('#id-image').val());
          });

          $('#add-anno-relation').click(function(){
            var id_source = $('#source-id').val(), source = $('#source-concept').val();
            var id_relation = $('#relation').val(), relation = $("#relation option:selected").text();
            var id_target = $('#target-id').val(), target = $('#target-concept').val();


            Manzanilla.addAnnotationRelation(id_source, source, id_relation, relation, id_target, target,function(annotation){
              Manzanilla.addRelationToAnnotationList(annotation._id, annotation.data.source.id, annotation.data.source.concept, annotation.data.relation.id, annotation.data.relation.relation, annotation.data.target.id, annotation.data.target.concept,'#relation-list', 'remove-concept', '&times;');
            });
          });

        });

      });
    </script>

  </body>
</html>
