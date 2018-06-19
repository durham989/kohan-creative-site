// Package imports
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var file = require('file-system');

// SendGrid setup
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Connect MySQL Database
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

function startConnection() {
  console.log('CONNECTING');
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  connection.connect(function(err) {
    if (err) {
      console.error('CONNECT FAILED', err.code);
      startConnection();
    }
    else {
      console.log('CONNECTED');
    }
  });
  connection.on('error', function(err) {
    if (err.fatal) {
      startConnection();
    }
  });
}

startConnection();

var app = express();
// var consultation = require('./routes/consultation/consultation');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/consultation', consultation);

// Port Number
var port = process.env.PORT || 3000;

// CORS Mioddleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'dist')));

// Consultation form email
app.route('/work-with-us').post((req, res) => {
  const leadEmailAddress = req.body.email;
  const leadOrgName = req.body.practiceName;

  var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

  const consultationDBEntry = {
    emailAddress: leadEmailAddress,
    practiceName: leadOrgName,
    date: CURRENT_TIMESTAMP
  };

  const msg = {
    to: ['ethan@kasuriagroup.com', 'info@kohancreative.com'],
    // to: 'ethan.durham3692@gmail.com',
    from: 'thanks@kohancreative.com',
    subject: 'Kohan Creative Consultation Form Submission',
    html: `<p>The following individual just submitted a consultation form on Aqueduct.ai:</p><p><ul><li>First Name: ${leadFirstName}</li><li>Last Name: ${leadLastName}</li><li>Email Address: ${leadEmailAddress}</li><li>Org Name: ${leadOrgName}</li></ul></p><p>Follow up with them ASAP!</p>`
  };

  return sgMail.send(msg)

    .then(() => connection.query('INSERT INTO work SET ?', consultationDBEntry, function (error, results) {
      if (error) throw error;
      if (results) {
        console.log('results of database entry are: ' + results);
      }
    }))
    .then(() => res.status(200).json({
      message: 'email sent!'
    }))
    .catch(() => res.status(400).send(err))

});

// Whitepaper form email
app.route('/contact-us').post((req, res) => {
  const leadFirstName = req.body.firstName;
  const leadLastName = req.body.lastName;
  const leadEmailAddress = req.body.email;
  const leadOrgName = req.body.practiceName;
  const contactUsMessage = req.body.contactUsMessage;

  var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

  const consultationDBEntry = {
    firstName: leadFirstName,
    lastName: leadLastName,
    emailAddress: leadEmailAddress,
    practiceName: leadOrgName,
    contactUsMessage: contactUsMessage,
    date: CURRENT_TIMESTAMP
  };

  const msg = {
    to: ['ethan@kasuriagroup.com', 'info@kohancreative.com'],
    // to: 'ethan.durham3692@gmail.com',
    from: 'thanks@kohancreative.com',
    subject: 'Kohan Creative Contact Us Form Submission',
    html: `<p>The following individual just submitted a consultation form on Aqueduct.ai:</p><p><ul><li>First Name: ${leadFirstName}</li><li>Last Name: ${leadLastName}</li><li>Email Address: ${leadEmailAddress}</li><li>Practice Name: ${leadOrgName}</li><li>Message: ${contactUsMessage}</li></ul></p><p>Follow up with them ASAP!</p>`
  };

  return sgMail.send(msg)

    .then(() => connection.query('INSERT INTO contact SET ?', consultationDBEntry, function (error, results) {
      if (error) throw error;
      if (results) {
        console.log('results of database entry are: ' + results);
      }
    }))
    .then(() => res.status(200).json({
      message: 'email sent!'
    }))
    .catch(() => res.status(400).send(err))

});

// Index Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log('Server started on port: ' + port);
});