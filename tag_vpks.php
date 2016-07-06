
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
            <!--li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li-->
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    

<div class="container" id='search-container'>
  <div class="page-header">
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with VPKs.</small></h1>
  </div>

  <div class="row">
    <div class="col-md-8">
      <div id='canvas-container'><canvas id='the-canvas'></canvas></div>
      <input type='hidden' name='id-image' id='id-image' value="<?php echo $_GET['id']?>"/>
      <input type='hidden' name='image' id='image' value="<?php echo $_GET['img']?>"/>
      <!--?php echo "<img  id='the-image' src='/visual/imagenes/".$_GET['img']."' class='img-responsive img-thumbnail'/>";?-->
    </div>
    <div class="col-md-4"  id='tag-form'>

      <h4>Current annotations</h4>
      <div id='vpks-list' class="list-group"></div>
      <hr>
      <div class="input-group">
        <button type="button" class="btn btn-primary" id='finish'>Finish tagging</button>
      </div>

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

        //document.getElementById("the-canvas").style.background = "url('/visual/imagenes/"+$('#image').val()+"')";
        var image_path = '/visual/imagenes/' + $("#image").val();
        


        Manzanilla.loadImageMedium($('#image').val(),function(){
          new VPKS(image_path, 'the-canvas', 'canvas-container');
          $('#the-image').attr('title', Manzanilla.medium.description);
          $('#finish').click(function(){
            Manzanilla.gotoMain();
          });
        });

      });
    </script>

  </body>
</html>
