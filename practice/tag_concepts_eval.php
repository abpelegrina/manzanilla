
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../../favicon.ico">

    <title>Manzanilla · Practice > Tag concepts</title>

    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/style.css" rel="stylesheet">
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
            <li><a href="/apis/manzanilla/main.html">Home</a></li>
            <li><a href="#">Hello, <span id='greeting'>user</span></a></li>  
            <li><a href="/apis/manzanilla/mine.php">My tags</a></li>
            <li><a href="/apis/manzanilla/tag.html">Tag image</a></li>
            <li><a href="/apis/manzanilla//apis/manzanilla/logout.html">Log out</a></li>
            <!--li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li-->
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    

<div class="container" id='search-container'>
  <div class="page-header">
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with EcoLexicon concepts.</small></h1>
  </div>


  <?php
  if ($_GET['success'] == 'ok'){
    echo '<div class="alert alert-success alert-dismissible fade in" role="alert">';
    echo '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>';
    echo '<span class="glyphicon glyphicon-saved" aria-hidden="true"></span>&nbsp;Image category annotation saved!</div>';
  }
  ?>




  <div class="row">
    <div class="col-md-8">
       <?php echo "<img id='the-image' src='http://ecolexicon.ugr.es/visual/imagenes/".$_GET['img']."' class='img-responsive img-thumbnail'/>";?>
    </div>
    <div class="col-md-4"  id='tag-form'>

      <h4>Current annotations</h4>
      <div class='loadinggif' id='loading'>Loading list</div>
      <div id='concept-list' class="list-group"></div>

      <hr>
      <h4>Add new annotations</h4>

      <div class="input-group">
          <input type="text" class="form-control" id="concept"  autocomplete="off" size="100" placeholder="Search concept">
          <span class="input-group-btn" style="width:0;">
            <button class="btn btn-primary" id="search-concept" type="button">Search &nbsp;
              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
          </span>
      </div>
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
      <div id='no-results' style='display:none;'>No concepts found in EcoLexicon matching your search. Do you want to create the concept in EcoLexicon? <a href='http://manila.ugr.es/puertoterm/concepto.php?eleccion=nuevo' target='_blank'>Open the new concept form</a>.<hr/></div>

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
        <button type="button" class="btn" id='save-and-exit'>Save and exit</button>&nbsp;
        <button type="button" class="btn btn-primary" id='tag-relation'>Go to tag relations »</button>
      </div>

      
    </div>
  </div>

</div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="config.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrap-typeahead.js"></script>
    <script src="../js/fermata.js"></script>
    <script src="../js/camomile.js"></script>
    <script src="../js/manzanilla.js"></script>

    <script language=javascript>
      $(function (){
        var mnz = new Manzanilla();
        mnz.aunthenticate();
        Manzanilla.loadImageMedium($('#id-image').val(),function(){   
          $('#the-image').attr('title', Manzanilla.medium.description);
          mnz.getImgConcepts(true);
          mnz.setAutocompleteConcept();
        });
       

        $('#tag-relation').click(function(){
          Manzanilla.gotoTagRelations($('#image').val(), $('#id-image').val(), true);
        });

        $('#save-and-exit').click(function(){
          Manzanilla.close();
        });

        $('#search-concept').click(function(e){
          $("#concept").typeahead('hide');
          mnz.searchConcepts($('#concept').val())
        });

        $('#tag-category').click(mnz.tagCategory);

        $("#concept").keyup(function(e){ 
           if(e.which == 13)
              $('#search-concept').click();
        });

        $(document.body).on('click', '.remove-concept', function(event){
          //removeConceptAnnotation($(this));
          console.log($(this).attr('id-anno'));

          if(confirm('Do you really want to delete the annotation?')){
            console.log('remove annotation');
            $(this).remove();
            mnz.removeAnnotation($(this).attr('id-anno'));
          }
        });


        $(document.body).on('click', '.add-concept', function(event){
          console.log($(this).attr('id-concept')+', ' + $(this).attr('concept'));
          mnz.addAnnotationConcept($(this).attr('id-concept'), $(this).attr('concept'));
          $(this).remove();
        });
      });
    </script>

  </body>
</html>
