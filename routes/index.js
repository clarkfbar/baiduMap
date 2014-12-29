
/*
 * GET home page.
 */

var id = 0;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.getId = function(req, res){
  id++;
  return res.send(id);
};