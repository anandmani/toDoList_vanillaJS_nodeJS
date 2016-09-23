var express = require('express');
var router = express.Router();
var url = require("url");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


//Save Item
router.post('/todo/v1/saveItem', function(req,res,next){
try{
var reqObj = req.body;        
console.log(reqObj);
req.getConnection(function(err, conn){
if(err)
{
console.error('SQL Connection error: ', err);
return next(err);
}
else
{
var insertSql = "INSERT INTO items SET ?";

var insertValues = {
"item_name" : reqObj.name,
"item_status" : reqObj.status,
};

var query = conn.query(insertSql, insertValues, function (err, result){
if(err){
console.error('SQL error: ', err);
return next(err);
}
var item_id = result.insertId;
res.json({"item_id":item_id});
});
}
});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});

//Delete Items
router.post('/todo/v1/deleteItems', function(req,res,next){
try{
var reqObj = req.body;        
console.log(reqObj);
req.getConnection(function(err, conn){
if(err)
{
console.error('SQL Connection error: ', err);
return next(err);
}
else
{
var insertSql = "DELETE FROM `items`";
console.log(reqObj.items);
var query = conn.query(insertSql, function (err, result){
if(err){
console.error('SQL error: ', err);
return next(err);
}
var item_id = result.insertId;
res.json({"item_id":item_id});
});
}
});
}
catch(ex){
console.error("Internal error:"+ex);
return next(ex);
}
});


//Get items
router.get('/todo/v1/getItems', function(req, res, next) {
    try {
            // var position = req.param('position');

        var query = url.parse(req.url,true).query;
        console.log(query);
        var position = query.position;
        console.log(position);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select * from items' , function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var item_list = [];
                    for (var itemIndex in rows) {
                        var itemObj = rows[itemIndex];
                        item_list .push(itemObj);
                    }
                    res.json(item_list);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//On clicking save button 
