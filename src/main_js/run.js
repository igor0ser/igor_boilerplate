app.run(function($http, model){
	$http
		.get('./main_scripts/products.json')
		.success(function(data){
			model.prdocuts = data;
		});

});