module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var mysql = require('./dbcon.js');


    function getInvoices(res, mysql, context, complete){
      console.log('getInvoices');

      mysql.pool.query("SELECT ID, CustomerID, Date FROM Invoices", function(error, results, fields){

          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.Invoices  = results;
          complete();
      });
  }


      function getParts(res, mysql, context, complete){
        console.log('getparts');

        mysql.pool.query("SELECT PartID, Name, Cost FROM Parts", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Parts  = results;
            complete();
        });
    }



      function getPartsOrders(res,mysql, context, complete){

         mysql.pool.query('Select po.InvoiceID, po.PartID, po.QTY, p.Name from PartsOrder po inner join Parts p on p.PartID = po.PartID order by po.InvoiceID', function(err, results, fields){
             if(err){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.PartsOrders = results;
             complete();
         })
     };



    function getPartsOrder(res, mysql, id1, id2, context, complete){
      //console.log(id1, id2);
       var sql = "Select po.InvoiceID, po.PartID, po.QTY, p.Name as 'Name' from PartsOrder po inner join Parts p on p.PartID = po.PartID WHERE InvoiceID = ? AND po.PartID = ?";
       var inserts = [id1, id2]
       mysql.pool.query(sql, inserts, function(error, results, fields){
           if(error){
               res.write(JSON.stringify(error));
               res.end();
           }

           context.PartsOrders = results[0];
           console.log(results[0]);
           complete();
       });
   }



    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteparts.js"];
        var mysql = req.app.get('mysql');
        getPartsOrders(res, mysql, context, complete);
        getInvoices(res, mysql, context, complete);
        getParts(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){

                res.render('partsorders', context);
           }

        }
    });

    router.get('/InvoiceID/:InvoiceID/PartID/:PartID', function(req, res){
      callbackCount = 0;
      var context = {};

      context.jsscripts = [ "updateparts.js", "selectedparts.js", "selectedinvoices.js"];
      var mysql = req.app.get('mysql');
    //  console.log(req.params.InvoiceID);
      getPartsOrder(res, mysql, req.params.InvoiceID, req.params.PartID, context, complete);
      //console.log('am i here yet after getpartsorder')
      getInvoices(res, mysql, context, complete);
      getParts(res, mysql, context, complete);
    //  console.log('error yet ????');
      function complete(){
          callbackCount++;
          if(callbackCount >= 3){
              res.render('update-partsorders', context);
          }

      }
  });



    router.put('/InvoiceID/:InvoiceID/PartID/:PartID', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE IGNORE PartsOrder SET InvoiceID=?, PartID=?, QTY=? where InvoiceID=? and PartID=?";
    var inserts = [req.body.InvoiceID, req.body.PartID, req.body.QTY, req.params.InvoiceID, req.params.PartID];
    sql = mysql.pool.query(sql,inserts,function(error, warning, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        }
        if(warning){
          console.log(warning);
          res.end();
        }
        else{
            res.status(200);
            res.end();
        }
    });
});




router.delete('/:InvoiceID/:InvoiceID/PartID/:PartID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM PartsOrder WHERE InvoiceID = ? and PartID = ?";
        var inserts = [req.params.InvoiceID, req.params.PartID];
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
            var sql = "INSERT IGNORE INTO PartsOrder (InvoiceID, PartID, QTY) VALUES (?,?,?)";
            var inserts = [req.body.InvoiceID, req.body.PartID, req.body.QTY];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error));
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/partsorders');
                }
            });
        });

return router;
}();
