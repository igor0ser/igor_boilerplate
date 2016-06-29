var app = angular.module('app', ['ui.router']);

app.directive('xxx', function($scope, $window){
	console.log($scope);
});

var zz = name => console.log(name + ' oooo');

function lolopop(){
	console.log(123);
}

console.log('a');
console.log('7');
console.log('15');

console.log(app);

console.log(19);