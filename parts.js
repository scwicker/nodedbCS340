module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var mysql = require('./dbcon.js');



      function getParts(res,mysql, context, complete){
         mysql.pool.query('SELECT * FROM Parts', function(err, results, fields){
             if(err){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.Parts = results;
             complete();
         })
     };

     function getPart(res, mysql, context, id, complete){
        var sql = "SELECT PartID, Name, Cost FROM Parts WHERE PartID = ?";
        console.log(id);
        var inserts = [id]; //GETTING AN UNDEFINED ID HERE??
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results[0]);
            context.Parts = results[0];
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
function getPartsWithNameLike(req, res, mysql, context, complete) {
  //sanitize the input as well as include the % character
   var query = "SELECT PartID, Name, Cost FROM Parts WHERE Name LIKE " + mysql.pool.escape(req.params.s + '%');
  console.log(query)

  mysql.pool.query(query, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.Parts = results;
        complete();
    });
}


    router.get('/', function(req, res){
      console.log('still inside parts');
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getParts(res, mysql, context, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){

                res.render('parts', context);
           }

        }
    });

    router.get('/:PartID', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = [ "updateparts.js"];
      var mysql = req.app.get('mysql');
      console.log(req.params.PartID);
      getPart(res, mysql, context, req.params.PartID, complete);

      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('update-parts', context);
          }

      }
  });



    router.put('/:PartID', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Parts SET Name=?, Cost=? WHERE PartID=?";
    var inserts = [req.body.Name, req.body.Cost,  req.params.PartID];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
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
    getPartsWithNameLike(req, res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('parts', context);
        }
    }
});



router.delete('/:PartID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Parts WHERE PartID = ?";
        var inserts = [req.params.PartID];
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
            var sql = "INSERT INTO Parts (Name, Cost) VALUES (?,?)";
            var inserts = [req.body.Name, req.body.Cost];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/parts');
                }
            });
        });

return router;
}();
