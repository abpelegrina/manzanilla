
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

    <title>Manzanila · Image tagger for EcoLexicon</title>

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
            <li class="active"><a href="main.html">Home</a></li>
            <li><a href="#">Hello, <span id='greeting'>user</span></a></li> 
            <li><a href="logout.html">Log out</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    

<div class="container" id='search-container'>
  <div class="page-header">
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with EcoLexicon concepts.</small></h1>
  </div>


  <?php
  if ($_GET['success'] == 'ok')
    echo '<div class="alert alert-success alert-dismissible fade in" role="alert">';
    echo '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>';
    echo '<span class="glyphicon glyphicon-saved" aria-hidden="true"></span>&nbsp;Image category annotation saved!</div>';
  ?>




  <div class="row">
    <div class="col-md-8">
       <?php echo "<img src='http://ecolexicon.ugr.es/visual/imagenes/".$_GET['img']."' class='img-responsive img-thumbnail'/>";?>
    </div>
    <div class="col-md-4"  id='tag-form'>

      <h4>Current annotations</h4>
      <div id='concept-list' class="list-group"></div>

      <hr>
      <h4>Add new annotations</h4>

      <div class="input-group">
          <input type="text" class="form-control" id="concept" size="100" placeholder="Search concept">
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

      <hr/>
      <div class="input-group">
        <button type="button" class="btn btn-primary" id='tag-relation'>Go to tag relations »</button>
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
        mnz.getImgConcepts();
        mnz.setAutocompleteConcept();


        $('#search-concept').click(function(e){
          $("#concept").typeahead('hide');
          mnz.searchConcepts($('#concept').val())
        });

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
          //removeConceptAnnotation($(this));

          console.log($(this).attr('id-concept')+', ' + $(this).attr('concept'));
          mnz.addAnnotationConcept($(this).attr('id-concept'), $(this).attr('concept'));
          $(this).remove();
        });
      });
    </script>

  </body>
</html>
