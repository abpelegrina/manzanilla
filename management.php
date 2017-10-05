
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

    <title>Manzanilla · Manager</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
  </head>

  <body>

  <div id='new-user-dialog' class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Create new user</h4>
          </div>
          <div class="modal-body">
             <form class="form">
              <div class="form-group">
                <label for="username">User name</label>
                <input type="text" class="form-control"  autocomplete="off" name="username" id="username" placeholder="username">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="text" class="form-control"  autocomplete="off" name="password" id="password" placeholder="password">
              </div>
              
             </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" id='cancel-vpk'>Cancel</button>
            <button type="button" class="btn btn-primary" id='create-user'>Create new user</button>
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
            <li><a href="tag.html">Tag image</a></li>
            <li class="active"><a href="manager.php">Manager</a></li>
            <li><a href="logout.html">Log out</a></li>
            <!--li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li-->
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container">
      <div class="container">
        <h2>Corpus data</h2>

        <table class='table'>
          <thead>
            <tr>
              <th>Entity</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody id='corpus-data'>
            <tr>
              <td>Corpus</td>
              <td id='id_corpus'></td>
            </tr>
          </tbody>
        </table>
       
        Download the config file for the current configuration of the DB. 
        <a id='download' href='#'>Download</a>
      </div>

      <hr/>

      <div class='container'>
       <h2>Users</h2>
       <table class='table'>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody id='users-data'>
          </tbody>
        </table>
        <button id='new-user'>Create new User</button>
      </div>
      <hr/>

      <div class='container'>
        If you delete the corpus, all the media, annotations and layers will be removed and new, empty ones, will be created. 
        <button id='reset'>Delete corpus</button>
      </div>

      <hr/>
      <div class="container">
        <div id="info"></div>
      </div><!-- /.container -->

  </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="config.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/fermata.js"></script>
    <script src="js/camomile.js"></script>
    <script src="js/manzanilla.js"></script>
    <script src="js/load_schema.js"></script>

    <script language=javascript>
       $(function (){

        $('#new-user-dialog').modal({'show':false});
          // load config file 
          var mnz = new Manzanilla();

          mnz.aunthenticate(function(err, response){
            if (response.role != 'admin')
              window.location ='index.html';
            else {
               showCorpus();
               getUsersData();
             }
          });

          $('#reset').click(function(event){
            if(confirm('seguro????!?')){
              console.log('delete everything!');
              deleteCorpus('Ecolexicon Images');
              console.log('add images from ecolexicon!!');
              createCorpus('Ecolexicon Images');
            }
          });

           $('#new-user').click(function(event){
              $('#new-user-dialog').modal('show');
           });

          $('#download').click(function(event){
            var text = '{\n';
            text += '"corpus_id":"'+Manzanilla.id_corpus+'",'
                    +'"layer_categories_id":"'+Manzanilla.id_layer_categories+'",\n'
                    +'"layer_concepts_id":"'+Manzanilla.id_layer_concepts+'",\n'
                    +'"layer_relations_id":"'+Manzanilla.id_layer_relations+'",\n'
                    +'"layer_vpks_id":"'+Manzanilla.id_layer_vpks+'"\n';
            text += '}';

            console.log('done!');

            $(this).attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
            $(this).attr('download', 'config.json');
          })

          $('#create-user').click(function(event){
              //$('#new-user-dialog').modal('hide');

              Camomile.createUser($('#username').val(),$('#password').val(),'','admin', function(err, response){
                 $('#new-user-dialog').modal('hide');
                if (err)
                  $('#info').append('ERROR:' + err);
                else {
                  var id = response._id;
                  $('#users-data').append('<tr><td>'+response.username+'</td><td>'+response.role + '</td><td><button class="remove-user" id-user="'+id+'">Delete user</button></td></tr>')
                  Camomile.setCorpusPermissionsForUser(Manzanilla.id_corpus,id,3);
                  Camomile.setLayerPermissionsForUser(Manzanilla.id_layer_categories,id,3);
                  Camomile.setLayerPermissionsForUser(Manzanilla.id_layer_concepts,id,3);
                  Camomile.setLayerPermissionsForUser(Manzanilla.id_layer_relations,id,3);
                  Camomile.setLayerPermissionsForUser(Manzanilla.id_layer_vpks,id,3);
                }
              });
          });

          $(document.body).on('click','.remove-user',function(event){
            if (confirm('Do you really want to delete this user??')){
              console.log($(this).attr('id-user'));
              var that = this;
              Camomile.deleteUser( $(this).attr('id-user'), function(err, response){
                if (err)
                  $('#info').append('ERROR:' + err);
                else{
                  $('#info').append('User deleted:' + response.success);
                  $(that).parent().parent().remove();
                }
              });
            }
          });


       });
    </script>

  </body>
</html>
