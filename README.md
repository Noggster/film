Node server which parses a .js file containing title, content and imdb id into a .json containing all data for that title from IMDB.

Usage:
Edit server.js, 
change declaration of variable data to the path of your config-file.
change output path to .json (optional)

Your config.js should be formated as such:
<code>
exports.reviews = [
	{
		title : 'Title, internal usage only.',
		imdbId : 'imdb id, should look like: tt1924435',
		review: 'The actual review, can contain &lt;strong&gt;html&lt;/strong&gt;.'
	}
]
</code>
The main.js file then uses mustache to parse the data into HTML, you can edit the template however you want.

A cat for good measure :3