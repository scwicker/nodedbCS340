var express = require('express');
//var path = require ('path');
var bodyParser = require("body-parser");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('./dbcon.js');



//handebars allow handlebar views to inject main html body
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.set('mysql', mysql);

//app.use(express.static(path.join(__dirname, '/public'))); //this allows CSS file
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.use('/parts', require('./parts.js'));
app.use('/mopeds', require('./mopeds.js'));
app.use('/customers', require('./customers.js'));
app.use('/invoices', require('./invoices.js'));
app.use('/partsorders', require('./partsorders.js'));
app.use('/', express.static("public"));



app.get('/home',function(req,res){
  res.render('home');
});


//***************************   error handling portion   *******************//
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
