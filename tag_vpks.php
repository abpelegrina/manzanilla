
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


    <div id='vpk-dialog' class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Attributes</h4>
          </div>
          <div class="modal-body">
             <form class="form">

              <div class="form-group">
                <label for="type">Type</label>
                <select class="form-control" name="type" id="type">
                    <optgroup label="Arrow"></optgroup>
                    <option value='arrow-delimitation'>&nbsp;&nbsp;Delimitation</option>
                    <option value='arrow-denomination'>&nbsp;&nbsp;Denomination</option>
                    
                    <optgroup label="&nbsp;&nbsp;Dynamism"></optgroup>
                    <option value='arrow-dynamism-spatial'>&nbsp;&nbsp;&nbsp;&nbsp;Spatial</option>
                    <option value='arrow-dynamism-temporal'>&nbsp;&nbsp;&nbsp;&nbsp;Temporal</option>
                                        
                    <optgroup label="Color"></optgroup>
                    <option value='color-contrast'>&nbsp;&nbsp;Contrast</option>
                    <option value='color-realism'>&nbsp;&nbsp;Realism</option>

                    <optgroup label="Label"></optgroup>
                    <option value='label-denomination'>&nbsp;&nbsp;Denomination</option>
                    <option value='label-explanation'>&nbsp;&nbsp;Explanation</option>

                    <optgroup label="Number"></optgroup>
                    <option value='number-denomination'>&nbsp;&nbsp;Denomination</option>
                    <option value='number-temporality'>&nbsp;&nbsp;Temporality</option>

                    <option value='logical operator'>Logical Operator</option>

                    <option value='other'>Other</option>
                    
                    <!--option value="concept">Concept</option-->
                </select>
              </div>

              <div class="form-group" id='annotation_container'>
                <label for="annotation">Annotation</label>
                <input type="text" class="form-control"  autocomplete="off" name="annotation" id="annotation" placeholder="Annotation">
              </div>

             </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" id='cancel-vpk'>Cancel</button>
            <button type="button" class="btn btn-primary" id='save-vpk'>Save VPK</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

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
    <h1>Tagging image &quot;<?php echo $_GET['img']?>&quot;. <small>Tag the image with VPKs. To tag a VPK just draw a rectangle in the image and input the appropiate label.</small></h1>
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
      <div class='loadinggif' id='loading'>Loading list</div>
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

        $('#vpk-dialog').modal({'show':false});


        $('#type').change(function(){
          if ($(this).val() == 'concept'){
            $('#annotation_concept_container').show();
            $('#annotation_container').hide();
          }
          else {
            $('#annotation_concept_container').hide();
            $('#annotation_container').show();
          }
        });

        var image_path = '/visual/imagenes/' + $("#image").val();
        var mnz = new Manzanilla();
        mnz.aunthenticate(function(err, response){
            Manzanilla.loadImageMedium($('#id-image').val(),function(){
              new VPKS(image_path, 'the-canvas', 'canvas-container', mnz.username);
              $('#the-image').attr('title', Manzanilla.medium.description);
              $('#finish').click(function(){
                Manzanilla.gotoMine();
              });
            });
        });

      });
    </script>

  </body>
</html>
