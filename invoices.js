module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var mysql = require('./dbcon.js');


    function getCustomers(res, mysql, context, complete){
      mysql.pool.query("SELECT ID, Fname, Lname FROM Customers", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.Customers  = results;
          complete();
      });
  }
//date_format(i.Date, "%m/%d/%Y") as Date


      function getInvoices(res, mysql, context, complete){
         mysql.pool.query('select i.ID, i.CustomerID as CustomerID, c.Fname, c.Lname, i.Date, sum(y.total_price) as "Total" from Invoices i left join( select po.InvoiceID, po.QTY, po.PartID, p.Cost * po.QTY as "total_price" from PartsOrder po inner join Parts p on po.PartID = p.PartID) as y on y.InvoiceID = i.ID inner join Customers c on c.ID = i.CustomerID group by i.ID order by i.ID', function(err, results, fields){
             if(err){
                 res.write(JSON.stringify(err));
                 res.end();
             }
             console.log(results);
             context.Invoices = results;
             complete();
         })
     };

     function getInvoice(res, mysql, context, id, complete){
        var sql = "select j.ID, j.CustomerID as CustomerID, t.Fname as Fname, t.Lname as Lname, j.Date, t.Total from Invoices j left join (select i.ID, c.Fname, c.Lname, i.Date, sum(y.total_price) as Total from invoices i inner join( select po.InvoiceID, po.QTY, po.PartID, p.Cost * po.QTY as 'total_price' from PartsOrder po inner join Parts p on po.PartID = p.PartID) as y on y.InvoiceID = i.ID inner join Customers c on c.ID = i.CustomerID where i.ID = ? group by i.ID) as t on t.ID = j.ID";
        var inserts = [id]; //GETTING AN UNDEFINED ID HERE??
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.Invoices = results[0];
            context.Invoices.ID=[id];
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
function getInvoicesWithNameLike(req, res, mysql, context, complete) {
  //sanitize the input as well as include the % character
   var query =
"select j.ID, t.Fname, t.Lname, j.CustomerID, j.Date, t.Total from Invoices j left join (select i.ID, c.Fname, c.Lname, i.Date, sum(y.total_price) as Total from Invoices i inner join( select po.InvoiceID, po.QTY, po.PartID, p.Cost * po.QTY as 'total_price' from PartsOrder po inner join Parts p on po.PartID = p.PartID) as y on y.InvoiceID = i.ID inner join Customers c on c.ID = i.CustomerID group by i.ID) as t on t.ID = j.ID WHERE t.Fname like " + mysql.pool.escape(req.params.s + '%') + " group by j.ID";

  mysql.pool.query(query, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.Invoices = results;
        complete();
    });
}


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getInvoices(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){

                res.render('invoices', context);
           }

        }
    });

    router.get('/:ID', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = [ "updateparts.js", "selectedcustomer"];
      var mysql = req.app.get('mysql');
      getInvoice(res, mysql, context, req.params.ID, complete);
      getCustomers(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('update-invoices', context);
          }

      }
  });



    router.put('/:ID', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Invoices SET CustomerID=?, Date=? WHERE ID=?";
    var inserts = [req.body.CustomerID, req.body.Date, req.params.ID];
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
    getInvoicesWithNameLike(req, res, mysql, context, complete);
    getCustomers(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('invoices', context);
        }
    }
});



router.delete('/:ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Invoices WHERE ID = ?";
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
            var sql = "INSERT INTO Invoices (CustomerID, Date) VALUES (?,?)";
            var inserts = [req.body.CustomerID,  req.body.Date];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/invoices');
                }
            });
        });

return router;
}();
