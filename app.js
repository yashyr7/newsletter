const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const apiKey = "ac2957dac464c3d70f59dd982c7d1cd5-us7";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res) => {
  const https = require("https");
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var url = " https://us7.api.mailchimp.com/3.0/lists/8120d11aec";

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  var jsonData = JSON.stringify(data);

  var options = {
    method: "POST",
    auth: "yashyr7:" + apiKey
  }

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (d) => {
      console.log(JSON.parse(d));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure.html", (req, res) => {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000);