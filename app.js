'use strict';
let alexaVerifier = require('alexa-verifier');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
 var request = require("request");
var connection;
var app = express();
//
var to_search="";
 var final_result;
var json_final="";

var card_text="";
var timerstamp;
var user_id="";
 var user_new=true;
var final_data_mysql="";
var notes_total;
  var user_db_count=0;
var user_notes=0;
 
 var JsonDB = require('node-json-db');
var db = new JsonDB("database_notes", true, false);
var mysql      = require('mysql');
connection = mysql.createPool({
  host     : '68.178.143.103',
  user     : 'noteme',
  password : 'Deland24!',
  database : 'noteme'
});
//connection.connect();
var http = require("http");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.json({
    verify: function getRawBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
function requestVerifier(req, res, next) {
    alexaVerifier(
        req.headers.signaturecertchainurl,
        req.headers.signature,
        req.rawBody,
        function verificationCallback(err) {
            if (err) {
                res.status(401).json({ message: 'Verification Failure', error: err });
            } else {
                next();
            }
        }
    );
}
  
// catch 404 and forward to error handler
setInterval(function() {
    http.get("http://alexanoteapp.herokuapp.com");
}, 300000);

app.post('/skill',make,  function(req, res) {
    
    
   console.log(final_data_mysql);
    user_id="";
   user_notes=0;
   notes_total="";
    user_new=true;
    
 user_id=req.body.session.user.userId;
   
     try {
   // notes_total = db.getData("/notes");
         notes_total=final_data_mysql;
        
         notes_total=notes_total.length;
        
         
         } catch(error) { console.error(error);}
 
    for(var i=0;i<notes_total;i++)
    {
  

        var data= final_data_mysql[i].userid;
    
 
       if(user_id==data){
           
           user_db_count=i; 
           console.log("matched at "+user_db_count); 
           user_new=false; 
         
           data=final_data_mysql[i].first;
        
          if(data){
              user_notes++;
          }
               data=final_data_mysql[i].second;
          if(data){
              user_notes++;
          }
           
        
           break;
                      
       }
        
        
    //   else{ if(user_new){user_new=true;} }

    
    
    
 
    }
    
    if(user_new)
    {
        var query="INSERT INTO Notes (userid,first,second,third,fourth,fifth) VALUES ('"+user_id+"','','','','','')";
        addData(query);
     
       
  
    }
   
  
  
    
 
 
    if (req.body.request.type === 'LaunchRequest') {
      if(user_new){
        res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Welcome to note me skill"+"<audio src=\"https://s3.amazonaws.com/sounds226/boom.mp3\"/>"+"</speak>"
          
        }
      }
    }); }
        else{
             res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Welcome back to note me , you have saved "+user_notes+" notes"+"<audio src=\"https://s3.amazonaws.com/sounds226/boom.mp3\"/>"+"</speak>"
          
        }
      }
    });
            
        }
    
    }
  else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'AMAZON.CancelIntent') 
  { 
      
  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>hmm see you soon</speak>"
          
        }
      }
    });
      

      
  }
    else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'AMAZON.StopIntent') 
  { 
      
  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>hmm see you soon</speak>"
          
        }
      }
    });
      
  
      
  }
    else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'AMAZON.HelpIntent') 
  { 
      
  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Lighthouse help"+"<break time=\"1s\"/>"
       
            +"</speak>"
          
        }
      }
    });
      
  
      
  }
  else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'getinput') {
      

      
     data=final_data_mysql[user_db_count].first;
      console.log("length is "+data.length+" "+data);
    //  data=db.getData("/notes["+user_db_count+"]/first");
          if(data.length===0){
              
          var query="UPDATE Notes SET first=('"+req.body.request.intent.slots.task.value+"') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
              res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your data was saved successfully"
       
            +"</speak>"
          
        }
      }
    });
            
    
          }
      
        
          else if(data.length>0){
            data=final_data_mysql[user_db_count].second; 
              if(data.length===0){
                  //db.push("/notes["+user_db_count+"]/second",req.body.request.intent.slots.task.value); 
           var query="UPDATE Notes SET second=('"+req.body.request.intent.slots.task.value+"') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
          res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your data was saved successfully"
       
            +"</speak>"
          
        }
      }
    });
                  
          }
              else{  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"You have all slots full, Please choose delete to empty the slots"+"</speak>"
       
            
          
        }
      }
    });
          
      }
          }
      
           
      
     
   
  }
    else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'getoptions') {
       
      
   if(!req.body.request.intent.slots.options.value)
   {
        
        
       res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Sorry I didnt hear any options"
       
            +"</speak>"
          
        }
      }
    });
       
    
   }
      else if(req.body.request.intent.slots.options.value=="play")
   {
        
        var result="";
    
    
     //  data=db.getData("/notes["+user_db_count+"]/first");
       data=final_data_mysql[user_db_count].first; 
          if(data){
              
              result+=data;
      
    
          }
      
     //    data=db.getData("/notes["+user_db_count+"]/second");
       data=final_data_mysql[user_db_count].second; 
         if(data){
      
             result+=" and "+data;
           
        
        
   
          }
       if(result){
       
       res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your saved notes are "+result
       
            +"</speak>"
          
        }
      }
    });
         
       }
       else
       {
             res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"You have no saved notes"
       
            +"</speak>"
          
        }
      }
    });
         
       }
   }
        else if(req.body.request.intent.slots.options.value=="delete")
            {
                if(req.body.request.intent.slots.delete.value && req.body.request.intent.slots.delete.value !="?" )
                {
                    var temp=get_number(req.body.request.intent.slots.delete.value);
                    if(temp=="empty")
                    {
                         res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Invalid note number"
       
            +"</speak>"
          
        }
      }
    });
                       
                    }
                    else{
              //      db.push("/notes["+user_db_count+"]/"+temp,""); 
                  
                
        
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your note was deleted successfully"
       
            +"</speak>"
          
        }
      }
    });
                     
                    }
                    
                    
                    
                }
                else if(req.body.request.intent.slots.delete.value =="?")
                {
                  
                     res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Invalid number"
       
            +"</speak>"
          
        }
      }
    });
                   
                }
   else if(!req.body.request.intent.slots.delete.value && !req.body.request.intent.slots.delete_option.value )
               { 
            //  db.push("/notes["+user_db_count+"]/first",""); 
            //    db.push("/notes["+user_db_count+"]/second",""); 
                     var query="DELETE FROM Notes WHERE ID = ('"+final_data_mysql[user_db_count].id+"')";
                   addData(query);
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your saved notes were deleted successfully"
       
            +"</speak>"
          
        }
      }
    });
               
               }
                
                
                if(req.body.request.intent.slots.delete_option.value)
                    {
                    var temp=get_number(req.body.request.intent.slots.delete_option.value);
                    if(temp=="empty")
                    {
                         res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Invalid note number"
       
            +"</speak>"
          
        }
      }
    });
                      
                    }
                    else{
                  //  db.push("/notes["+user_db_count+"]/"+temp,""); 
                     
                   
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your note was deleted successfully"
       
            +"</speak>"
          
        }
      }
    });
                     
                    }
          
            }
        
      
      

    }
    
        else{
          res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Invalid request"
       
            +"</speak>"
          
        }
      }
    });
        
    }
     
     
  
   
    
    
    }
    console.log("ending");
 // connection.release();
    
});


