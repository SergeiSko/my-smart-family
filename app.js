const express = require('express');
      parser = require('body-parser');
      MongoClient = require('mongodb').MongoClient;
      cookieParser = require('cookie-parser');
      passport = require('passport');
const app = express();
      mongoClient = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});
      config = require('./configs');

app.use(express.static(__dirname + '/public'));
app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use(cookieParser());

mongoClient.connect(function(err, client){
  if(err) console.error(err);
  else {
    const db = client.db("myfamily")
    require('./modules/Routes')(app, db);
    require('./modules/Api')(app, db);
  }
});

app.listen(config.port, ()=>{
  console.log(`Server ready listen ${config.port} port.`);
})
