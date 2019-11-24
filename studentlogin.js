var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
let ejs = require('ejs');

var username;
var batch;
var name;
var sem="first";
var enroll="";

app.set('port', (process.env.PORT || 5000));
app.set('view engine','ejs');
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
 
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'dashboard2_0',
	debug: false,
	multipleStatements: true
});


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected");
});


app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());

app.use(express.static(__dirname +'/public/'));


app.use(express.static(__dirname +'/portal/public/'));

app.get('/', function(request, response) {
	response.render(__dirname+'/studentlogin.ejs');
});

app.get('/adminlogin', function(request, response) {
	response.render(__dirname+'/adminlogin.ejs');
})

app.use(bodyParser.json());

app.get('/home1',function(request,response){
	if (request.session.loggedin) 
	{
var sql = "SELECT * FROM basic WHERE id=?;SELECT id FROM credentials WHERE id=?";
connection.query(sql, [username,username],function(error, results, fields) {
    if (error) {
        throw error;
    }
	var string=JSON.stringify(results);
    var json =  JSON.parse(string);
    request.list = json;
	batch=json[0][0].batch;
	name=json[0][0].name;
    response.render(__dirname+'/portal/home.ejs',{
		m_name1:json[0][0].name,
		m_name:json[0][0].name,
		u_name:json[1][0].id,
		f_name:json[0][0].fname,
		enroll:json[1][0].id,
		num:json[0][0].mobile,
		date:json[0][0].dob,
		email:json[0][0].email,
		course:json[0][0].course,
		batch:json[0][0].batch});
});
	}
	else
		response.render(__dirname+'/studentlogin.ejs');
});
	

app.get('/home1', function(request, response)
 {
	if (request.session.loggedin) 
	{
	response.render(__dirname+'/portal/home.ejs');
	}
	response.end();
});

app.get('/hoadmin', function(request, response)
 {
	if (request.session.loggedin) 
	{
	response.render(__dirname+'/portal/admin.ejs');
	}
	response.end();
});



app.get('/attend.ejs',function(request,response){
	if (request.session.loggedin) 
	{
var sql = "SELECT * FROM attend WHERE batch=? and id=? ";
connection.query(sql, [batch,username],function(error, results, fields) {
    if (error) {
        throw error;
    }
	var string=JSON.stringify(results);
    var json =  JSON.parse(string);
    request.list = json;
	console.log(json);
    response.render(__dirname+'/portal/attend.ejs',{
    m_name1:name,
	ans:json
	});
});
	}
	else
		response.render(__dirname+'/studentlogin.ejs');
}); 

    


app.get('/attend.ejs', function(request, response) {
	if (request.session.loggedin) {
	response.render(__dirname+'/portal/attend.ejs');
	}
	else
		response.render(__dirname+'/studentlogin.ejs');
});


app.get('/notice.ejs',function(request,response){
	if (request.session.loggedin) 
	{
var sql = "select *from notice ORDER BY serial DESC LIMIT 5";
connection.query(sql, [batch,username],function(error, results, fields) {
    if (error) {
        throw error;
    }
	var string=JSON.stringify(results);
    var json =  JSON.parse(string);
    request.list = json;
    response.render(__dirname+'/portal/notice.ejs',{
    m_name1:name,
	ans:json
	});
});
	}
	else
		response.render(__dirname+'/studentlogin.ejs');
});




app.get('/notice.ejs', function(request, response) {
	if (request.session.loggedin) {
	response.render(__dirname+'/portal/notice.ejs');
    }
	else
		response.render(__dirname+'/studentlogin.ejs');
});

app.post('/res',function(request,response){
     sem=request.body.sem;
	 if(sem=="undefined")
	 {
		 sem="first";
	 }
	 response.redirect('/result.ejs');
});

