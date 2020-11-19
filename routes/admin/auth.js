const express = require("express");
const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists, 
  requireValidPasswordForUser
} = require("./validators");
const signup = require("../../views/admin/auth/signup");

const router = express.Router();

//******SIGNUP******

//SIGNUP GET FUNCTION
router.get("/signup", (req, res) => {
  //Response is the signup Template from signup.js
  res.send(signupTemplate({ req }));
});

//SIGNUP POST FUNCTION
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }
    console.log(errors);
    //destructure email, password, passwordConfirmation from req.body
    const { email, password, passwordConfirmation } = req.body;
    //create a user in repo to represent this person
    const user = await usersRepo.create({ email, password });
    //store the id of the user inside the users cookie
    req.session.userId = user.id;
    res.send("Account Created");
  }
);

//******SIGNOUT******

//SIGNOUT GET FUNCTION
router.get("/signout", (req, res) => {
  //set cookie to null
  req.session = null;
  res.send("You are logged out");
});

//******SIGNIN******

//SIGNIN GET FUNCTION
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

//SIGNIN POST FUNCTION
router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.send(signinTemplate({ errors }))
      }
    //find email and password
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.send("You are signed in");
  }
);

module.exports = router;

