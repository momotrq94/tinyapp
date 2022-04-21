const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

const emailChecker = function (emailtoCheck, obj) {
  for (const element in obj) {
    if (obj[element]["email"] === emailtoCheck) {
      return true;
    }
  }
  return false;
};

const userFinder = function (emailtoCheck, obj) {
  for (const element in obj) {
    if (obj[element]["email"] === emailtoCheck) {
      return obj[element];
    }
  }
};

const urlsForUser = function (id, obj) {
  let outputObject = {};
  for (const element in obj) {
    if (obj[element].userID === id) {
      outputObject[element] = obj[element].longURL;
    }
  }
  return outputObject;
};

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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// urls main page
app.get("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("Please Register/Login to view page");
  }
  const filteredUrlDatabase = urlsForUser(req.cookies["user_id"], urlDatabase);
  const templateVars = {
    urls: filteredUrlDatabase,
    username: users[req.cookies["user_id"]],
  };
  res.render("urls_index.ejs", templateVars);
});

// new url page
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  const templateVars = { username: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

// specific path to open shortURL page
app.get("/urls/:shortURL", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("Please Register/Login to view page");
  }
  let id = req.params.shortURL;
  if (!urlDatabase[id]) {
    return res.status(404).send("The page does not exist!");
  }
  if (urlDatabase[id]["userID"] !== req.cookies["user_id"]) {
    return res.status(401).send("Unauthorized user access");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

// login page
app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { username: users[req.cookies["user_id"]] };
  res.render("login.ejs", templateVars);
});

// register page
app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { username: users[req.cookies["user_id"]] };
  res.render("registeration", templateVars);
});

// register user
app.post("/register", (req, res) => {
  let uniqueID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .send(
        "ERROR! Please enter a valid email and password, fields cannot be left blank"
      );
  }

  if (emailChecker(email, users)) {
    res
      .status(400)
      .send(
        "ERROR! An account with that email address already exists, try another email or login with the email used."
      );
  }

  users[uniqueID] = {
    id: uniqueID,
    email: email,
    password: password,
  };

  res.cookie("user_id", uniqueID);

  res.redirect("/urls");
});

// create new url
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  let id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"],
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});

// delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("Please Register/Login to view page");
  }

  let id = req.params.shortURL;
  if (urlDatabase[id]["userID"] !== req.cookies["user_id"]) {
    return res.status(401).send("Unauthorized user access");
  }

  delete urlDatabase[id];
  res.redirect(`/urls`);
});

// edit url
app.post("/urls/:id", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(401).send("Please Register/Login to view page");
  }

  let ids = req.params.id;
  if (urlDatabase[ids]["userID"] !== req.cookies["user_id"]) {
    return res.status(401).send("Unauthorized user access");
  }
  urlDatabase[ids].longURL = req.body.newURL;
  res.redirect(`/urls/${ids}`);
});

// redirect to long url
app.get("/u/:shortURL", (req, res) => {
  const shortUrlId = req.params.shortURL;
  const longURL = urlDatabase[shortUrlId].longURL;

  if (!longURL) {
    return res.send("error404! page not found");
  }

  res.redirect(longURL);
});

// login and cookie send
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!emailChecker(email, users)) {
    return res.status(403).send("ERROR! User not found!");
  }
  const user = userFinder(email, users);
  if (emailChecker(email, users)) {
    if (password !== user["password"]) {
      return res
        .status(403)
        .send("ERROR! Password incorrect please try again.");
    }
  }

  res.cookie("user_id", user["id"]);

  res.redirect(`/urls`);
});

// logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
