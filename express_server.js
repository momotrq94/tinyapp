const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

function generateRandomString() {
  let characterString =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let stringLength = characterString.length;
  let outputArray = [];

  for (let i = 0; i < 6; i++) {
    outputArray.push(
      characterString.charAt(Math.floor(Math.random() * stringLength))
    );
  }
  outputString = outputArray.join("");
  return outputString;
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("registeration", templateVars);
});
// create new url
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});
// delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  let id = req.params.shortURL;
  delete urlDatabase[id];
  res.redirect(`/urls`);
});
// edit url
app.post("/urls/:id", (req, res) => {
  let ids = req.params.id;
  urlDatabase[ids] = req.body.newURL;
  res.redirect(`/urls/${ids}`);
});
// redirect to long url
app.get("/u/:shortURL", (req, res) => {
  const shortUrlId = req.params.shortURL;
  const longURL = urlDatabase[shortUrlId];
  if (longURL) {
    res.redirect(longURL);
  } else if (!longURL) {
    res.send("error404! page not found");
  }
});

// login and cookie send

app.post("/login", (req, res) => {
  let name = req.body.username;
  res.cookie("username", name);
  res.redirect(`/urls`);
});

// logout

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
