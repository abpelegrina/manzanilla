$(function (){
	Camomile.setURL('http://manila.ugr.es:3000')
	/*Camomile.login('root', 'manzanilla_wisi_99', function(err,response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});*/

	Camomile.createCorpus('Ecolexicon Images', 'corpus with all the images in Ecolexicon',function(err,response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});


	/*Camomile.getMedia(function(err,response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	}, {filter:{id_corpus:'576c1b79f9ca0a01005b9156'}});*/

	/*Camomile.logout(function(err, response){
		if (err)
			console.log('ERROR:' + err);
		else
			console.log(response);
	});*/
});