var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_wickerss',
  password        : '2621',
  database        : 'cs340_wickerss'
});

module.exports.pool = pool;

pool.getConnection(function(err) {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});