app.get('/result.ejs',function(request,response){
	if (request.session.loggedin) 
	{
	var sql;
	if(sem=="first")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=1 and c.sem=1 and r.sub=c.sub;";
    if(sem=="second")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=2 and c.sem=2 and r.sub=c.sub;";
    if(sem=="third")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=3 and c.sem=3 and r.sub=c.sub;";
    if(sem=="fourth")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=4 and c.sem=4 and r.sub=c.sub;";
    if(sem=="fifth")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=5 and c.sem=5 and r.sub=c.sub;";
   if(sem=="sixth")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=6 and c.sem=6 and r.sub=c.sub;";
   if(sem=="seventh")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=7 and c.sem=7 and r.sub=c.sub;";
   if(sem=="eighth")
	   sql = "SELECT r.sub,r.grade,c.credits ,s.sgpi FROM result r,credit c, sgpi s where r.id=? and s.uid=? and s.sem=8 and c.sem=8 and r.sub=c.sub;";
connection.query(sql, [username,username],function(error, results, fields) {
	if (error) {
        throw error;
    }
	var string=JSON.stringify(results);
    var json =  JSON.parse(string);
    request.list = json;
	console.log(json);
    response.render(__dirname+'/portal/result.ejs',{
    m_name1:name,
	ans:json,
	cgp:json[0].sgpi
	});
});
	}	
	else
		response.render(__dirname+'/studentlogin.ejs');
});


app.get('/result.ejs', function(request, response) {
	if (request.session.loggedin) {
	response.render(__dirname+'/portal/result.ejs');
    }
	else
		response.render(__dirname+'/studentlogin.ejs');
});

app.get('/home.ejs',function(request,response){
	if (request.session.loggedin) 
	{
var sql = "SELECT * FROM basic WHERE id=?;SELECT id FROM credentials WHERE id=?";
connection.query(sql, [username,username],function(error, results, fields) {
    if (error) {
        throw error;
    }
	var string=JSON.stringify(results);
    var json =  JSON.parse(string);
    request.list = json;
	console.log(json);
    response.render(__dirname+'/portal/home.ejs',{
	m_name1:json[0][0].name,
	m_name:json[0][0].name,
	u_name:json[1][0].id,
	f_name:json[0][0].fname,
	enroll:json[1][0].id,
	num:json[0][0].mobile,
	date:json[0][0].dob,
	email:json[0][0].email,
	course:json[0][0].course,
	batch:json[0][0].batch
	});
});
	}
	else
		response.render(__dirname+'/studentlogin.ejs');
}); 

app.get('/home.ejs', function(request, response) {
	if (request.session.loggedin) {
	response.render(__dirname+'/portal/home.ejs');
	}});




app.post('/auth', function(request, response) {
	username = request.body.id;
	var password = request.body.pass;
	
	if (username && password) {
		connection.query("SELECT * FROM credentials WHERE id = ? AND pass = ?", [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/logged');
				
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/logged', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('/home1');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.post('/adminauth', function(request, response) {
	var useradmin = request.body.useradmin;
	var passadmin = request.body.passadmin;
	if (useradmin && passadmin) {
			if (useradmin=="admin" && passadmin=="admin") {
				request.session.loggedin = true;
				response.redirect('/logadmin');
				
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		}
	 else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/logadmin', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('/hoadmin');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.post('/adminhome',function(req,response){
	var button = req.body.butt;
	console.log(button);

    if (button==1) {
      enroll=req.body.id;
	  console.log(enroll);
	  response.redirect('/hiadmin');
	}
	 if (button==2) {
    connection.query('UPDATE notice SET facna = ?,sub = ?,msg = ?,batch = ? WHERE serial = 6',[req.body.faculty,req.body.sub,req.body.message,req.body.bat], (error, results, fields) => {
      if (error){
        return console.error(error.message);
      }
        console.log('Rows affected:', results.affectedRows);
		response.redirect('/hoadmin');
      });
  }
});

app.get('/hiadmin',function(request,response){
	response.render(__dirname+'/portal/StudentDetail.ejs');
});



app.post('/StudentDetails', function (req, res) {
    var button=req.body.butt;



    if (button==1) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET name = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }


    if (button==2) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET fname = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==3) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET dob = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==4) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET email = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==5) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET course = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==6) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET batch = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==7) {
      connection.query('UPDATE result SET grade = ? WHERE id = ? AND sub = ?',[req.body.grade, enroll,req.body.Subcode], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==8) {
      connection.query('UPDATE attend SET attend = ? hold = ? WHERE id = ? AND sub = ?',[req.body.attended,req.body.held, enroll,req.body.Subcode], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }

    if (button==9) {
      var data=req.body.capture;
      connection.query('UPDATE basic SET mobile = ? WHERE id = ?',[data, enroll], (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          console.log('Rows affected:', results.affectedRows);
        });
		res.redirect('/hiadmin');
    }
})






app.get('/logout', function(req,res,next) {
  if (req.session) {
	  req.session.loggedin=false;
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});



app.listen(3030, function(){
  console.log("Server started on port 3030");
})