var http = require('http')
var express = require('express');
var scrap = require('./scrap.js')
var app = express();
app.use(express.json())
var scrap_ob = new scrap()
const PORT = process.env.PORT || 9999

app.post("/scrap", (req, res, next) => {
	let url = req.body.url;
	scrap_ob.parsing_response_data(url)
	.then((result)=>{
		res.json(result)		
	})
	.catch((err)=>{
		res.json({"err":"404 error"})
	})
});

app.use((req,res,next)=>{
	const error = new Error("Url Not found")
	error.status = 404;
	next(error)
})
app.use((error,req,res,next)=>{
	res.status(error.status || 500);
	res.json({
		message:error.message
	})
})
http.createServer(app).listen(PORT,()=>{
	console.log("server started on port 9999 ")
})
