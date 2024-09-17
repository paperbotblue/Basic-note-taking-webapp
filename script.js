const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
  fs.readdir("files", function(err, files) {
    res.render("index", {files: files});
  });
})

app.get('/file/:fileName', function(req, res) {
  fs.readFile(`./files/${req.params.fileName}`,"utf-8", function(err, data) {
    res.render("taskDetails", {data, fileName: req.params.fileName});
  });
})

app.get('/edit/:fileName', function(req, res) {
  fs.readFile(`./files/${req.params.fileName}`,"utf-8", function(err, data) {
    res.render('edit', {fileName: req.params.fileName, data});
  });
})

app.get('/delete/:fileName', function(req, res) {
  fs.rm(`./files/${req.params.fileName}`,function(err) {
    if(err) console.log(err);
    res.redirect('/');
  })
})

app.post('/editfile', function(req, res) {
  fs.rm(`./files/${req.body.oldTitle}`, function(err) {
    if(err) console.log(err);
  });

  fs.writeFile(`./files/${req.body.newTitle}`, req.body.details, function(err) {
    if(err) console.log(err);
  });
  res.redirect('/');
});


app.post('/create', function(req, res) {
  var arr = req.body.title.split(' ');
  for(var i = 1 ; i < arr.length ; ++i) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  } 
  fs.writeFile(`./files/${arr.join('')}.txt`,req.body.details, function(err) {
    if(err) console.log(err);
  });
  res.redirect('/');
});

app.listen(3000);