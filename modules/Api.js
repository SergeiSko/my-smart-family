module.exports = function(app, db){
  app.post("/auth", function(req, res){
    db.collection("Users").findOne({"login": req.body.login, "password": req.body.password}, function(err, results){
      if(err) return console.error(`error:: ${err}`);
      if(results != null){
        res.setHeader('Content-Type', 'application/json');
        res.send(`{"response": true, "userId": "${results._id}", "userType": "${results.actor}"}`);
        res.statusCode = 200;
        console.log(`Authtorization: U: ${req.body.login}`);
      }
      else{
        res.setHeader('Content-Type', 'application/json');
        res.send(`{"response": false}`);
        res.statusCode = 401;
        console.log(`post findOne: results=null`);
      }
    });
  });

  app.post("/reg", function(req, res) {
    const collection = db.collection("Users");
    collection.findOne({login: req.body.login}, function(err, results){  // Проверка наличия юзера в системе
      if (err) return console.error("(/reg).find: " + err);
        db.collection("Users").count({}, function(err, num) { //Кол-во имеющихся юзеров
          if (err) {return console.error("(/reg).count: " + err);}
          if(results == null){
          //Добавление записи в таблицу Users
          collection.insertOne({"_id": `${num}`, "login": req.body.login, "password": req.body.password, "actor": `${req.body.userType}`}, function(err, results){
            if(err) return console.error(`(reg).insert to Users ${err}`);
            //Добавление записи в таблицу userData
            db.collection("userData").insertOne({"_id": `${num}`, "name": req.body.name, "surname": req.body.surname, "patronymic": req.body.patronymic, "age": `${req.body.age}`}, function(err, results){
              if(err) return console.error(`(reg).insertUData ${err}`);
              // ----- response -----
              res.setHeader('Content-Type', 'application/json');
              res.send(`{"response": true}`);
              res.statusCode = 200;
              return console.log(`Reg'd: l:${req.body.login}`);
            });
          });
        }
        else{
          res.setHeader('Content-Type', 'application/json');
          res.send(`{"response": false}`);
          res.statusCode = 401;
          return console.log("Error: This user is registered.");
        }
      });
    });
  });

  app.get("/getTasks", function(req, res) {
    db.collection("Tasks").find().toArray(function(err, results){
      if (err) return console.error("(/getTasks):: " + err);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.send(results);
    });
  });

  app.post("/insertTasks", function(req, res){
    db.collection("Tasks").count({}, function(error, num) {
      if (error) return console.error("(/insertTasks): " + error);
    });
    const collectionN = db.collection("Tasks");
    collectionN.insert({}, function(err, results){
      if(err) return console.error("(/insertTasks)" + err);
      res.statusCode = 200;
      res.send("inserted");
    });
  });

  app.post("/updateTask", function(req, res){
    db.collection("Tasks").update(
      {"_id": req.body._id},
      {$set: {"state": req.body.stateId}},
      {upsert: false},
      function(err, results){
        if (err) {return console.error("(/updateTasks): " + err);}
        console.log(results);
      }
    );
  });

  app.post("/deleteTasks", function(req, res){
    db.collection("Tasks").remove({"_id": req.body._id}, function(err, results) {
      if (err) {return console.error("Api error\n(/deleteTasks): " + err);}
      console.log(results);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send(results);
    });
  });

  app.get("/getUsers", function(req, res){
    db.collection("Users").find().toArray(function(err, results){
      if (err) return console.error("(/getUsers): " + err);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.send(results);
    });
  });

  app.post("/restartdb", function(req, res){
    if(req.body.password == "restart"){
      //require('./Prepare.js')(db);
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.send("restarting...");
    }
    else {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 401;
      res.send("Doesn't access");
    }
  });
}
