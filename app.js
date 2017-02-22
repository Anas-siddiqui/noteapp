'use strict';
let alexaVerifier = require('alexa-verifier');
var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
 var request = require("request");
var connection;
var app = express();
//

var user_id="";
 var user_new=true;
var final_data_mysql="";
var notes_total;
  var user_db_count=0;
var user_notes=0;
 


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
  
//var http = require("http");
//setInterval(function() {
//    http.get("http://alexanoteapp.herokuapp.com");
//}, 300000); 
// catch 404 and forward to error handler


app.post('/skill',requestVerifier,make,  function(req, res) {
    
  

  // console.log(final_data_mysql);
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
         //  console.log("matched at "+user_db_count); 
           user_new=false; 
         
           data=final_data_mysql[i].first;
        
          if(data){
              user_notes++;
          }
               data=final_data_mysql[i].second;
          if(data){
              user_notes++;
          }
           data=final_data_mysql[i].third;
          if(data){
              user_notes++;
          }
           data=final_data_mysql[i].fourth;
          if(data){
              user_notes++;
          }
           data=final_data_mysql[i].fifth;
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
          "ssml": "<speak>Welcome to note me skill, you can now save , play and delete notes"+"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
    }); }
        else{
             res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Welcome back to note me , you have saved "+user_notes+" notes"+" you can now save , play and delete notes</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
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
          "ssml": "<speak>See you soon</speak>"
          
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
          "ssml": "<speak>See you soon</speak>"
          
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
          "ssml": "<speak>Save a note by speaking save my home work is done"+"<break time=\"1s\"/>"+"or you can play it by speaking play"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
    });
      
  
      
  }
  else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'getinput') {
   
 // if(req.body.session.attributes){
    
// if(req.body.session.attributes.STATE=="launched" || //req.body.session.attributes.STATE=="insession") 
 //{
     
     data=final_data_mysql[user_db_count].first;
    //  console.log("length is "+data.length+" "+data);
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
          "ssml": "<speak>" +"Your data was saved successfully on first slot"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
          "ssml": "<speak>" +"Your data was saved successfully on second slot"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                  
          }
              else if(data.length>0){
                data=final_data_mysql[user_db_count].third; 
                  if(data.length===0){
                  //db.push("/notes["+user_db_count+"]/second",req.body.request.intent.slots.task.value); 
           var query="UPDATE Notes SET third=('"+req.body.request.intent.slots.task.value+"') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
          res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your data was saved successfully on third slot"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                  
          }
                  else if(data.length>0){
                   data=final_data_mysql[user_db_count].fourth; 
                      if(data.length===0){
                  //db.push("/notes["+user_db_count+"]/second",req.body.request.intent.slots.task.value); 
           var query="UPDATE Notes SET fourth=('"+req.body.request.intent.slots.task.value+"') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
          res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your data was saved successfully on fourth slot"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                  
          }
                      else if(data.length>0){
                           data=final_data_mysql[user_db_count].fifth; 
                      if(data.length===0){
                  //db.push("/notes["+user_db_count+"]/second",req.body.request.intent.slots.task.value); 
           var query="UPDATE Notes SET fifth=('"+req.body.request.intent.slots.task.value+"') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
          res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your data was saved successfully on fifth slot"
       
            +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                  
          }
         else{  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"You have all slots full, Please choose delete to empty the slots"+"</speak>"
       
            
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
          
      }
                          
                      }
                  }
              }
             
          }
      
           
      
 // }}
  //    else{
         
   //       launched(res);
   //   }
   
  }
    else if (req.body.request.type === 'IntentRequest' &&
           req.body.request.intent.name === 'getoptions') {
       
      
   if(!req.body.request.intent.slots.options.value)
   {
        
        
       res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Sorry I didnt hear any options"
       
             +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
    });
       
    
   }
      else if(req.body.request.intent.slots.options.value=="play")
   {
    //   if(req.body.session.attributes){
    //    if(req.body.session.attributes.STATE=="launched"  || //req.body.session.attributes.STATE=="insession"){
       var result="";
           if(req.body.request.intent.slots.delete_option.value && req.body.request.intent.slots.delete_option.value !="?" ){
               var temp=get_number(req.body.request.intent.slots.delete_option.value);
                    if(temp=="empty")
                    {
                        result="Invalid note number";
                    }
                    else{
                       if(temp=="first"){
                             data=final_data_mysql[user_db_count].first; 
                           if(data){
                           result=" first note is "+data;}
                           else{result=" No saved note at this slot";}
                       }
                        else if(temp=="second"){
                             data=final_data_mysql[user_db_count].second; 
                             if(data){
                            result=" second note is "+data;}
                            else{result=" No saved note at this slot";}
                            
                        }
                        else if(temp=="third"){
                              data=final_data_mysql[user_db_count].third; 
                             if(data){
                            result=" third note is "+data;
                             }
                            else{result=" No saved note at this slot";}
                        }
                        else if(temp=="fourth"){
                             data=final_data_mysql[user_db_count].fourth; 
                             if(data){
                            result=" fourth note is "+data;}
                            else{result=" No saved note at this slot";}
                        }
                        else if(temp=="fifth"){
                             data=final_data_mysql[user_db_count].fifth; 
                             if(data){
                            result=" fifth note is "+data;}
                            else{result=" No saved note at this slot";}
                        }
                  
                     
                    }
               
           }
       else if(req.body.request.intent.slots.delete_option.value =="?"){result="Invalid number";}
       else{
           
           data=final_data_mysql[user_db_count].first; 
          if(data){
              
              result+=" first note is "+data;
      
    
          }
      
     //    data=db.getData("/notes["+user_db_count+"]/second");
       data=final_data_mysql[user_db_count].second; 
         if(data){
      
             result+=" second note is "+data;
           
        
        
   
          }
       data=final_data_mysql[user_db_count].third; 
         if(data){
      
             result+=" third note is "+data;
           
        
        
   
          }
       data=final_data_mysql[user_db_count].fourth; 
         if(data){
      
             result+=" fourth note is "+data;
           
        
        
   
          }
       data=final_data_mysql[user_db_count].fifth; 
         if(data){
      
             result+=" fifth note is "+data;
           
        
        
   
          }
       }
       
        
    
    
     //  data=db.getData("/notes["+user_db_count+"]/first");
       
       if(result){
       
       res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>"+ result
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
         
       }
       
  // }}

    //   else{launched(res);}
   }
        else if(req.body.request.intent.slots.options.value=="delete")
            {
            //    if(req.body.session.attributes){
           //   if(req.body.session.attributes.STATE=="launched"  || //req.body.session.attributes.STATE=="insession"){
             
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
       
             +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
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
       
            +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                      
                    }
                    else{
                 var query="UPDATE Notes SET "+temp +"=('') WHERE id="+final_data_mysql[user_db_count].id;
              addData(query);
                     
                   
                  res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>" +"Your note was deleted successfully"
       
           +"<break time=\"1s\"/>" +"</speak>"
          
        }
      },"sessionAttributes": {"STATE":"insession"}
    });
                     
                    }
          
            }
        
      
           // }}
           //     else{launched(res);}
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
    else{ res.json({
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
  //  console.log("ending");
 // connection.release();
    
});


app.get('/data',make,  function(req, res) {
   // console.log("IN DATA");

//console.log(final_data_mysql[0].userid);




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



function launched(res){
    
   if(user_new){
        res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Welcome to note me skill"+"now from here you can save, play or delete notes</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
    }); }
        else{
             res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Welcome back to note me , you have saved "+user_notes+" notes"+"  now from here you can save, play or delete notes</speak>"
          
        }
      },"sessionAttributes": {"STATE":"launched"}
    });
            
        } 
}
function addData(query_data)
{
    connection.query(query_data, function(err, rows, fields) {
   
   
   // console.log(query_data);
  if (!err){
   // console.log('created successfully');
  }
  else{
      //  console.log('Error while adding');
  }
  
  //  connection.end();
});
}

module.exports = app;
