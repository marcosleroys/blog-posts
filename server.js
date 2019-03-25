const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const uuidv4 = require('uuid/v4');

let postArray = [
					{
						id: uuidv4(),
						title: "The coral reef",
						content: "This sti nto eisooa thaoska",
						author: "Marcos Salazar",
						publishDate: new Date(2017,11,31)
					},
					{
						id: uuidv4(),
						title: "Coral reef",
						content: "This sti nto eisooa thaoska",
						author: "Marcos Salazar",
						publishDate: new Date(2018,11,31)
					},
					{
						id: uuidv4(),
						title: "The coral",
						content: "This sti nto eisooa thaoska",
						author: "Eugenia Lua",
						publishDate: new Date(2017,11,31)
					},
					{
						id: uuidv4(),
						title: "The reef",
						content: "This sti nto eisooa thaoska",
						author: "Eugenia Lua",
						publishDate: new Date(2018,11,31)
					}
				];

//This get is named different, so that the author get can verify that
//it has an author in the path variables
app.get('/list-blog-posts', (req, res) => {
	res.status(200).json({
		message: "Succesfully retrieved all blog posts",
		status: 200,
		posts: postArray 
	});
});

//Get with author filter
app.get('/blog-posts/:author*?', (req, res) => {
	let authorParam = req.params.author;
	let authorPostsArray = [];

	if (!authorParam) {
		res.status(406).json({
			message: "No author parameter passed.",
			status: 406
		});
	}

	postArray.forEach(item => {
		if(item.author == authorParam){
			authorPostsArray.push(item);
		}
	})

	if(!authorPostsArray.length === 0){
		res.status(200).json({
			message: "Posts of the author Succesfully retrieved.",
			status: 200,
			posts: authorPostsArray
		});
	}

	res.status(404).json({
		message: "Author not found.",
		status: 404
	});
});

//POST to create new blog posts
app.post('/blog-posts', jsonParser, (req, res) => {
	if(!(req.body.title && req.body.content && req.body.author && req.body.publishDate)){
		res.status(406).json({
			message: "Missing body field.",
			status: 406
		});
	}

	let newId = uuidv4();

	let newPost = 
	{
		id: newId,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate)
	}

	postArray.push(newPost);

	res.status(201).json({
		message: "Succesfully added a new blog post.",
		status: 201,
		post: 
		{
			id: newId,
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			publishDate: new Date(req.body.publishDate)
		}
	});
});

//DELETE posts based on its id
app.delete('/blog-posts/:id*?', jsonParser, (req, res) => {
	let bodyId = req.body.id;
	let paramsId = req.params.id;

	if(!bodyId){
		res.status(406).json({
			message: "No id passed in the body.",
			status: 406
		});
	}

	if(!paramsId){
		res.status(406).json({
			message: "No id passed in the parameters.",
			status: 406
		});
	}

	if(bodyId != paramsId){
		res.status(406).json({
			message: "The body id is different to the parameters id.",
			status: 406
		});
	}

	postArray.forEach(item => {
		if(bodyId == item.id){
			postArray.splice(item, 1);

			res.status(204).json({
				message: "Post deleted succesfully.",
				status: 204
			}).send("Finish");
		}
	});


	res.status(404).json({
		message: "Id not found.",
		status: 404
	});
});

//PUT request to edit a post based on it's id
app.put('/blog-posts/:id*?', jsonParser, (req, res) => {
	let paramsId = req.params.id;

	if(!paramsId){
		res.status(406).json({
			message: "No id passed in the body.",
			status: 406
		});
	}

	if(!(req.body.title || req.body.content || req.body.author || req.body.publishDate)){
		res.status(404).json({
			message: "No content passed in the body.",
			status: 404
		});
	}

	postArray.forEach((item, index) => {
		if(item.id == paramsId){
			if(req.body.title)
				{postArray[index].title = req.body.title;}
			if(req.body.content)
				{postArray[index].content = req.body.content;}
			if(req.body.author)
				{postArray[index].author = req.body.author;}
			if(req.body.publishDate)
				{postArray[index].publishDate = req.body.publishDate;}

			res.status(200).json({
				message: "Post updated successfully.",
				status: 200,
				post: postArray[index]
			});
		}
	});

	res.status(404).json({
		message: "Id not found.",
		status: 404
	});
});

app.listen(8080, () => {
	console.log('Server running in port 8080');
});