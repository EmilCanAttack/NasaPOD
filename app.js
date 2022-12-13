const express = require('express');
const request = require('request');
const app = express();

app.get('/', (req, res) => {
  // NASA POD API endpoint
  const url = 'https://api.nasa.gov/planetary/apod?api_key=pj8RlyhXoZqX0KIcBXydsH0laDHCABm0IaexhvzL';

  request(url, (error, response, body) => {
    // parse the JSON response
    const data = JSON.parse(body);
    // extract the URL, date and description of the picture from the response
    const imgUrl = data.url;
    const description = data.explanation;
    const date = data.date;
    // create an HTML page with the img and text
    const html = `
    <style>
    body {
      text-align: center;
    }
    img {
        width: 700px;
    }
    p {
      text-align: center;
    }
  </style>
  <h1>NASA PICTURE OF THE DAY</h1>
  <h2>${date}</h2>
  <img src="${imgUrl}" />
  <h2>DESCRIPTION</h2>
  <p>${description}</p>
    `;
    // send the HTML page as a response
    res.send(html);
  });
});

app.listen(8080, () => {
  console.log('Listening on localhost:8080');
});
