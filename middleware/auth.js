require("dotenv/config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  //const token = req.body.header("x-auth-token");
  console.log("headers in auth server middleware");
  const token = req.body.headers["x_auth_token"];
  //console.log(req.headers);
  //Check for token
  if (!token) {
    //console.log(token);
    console.log("no token in server");
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    //Verified token
    const decoded = jwt.verify(token, process.env.jwtSecret);
    //Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Request not valid" });
  }
}

module.exports = auth;
