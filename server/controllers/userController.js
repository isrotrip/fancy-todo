const User = require('../models/user.js');
const decodeGoogleUserInfo = require('../helpers/decodeGoogleUserInfo.js');
const hashPassword = require('../helpers/hashPassword.js');
const getJWT = require('../helpers/getJWT.js');
require('dotenv').config();

class UserController {
  static signin(req,res){
    if(req.query.loginVia === 'google'){
      decodeGoogleUserInfo(req.headers.token_id)
        .then(userInfo => {
          return User
            .findOne({
              email: userInfo.email
            })
            .then(user => {
              if(user){
                if(user.loginVia !== 'google') throw new Error(`Please Signin Via ${user.loginVia}`);
                res.status(200).json({token: getJWT(user, 'sign'), userId: user._id, userName: user._email});
              } else {
                return User
                  .create({
                    name: userInfo.name,
                    email: userInfo.email,
                    password: hashPassword(process.env.GOOGLE_DEFAULT_PASSWORD),
                    profilePicture: userInfo.picture,
                    loginVia: 'google'
                  })
                  .then(user => {
                    res.status(201).json({token: getJWT(user, 'sign'), userId: user._id, userName: user._email});
                  })
              }
            })
        })
        .catch(err => {
          res.status(500).json({err: err.message});
        })
    } else if(req.query.loginVia === 'website'){
      User
        .findOne({
          email: req.body.email,
          password: hashPassword(req.body.password)
        })
        .then(user => {
          if(user){
            if(user.loginVia !== 'website') res.status(400).json({err: `Please Signin Via ${user.loginVia}`});
            res.status(200).json({token: getJWT(user, 'sign'), userId: user._id, userName: user._email});
          } else {
            res.status(400).json({err: 'Wrong Username/Password'});
          }
        })
        .catch(err => {
          res.status(500).json({err: err.message});
        })
    }
  }

  static signup(req, res){
    return User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword(req.body.password),
        loginVia: 'website'
      })
      .then(user => {
        res.status(201).json(getJWT(user, 'sign'));
      })
      .catch(err => {
        res.status(500).json({err: err.message});
      })
  }
}

module.exports = UserController;