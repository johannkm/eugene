"use strict";

var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var request = require("request");
var unirest = require('unirest');
var $BALANCE = 0;
// this is a hack, i do not care
var $NESSIE_API_KEY = "71ad9748b099a0d947b85535d9954611";
var transactions = [];

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('cors')());
app.set('port', (process.env.PORT || 5000));

io.on('connection', function(socket) {
    console.log('User connected!');
    io.emit("receiveMoney", { value: $BALANCE, transactions: transactions })
});

app.get('/payments', function(req, res) {
    res.send(transactions);
});

app.get('/transfer', function(req, res) {
    var amount = req.query.amount;
    var message = req.query.message;

    var today = new Date();

    unirest.post('http://api.reimaginebanking.com/accounts/5926fc9eceb8abe24250ddda/transfers?key=' + $NESSIE_API_KEY)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send({
            "medium": "balance",
            "payee_id": "5926fc81ceb8abe24250ddd8",
            "amount": parseFloat(amount),
            "transaction_date": "2017-05-24",
            "description": message
        })
       .end(function(response) {
            $BALANCE += parseFloat(amount);
            console.log("Balance: " + $BALANCE);
            transactions.unshift({ value: parseFloat(amount), message: message, date: today  })
            io.emit("receiveMoney", { value: $BALANCE, transactions: transactions })
        });
    res.send('success');
});

app.get('/childMoney', function(req, res) {
  request('http://api.reimaginebanking.com/accounts/5926fc9eceb8abe24250ddda/transfers?type=payer&key=' + $NESSIE_API_KEY, function(error, response, body) {
      res.send(body);
  });
});

app.get('/balance', function(req, res) {
  request('http://api.reimaginebanking.com/accounts?key=' + $NESSIE_API_KEY, function(error, response, body) {
      var jsonObj = JSON.parse(body);
      for (var obj = 0; obj < jsonObj.length; obj++) {
          if (jsonObj[obj].nickname == "childOfParent") {
              var bal = jsonObj[obj].balance
              console.log(bal)
          }
      }
      res.send(bal.toString());
  });
})

app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'));
});
