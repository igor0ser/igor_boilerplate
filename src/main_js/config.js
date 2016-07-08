app.config( function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url: '/home',
			template: '<home></home>'
		})
		.state('comp1', {
			url: '/comp1',
			template: '<comp1></comp1>'
		})
		.state('comp2', {
			url: '/comp2',
			template: '<comp2></comp2>'
		});

	$urlRouterProvider.otherwise('/home');

});