"use strict";

const superagent = require("superagent");
const users = require("./users.js");
const base64 = require("base-64");

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

// const tokenServerUrl = process.env.TOKEN_SERVER;
// const remoteAPI = process.env.REMOTE_API;
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const API_SERVER = process.env.API_SERVER;

const tokenServerUrl = "https://api.sandbox.paypal.com/v1/oauth2/token";
const remoteAPI = "https://api.sandbox.paypal.com/v1/identity/oauth2/userinfo";
const CLIENT_ID =
  "AZzDLuhrFoAxHe6ok71Gelf_9EjIRLObirkCokufzCl2PN1A36fGKt3KYOjkOjtxwd_XqmtRLHbKMvUm";
const CLIENT_SECRET =
  "EJPl9qABuRP8rFs71ilSeN7cYn9ff8InXIgIEBge09szj7g_FamNo56u6_YyWyhgJ5WoHIRE4jW3_ent";
const API_SERVER = "https://as-store.herokuapp.com/oauth";
module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    console.log("(1) CODE:", code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log("(2) ACCESS TOKEN:", remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log("(3) GITHUB USER", remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log("(4) LOCAL USER", user);

    next();
  } catch (e) {
    console.log("what the hell");

    // next(`ERROR: ${e.message}`);
    next('hell');
  }
};

async function exchangeCodeForToken(code) {
  let credential = base64.decode(`${CLIENT_ID}:${CLIENT_SECRET}`);
  let tokenResponse = await superagent
    .post(tokenServerUrl)
    .send({
      code: code,
      grant_type: "authorization_code",
      redirect_uri: API_SERVER,
    })
    .set("Authorization", `Basic ${credential}`);

  let access_token = tokenResponse.body.access_token;

  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(remoteAPI)
    .query({ schema: "paypalv1.1" })
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`);

  let user = userResponse.body;

  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: "oauthpassword",
  };

  let user = await users.save(userRecord);
  let token = users.generateToken(user);

  return [user, token];
}
