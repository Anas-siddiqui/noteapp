var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var fs = require('fs');
var obj;
  
    
fs.readFile('\database_notes.json', 'utf8', function (err, data) {
  if (err) throw err;
  
  

    
    
    res.send(data);
});
// res.render('index', { title: 'Express' });
  //  res.render('index', obj);
   // res.send(obj);
    //res.json(obj);
    
    
});

module.exports = router;
