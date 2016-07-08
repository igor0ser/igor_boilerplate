app.component('comp2', {
	templateUrl: '../../components/comp2/comp2.html',
	controller: comp2Controloller
});

function comp2Controloller(model){
	console.log(123);
	console.log(model);
}