app.get('/data',make,  function(req, res) {
    console.log("IN DATA");

console.log(final_data_mysql[0].userid);




});
function connect(req, res, next){
   connection = mysql.createPool({
  host     : '68.178.143.103',
  user     : 'noteme',
  password : 'Deland24!',
  database : 'noteme'
});
    next();
}
function make(req, res, next){
   
    connection.query('SELECT * from Notes', function(err, rows, fields) {
   // var temp=JSON.parse(rows);
    //console.log(temp);
   final_data_mysql=rows;
    //res.send(final_data_mysql);
   //     console.log(final_data_mysql);
    
  if (!err){
   // console.log(rows);
        next();}
  else{
    console.log('Error while performing Query.',err);}
  //  connection.end();
});
}
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});







// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function get_number(input)
{
    if(input=="1" || input=="one" || input=="1st" || input=="first" ){return "first";}
    else if(input=="2" || input=="two" || input=="2nd" || input=="second" ){return "second";}
    else if(input=="3" || input=="three" || input=="3rd" || input=="third" ){return "third";}
    else if(input=="4" || input=="four" || input=="4th" || input=="fourth" ){return "fourth";}
    else if(input=="5" || input=="five" || input=="5th" || input=="fifth" ){return "fifth";}
    else {return "empty";}
    
    
}

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

function p_data(id){
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    url: 'http://api.lighthouse247.com/api/v1/lighthouse/alexa_priorities',
    method: 'POST',
    headers: headers,
    form: {'userid': id}
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
})


}
function addData(query_data)
{
    connection.query(query_data, function(err, rows, fields) {
   
   
    console.log(query_data);
  if (!err)
    console.log('created successfully');
  else
    console.log('Error while adding');
  //  connection.end();
});
}

module.exports = app;
