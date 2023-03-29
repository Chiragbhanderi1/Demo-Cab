const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const admin = require('firebase-admin');
const bodyParser = require('body-parser')
// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');
admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cab-rental-6445a-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

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

app.get('/fleets', async(req, res) => { 
  const data  = await db.collection('cab').get();
  const documents = [];
  data.docs.forEach((doc) => {
    documents.push(doc.data()); 
  });
  console.log(documents)
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
  const self = req.body.selfdrive || "" 
  const car = req.body.car || ""
  const data = {name:name,email:email,phone:phone,from:from,to:to,date:date,self:self,car:car}
  const response = await db.collection("booking").doc().set(data)
  // process the form data here
  if(response){
    res.sendFile(__dirname + '/index.html');
  }
})
// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
