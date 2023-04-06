const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const admin = require('firebase-admin');
const bodyParser = require('body-parser')
const twilio = require('twilio');
const mustacheExpress = require('mustache-express');
// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');
admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cab-rental-6445a-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

const client = twilio("AC5379cc509dd22a03dec92142cb441d5d","2c8f13abd180ca6d8849fc5fd3fda461");

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', 'views');

// Configure Mustache as the templating engine
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/public/"));

const db =  admin.firestore();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

// Define routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
}); 
 
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html');
});

app.get('/contact', (req, res) => {  
  res.sendFile(__dirname + '/contact.html');
});

app.get('/book', (req, res) => {
  res.sendFile(__dirname + '/book.html');
});
app.get('/packages', (req, res) => {
  res.sendFile(__dirname + '/packages.html');
}); 

app.get('/fleets', async(req, res) => { 
  const data  = await db.collection('cab').get(); 
  const documents = [];
  data.docs.forEach((doc) => {
    documents.push(doc.data()); 
  });
  res.render("fleets",{documents})  
  // res.sendFile(__dirname + '/fleets.html');
});
// form submiting 
app.post('/submit', async(req, res) => {
  const name = req.body.name
  const email = req.body.email
  const phone = req.body.phone
  const from = req.body.from
  const to = req.body.to 
  const date = req.body.date
  const car = req.body.car
  const data = {name:name,email:email,phone:phone,from:from,to:to,date:date,car:car}
  const response = await db.collection("booking").doc().set(data)
  // process the form data here
  client.messages.create({
    to: '+919998252323',
    from: '+14406368399',
    body: name+" has Booked a cab from "+from+" to "+to+" on "+date +" of car " +car+" his phone Number is"+phone
  })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
  
  if(response){
    res.sendFile(__dirname + '/index.html');
  }
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
