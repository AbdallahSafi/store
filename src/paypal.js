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
    let code1 = req.query.code;

    let remoteToken = await exchangeCodeForToken(code1);

    let remoteUser = await getRemoteUserInfo(remoteToken);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

async function exchangeCodeForToken(code1) {
  let credential = base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);
  let tokenResponse = await superagent
    .post(tokenServerUrl)
    .type("form")
    .send({
      code: code1,
      grant_type: "authorization_code",
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
    password: "mypass",
  };

  try {
    let user = await users.save(userRecord);
    let token = users.generateToken(user);
    return [user, token];
  } catch (e) {
    console.log("save error", e);
    let user = "anything";
    let token = "anything";
    return [user, token];
  }
}
