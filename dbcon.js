var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'Wicks22@@',
  database        : 'cs340_wickerss',
});

module.exports.pool = pool;

pool.getConnection(function(err) {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});
