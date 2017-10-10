
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
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with a category.</small></h1>
  </div>


  <div class="row">
    <div class="col-md-8">
       <?php echo "<img id='the-image' src='http://ecolexicon.ugr.es/visual/imagenes/".$_GET['img']."' class='img-responsive img-thumbnail'/>";?>
    </div>
    <div class="col-md-4" id='tag-form'>
        <div class='loadinggif' id='loading'>Loading category...</div>
        <div class="form-group">
          <label for="category" class="control-label">Choose one category</label>
          <select name="category" id="category" class="form-control">
            <option value="none">--</option>
            <option value="photo">Photography</option>
            <option value="drawing">Drawing</option>
            <option value="flow">Flow chart</option>
          </select>
        </div>

        <div class="alert alert-danger" role="alert" id='error-tag'>
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>
          <span id='error-mgs'></span>
        </div>

        <input type='hidden' name='id-image' id='id-image' value="<?php echo $_GET['id']?>"/>
        <input type='hidden' name='image' id='image' value="<?php echo $_GET['img']?>"/>

        <br/>
        <div class="input-group">
          <button type="button" class="btn" id='exit'>Save and exit</button>&nbsp;
          <button type="button" class="btn btn-primary" id='tag-category'>Save and tag concepts »</button>
        </div>
    </div>
  </div>

</div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="config_eval.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/fermata.js"></script>
    <script src="js/camomile.js"></script>
    <script src="js/manzanilla.js"></script>

    <script language=javascript>
      $(function (){


        var mnz = new Manzanilla();
        mnz.aunthenticate();
        $('#loading').show();

        console.log($('#id-image').val());

        $('#tag-category').click(function(event){
          $(this).prop('disabled', true);
          mnz.tagCategory(true);
        });


        Manzanilla.loadImageMedium($('#id-image').val(), function(){
          console.log(Manzanilla.medium);

          $('#the-image').attr('title', Manzanilla.medium.description);
            Camomile.getAnnotations(function(err,response){
              $('#loading').hide();
              if (response.length > 0){
                $.each(response,function(key,annotation){
                  if (annotation.data.author == mnz.username){
                    var category = annotation.data.category;
                    $('#category').val(category);
                  }
                });
              }
          }, {filter:{id_layer:Manzanilla.id_layer_categories, id_medium:Manzanilla.medium._id}});
      });
    });
    </script>

  </body>
</html>
