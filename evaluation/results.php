
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

    <title>Manzanilla · Evaluation > Results</title>

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
            <li><a href="/apis/manzanilla/logout.html">Log out</a></li>
            <!--li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li-->
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    

<div class="container" id='search-container'>
  <div class="page-header">
    <h1>Evaluation results. <small>See the tags that the different users added by clicking in the images below.</small></h1>
    <br/>

    <div><button id='download-report'>Generate Report as CSV</button> <span class='loadinggif' id='loading' style="display: none"></span>  &nbsp;<a id='report' href='' style="display: none">Download report</a></div>
  </div>

  <div class="row" id='images'>
    <ul id='concepts' class="list-inline"></ul>
  </div>




</div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="config_eval.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrap-typeahead.min.js"></script>
    <script src="../js/fermata.js"></script>
    <script src="../js/camomile.js"></script>
    <script src="../js/manzanilla.js"></script>

    <script language=javascript>
     

       


      $(function (){





        //$('#vpk-dialog').modal({'show':false});

        var image_path = '/visual/imagenes/' + $("#image").val();
        var mnz = new Manzanilla();
        mnz.aunthenticate(function(err, response){
            mnz.loadResultImages(config.imgs2eval);
        });

        $('#download-report').click(function(event){
      		mnz.getResultsAsCSV(config.imgs2eval);	
      	})
      });

      
    </script>

  </body>
</html>
