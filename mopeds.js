module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var mysql = require('./dbcon.js');



      function getMopeds(res,mysql, context, complete){
         mysql.pool.query('SELECT * FROM Mopeds', function(err, results, fields){
             if(err){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.Mopeds = results;
             complete();
         })
     };

     function getMoped(res, mysql, context, id, complete){
        var sql = "SELECT ID, Make, Model, Year FROM Mopeds WHERE ID = ?";
        console.log(id);
        var inserts = [id]; //GETTING AN UNDEFINED ID HERE??
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results[0]);
            context.Mopeds = results[0];
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
function getMopedsWithNameLike(req, res, mysql, context, complete) {
  //sanitize the input as well as include the % character
   var query = "SELECT ID, Make, Model, Year FROM Mopeds WHERE Model LIKE " + mysql.pool.escape(req.params.s + '%');
  console.log(query)

  mysql.pool.query(query, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.Mopeds = results;
        complete();
    });
}


    router.get('/', function(req, res){
      console.log('Im inside mopeds router get');
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getMopeds(res, mysql, context, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.render('mopeds', context);
           }

        }
    });

    router.get('/:ID', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = [ "updateparts.js"];
      var mysql = req.app.get('mysql');
      console.log(req.params.ID);
      getMoped(res, mysql, context, req.params.ID, complete);

      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('update-mopeds', context);
          }

      }
  });



    router.put('/:ID', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Mopeds SET Make=?, Model=?, Year=? WHERE ID=?";
    var inserts = [req.body.Make, req.body.Model, req.body.Year,  req.params.ID];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      console.log(sql.sql);
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
    });
});

/*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
router.get('/search/:s', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["searchparts.js"];
    var mysql = req.app.get('mysql');
    getMopedsWithNameLike(req, res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('mopeds', context);
        }
    }
});



router.delete('/:ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Mopeds WHERE ID = ?";
        var inserts = [req.params.ID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    router.post('/', function(req, res){
            console.log(req.body)
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO Mopeds (Make, Model, Year) VALUES (?,?,?)";
            var inserts = [req.body.Make, req.body.Model, req.body.Year];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/mopeds');
                }
            });
        });

return router;
}();




















//
//
//
// app.get('/searchmopeds', function(req, res, next){
//     var context = {};
//     mysql.pool.query('SELECT * FROM Mopeds WHERE Make=?', [req.query.Make],function(err, rows, fields){
//         if(err){
//             next(err);
//             return;
//         }
//         var partsjson = [];
//         for(var i in rows){
//             var j = {
//                 'ID': rows[i].ID,
//                 'Make': rows[i].Make,
//                 'Model': rows[i].Model,
//                 'Year': rows[i].Year}
//             partsjson.push(j);
//         }
//
//         context.results = partsjson;
//         res.render('mopeds', context);
//     })
// });
//
// app.get('/mopeds', function(req, res, next){
//     var context = {};
//     mysql.pool.query('SELECT * FROM Mopeds', function(err, rows, fields){
//         if(err){
//             next(err);
//             return;
//         }
//         var partsjson = [];
//         for(var i in rows){
//             var j = {
//                 'ID': rows[i].ID,
//                 'Make': rows[i].Make,
//                 'Model': rows[i].Model,
//                 'Year': rows[i].Year}
//             partsjson.push(j);
//         }
//
//         context.results = partsjson;
//         res.render('mopeds', context);
//     })
// });
//
//
// app.get('/insertmopeds',function(req,res,next){
//     var context = {};
//     mysql.pool.query("INSERT INTO `Mopeds` (`Make`, `Model`, `Year`) VALUES (?, ?, ?)",
//         [req.query.Make, req.query.Model, req.query.Year],
//         function(err, result){
//             if(err){
//                 next(err);
//                 return;
//             } //changed context.results to context.inserted
//             context.inserted = result.insertId;   //PartID
//             //changed res.render to res.send
//             res.send(JSON.stringify(context));
//         });
// });
//
// app.get('/deletemopeds', function(req, res, next) {
//     var context = {};
//     mysql.pool.query("DELETE FROM `Mopeds` WHERE ID = ?",
//         [req.query.id],
//         function(err, result) {
//             if(err){
//                 next(err);
//                 return;  }
//         });
// });
//
//
// app.get('/mopedsupdate', function(req, res, next){
//     var context = {};
//     mysql.pool.query("SELECT * FROM `Mopeds` WHERE ID=?",
//         [req.query.ID],
//     function(err, rows, fields){
//         if(err){
//             next(err);
//             return;}
//
//         var partsjson = [];
//         for(var i in rows){
//             var j = {
//                 'ID': rows[i].ID,
//                 'Make': rows[i].Make,
//                 'Model': rows[i].Model,
//                 'Year': rows[i].Year}
//             partsjson.push(j);
//         }
//         console.log(partsjson[0]);
//         context.results = partsjson[0];
//         res.render('mopedsupdate', context);
//     })
// });
//
// app.get('/updatedmopeds', function(req, res, next){
//     var context = {};
//
//         mysql.pool.query('UPDATE `Mopeds` SET Make=?, Model=?, Year=? WHERE ID=?',
//             [req.query.make,
//               req.query.model,
//               req.query.year,
//               req.query.ID],
//             function(err, result){
//                 if(err){
//                     next(err);
//                     return;}
//
//         mysql.pool.query('SELECT * FROM `Mopeds`', function(err, rows, fields){
//             if(err){
//                 next(err);
//                 return;
//             }
//             var pArray = [];
//
//             for(var i in rows){
//                 var j = {
//                   'Make': rows[i].Make,
//                   'Model': rows[i].Model,
//                   'Year': rows[i].Year,
//                     'ID':rows[i].ID};
//                 pArray.push(j);
//             }
//
//             context.results = pArray;
//             res.render('mopeds', context);
//                  });
//         });
// });
