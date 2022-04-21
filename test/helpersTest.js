const { assert } = require("chai");

const {
  generateRandomString,
  urlsForUser,
  getUserByEmail,
  emailChecker,
} = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "a1b2c3",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "a1b2c4",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(expectedUserID, user.id);
  });
  it("should return undefined if a user with that email does not exist", function () {
    const user = getUserByEmail("user3@example.com", testUsers);
    assert.strictEqual(user, undefined);
  });
});

describe("generateRandomString", function () {
  it("should return a string", function () {
    const id = generateRandomString();
    assert.isString(id);
  });
  it("should return a string with 6 characters", function () {
    const id = generateRandomString();
    const lengthID = id.length;
    assert.strictEqual(lengthID, 6);
  });
});

describe("emailChecker", function () {
  it("should return true if email exists", function () {
    const result = emailChecker("user@example.com", testUsers);
    assert.strictEqual(result, true);
  });
  it("should return false if email does not exist", function () {
    const result = emailChecker("user3@example.com", testUsers);
    assert.strictEqual(result, false);
  });
});

describe("urlsForUser", function () {
  it("should return the urls belonging to the given user id", function () {
    const result = urlsForUser("a1b2c3", testUrlDatabase);
    const output = {
      b6UTxQ: "https://www.tsn.ca",
    };
    assert.deepEqual(result, output);
  });
  it("should return empty object if no urls found", function () {
    const result = urlsForUser("abc123", testUrlDatabase);
    const output = {};
    assert.deepEqual(result, output);
  });
});
