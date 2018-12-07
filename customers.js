module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var mysql = require('./dbcon.js');


    function getMopeds(res, mysql, context, complete){
      mysql.pool.query("SELECT ID as id, Make, Model FROM Mopeds", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.Mopeds  = results;
          complete();
      });
  }



      function getCustomers(res,mysql, context, complete){
         mysql.pool.query('SELECT c.ID, c.Fname, c.Lname, c.Moped, m.Make, m.Model, c.Phone FROM Customers c inner join Mopeds m on m.ID = c.Moped order by c.ID', function(err, results, fields){
             if(err){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.Customers = results;
             complete();
         })
     };

     function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT c.ID, c.Fname, c.Lname, c.Moped, m.Make, m.Model, c.Phone FROM Customers c inner join Mopeds m on m.ID = c.Moped WHERE c.ID = ?";
        console.log(id);
        var inserts = [id]; //GETTING AN UNDEFINED ID HERE??
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results[0]);
            context.Customers = results[0];
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
function getCustomersWithNameLike(req, res, mysql, context, complete) {
  //sanitize the input as well as include the % character
   var query = "SELECT ID, Fname, Lname, Moped, Phone FROM Customers WHERE Fname LIKE " + mysql.pool.escape(req.params.s + '%');
  console.log(query)

  mysql.pool.query(query, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.Customers = results;
        complete();
    });
}


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteparts.js","searchparts.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        getMopeds(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){

                res.render('customers', context);
           }

        }
    });

    router.get('/:ID', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = [ "updateparts.js", "selectedmoped.js"];
      var mysql = req.app.get('mysql');
      console.log(req.params.ID);
      getCustomer(res, mysql, context, req.params.ID, complete);
      getMopeds(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('update-customers', context);
          }

      }
  });



    router.put('/:ID', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Customers SET Fname=?, Lname=?, Moped=?, Phone=? WHERE ID=?";
    var inserts = [req.body.Fname, req.body.Lname, req.body.Moped, req.body.Phone, req.params.ID];
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
    getCustomersWithNameLike(req, res, mysql, context, complete);
    getMopeds(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('customers', context);
        }
    }
});



router.delete('/:ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE ID = ?";
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
            var sql = "INSERT INTO Customers (Fname, Lname, Moped, Phone) VALUES (?,?,?,?)";
            var inserts = [req.body.Fname, req.body.Lname, req.body.Moped, req.body.Phone];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/customers');
                }
            });
        });

return router;
}();
