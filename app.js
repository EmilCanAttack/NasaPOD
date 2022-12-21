const express = require('express');
const request = require('request');
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


// Middleware-funktion til at kontrollere, om brugeren er godkendt
function checkAuth(req, res, next) {
  if (req.session.authenticated) {
    // Brugeren er godkendt, tillad adgang til ruten
    next();
  } else {
    // Brugeren er ikke godkendt, omdiriger til login-siden
    res.redirect('/login');
  }
}


app.get('/', (req, res) => {
  res.send(`
    <h1>Sign Up</h1>
    <form method="POST" action="/signup">
      <label>Email:</label>
      <input type="email" name="email" required />
      <br />
      <label>Password:</label>
      <input type="password" name="password" required />
      <br />
      <button>Sign Up</button>
    </form>
  `);
});

// Initialize the session object when the user logs in
app.route('/signup')
  .get((req, res) => {
    res.send(`
    <style>
    body {
      text-align: center;
      background-color: black;
      color: white;
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
    }
    img {
        width: 600px;
    }
    p {
      text-align: center;
      color: white;
    }
  </style>
      <h1>Sign Up</h1>
      <form method="POST" action="/signup">
        <label>Email:</label>
        <input type="email" name="email" required />
        <br />
        <label>Password:</label>
        <input type="password" name="password" required />
        <br />
        <button>Sign Up</button>
      </form>
      <form method="GET" action="/login">
    <h3> Already have an account? login here </h3>
      <button>Sign Up</button>
    </form>
    `);
  })
  .post((req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10; // Number of rounds to generate the salt
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        // Handle error
        return;
      }
      const data = JSON.stringify({ email, password: hash });
      fs.writeFileSync('users.json', data);
      res.redirect('/login');
    });
  });


app.get('/login', (req, res) => {
  res.send(`
  <style>
    body {
      text-align: center;
      background-color: black;
      color: white;
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
    }
    img {
        width: 600px;
    }
    p {
      text-align: center;
      color: white;
    }
  </style>
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label>Email:</label>
      <input type="email" name="email" required />
      <br />
      <label>Password:</label>
      <input type="password" name="password" required />
      <br />
      <button>Login</button>
    </form>
    <form method="GET" action="/signup">
    <h3> Dont have an account? sign up here </h3>
      <button>Sign Up</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = fs.readFileSync('users.json');
  const user = JSON.parse(data);
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      // Handle error
      return;
    }
    if (result) {
      // Set the authenticated property in the session
      req.session.authenticated = true;
      res.redirect('/nasa');
    } else {
      res.send('Incorrect email or password');
    }
  });
});

app.get('/nasa', checkAuth, (req, res) => {
  // NASA POD API endpoint
  const url = 'https://api.nasa.gov/planetary/apod?api_key=pj8RlyhXoZqX0KIcBXydsH0laDHCABm0IaexhvzL';

  request(url, (error, response, body) => {
    // parse JSON response til JS syntax
    const data = JSON.parse(body);
    // udtræk URL, titel, dato og beskrivelse af billedet fra response
    const imgUrl = data.url;
    const description = data.explanation;
    const date = data.date;
    const title = data.title;
    // Lav en HTML side med img og text
    const html = `
    <style>
    body {
      text-align: center;
      background-color: black;
      color: white;
    }
    img {
        width: 600px;
    }
    p {
      text-align: center;
      color: white;
    }
  </style>
  <h1>NASA PICTURE OF THE DAY</h1>
  <h2>${title}</h2>
  <h3>${date}</h3>
  <img src="${imgUrl}" />
  <h2>DESCRIPTION</h2>
  <p>${description}</p>
  <br>
  <button onclick="location.href='/ziya'">Click here to see ZIYA ATAN</button>
    `;
    // send html as response
    res.send(html);
  });
});

// ZIYA ATAN HJEMMESIDE 
app.get('/ziya', (req, res) => {
  // HTML HJEMMESIDE DEDIKERET TIL MIN FAR
  const imgUrl = "https://i.ibb.co/HN0Zt4x/ziyanmark.jpg"
  const html = `
  <style>
    body {
      text-align: center;
      background-color: black;
    }
    img {
      width: 600px;
    }
    h1 {
      font-size: 72px;
      letter-spacing: 5px;
      background: linear-gradient(to right, red, white);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  </style>
  <h1>ZIYA ATAN</h1>
  <img src="${imgUrl}" />
  `;

  // send the HTML page as a response
  res.send(html);
});


app.listen(8080, () => {
  console.log('Listening on localhost:8080');
});
