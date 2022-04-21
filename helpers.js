const emailChecker = function (emailtoCheck, obj) {
  for (const element in obj) {
    if (obj[element]["email"] === emailtoCheck) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = function (emailtoCheck, obj) {
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

const generateRandomString = function () {
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
};

module.exports = {
  generateRandomString,
  urlsForUser,
  getUserByEmail,
  emailChecker,
};
