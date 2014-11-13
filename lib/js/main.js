(function(){

	var d = document,
		template = d.querySelector('#reviews').innerHTML;

	Mustache.parse(template);   // optional, speeds up future uses

	helper.ajax( './reviews/reviews.json', function(data) {
		var obj = eval(data);

		reviews = JSON.parse(obj.response);

		console.log(reviews);

		var rendered = Mustache.render(template, reviews);
		d.querySelector('#target').innerHTML = rendered;
	});

})();