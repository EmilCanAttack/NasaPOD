const express = require('express');
const request = require('request');
const app = express();

app.get('/', (req, res) => {
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
