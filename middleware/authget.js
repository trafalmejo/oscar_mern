require("dotenv/config");
const jwt = require("jsonwebtoken");

function authget(req, res, next) {
  //const token = req.body.header("x-auth-token");
  console.log("headers in auth server middleware");
  console.log(req);
  const token = req.headers["x_auth_token"];
  console.log(token);
  //console.log(req.headers);
  //Check for token
  if (!token) {
    //console.log(token);
    console.log("no token in server");
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    console.log("A");
    //Verified token
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log("B");

    //Add user from payload
    req.user = decoded;
    console.log("C");

    next();
  } catch (e) {
    console.log("error: ");
    //console.log(e);
    res.status(400).json({ msg: "Request not valid" });
  }
}

module.exports = authget;
