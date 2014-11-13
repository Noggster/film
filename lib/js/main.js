(function(){

	var d = document,
		template = d.querySelector('#reviewsTemplate').innerHTML;

	Mustache.parse(template); // optional, speeds up future uses

	helper.ajax( './reviews/reviews.json', function(data) {
		var obj = eval(data),
			reviews = JSON.parse(obj.response);

		var rendered = Mustache.render(template, reviews);
		d.querySelector('.js-reviews-target').innerHTML = rendered;
	});

})();