import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { env } from "./config.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import './db-connect.js' // connect to DB

const app = express();

// REGISTER MIDDLEWARE
app.use(cors()); // allow access from everywhere to our API
app.use(express.json()); // parse incoming bodies => req.body

// HOME route
app.get("/", (req, res) => {
  res.send(`<h2>Authentication - Let's check it out, bro...</h2>`);
});

app.post("/signup", async (req, res, next) => {

  console.log("BODY: ", req.body)

  try {

    const { email, password } = req.body
    if(!email || !password) {
      const err = new Error("Please provide credentials email & password")
      err.status = 400
      return next(err)
    }

    // check if user already exists
    const userExists = await User.findOne({ email })
    if(userExists) {
      const err = new Error("User already exists! But thank you for your support...");
      err.status = 400;
      return next(err)
    }

    // hash password
    req.body.password = bcrypt.hashSync(req.body.password)
    const user = await User.create(req.body)
    res.json(user)
  }
  catch(err) {
    err.status = 400
    next(err)
  }
});

// indentify user
// create / issue a token
app.post("/login", async (req, res, next) => {

  const { email, password } = req.body

  const userFound = await User.findOne({ email: email })

  // user with email does not exist?
  // password does not match?
  if(!userFound || !bcrypt.compareSync(password, userFound.password)) {
    const err = new Error("User not found")
    err.status = 400
    return next(err)
  }

  // user credentials match 
  // => create a JWT token (=ticket)
  let token = jwt.sign({ _id: userFound._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY });

  res.json({
    user: userFound,
    token
  });
});

// create security guard which will protect confidential routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization; // box: { token: ey12384746565 }

  if (!token) {
    // throw new Error("You dont have a token!")
    const err = new Error("You do not have a token! Get outta herrreeee!")
    err.status = 401;
    return next(err);
  }

  // if somebody presents us a token => VERIFY its signature!
  try {
    const userDecoded = jwt.verify(token, env.JWT_SECRET);
    req.user = userDecoded; // store user info in request
    next(); // forward user to desired destination
  } catch (err) {
    err.status = 401
    next(err);
  }
};

// Route: /secret => authenticate (=security guard) => controller

// should just be accessible by authenticated users
app.get("/secret", authenticate, (req, res) => {
  res.json({ message: "You got the holy data!" });
});

// protected route
// data only available if logged in
app.get("/todos", authenticate, (req, res) => {
  console.log(req.user);

  const todos = [
    { _id: "t1", text: "Show some auth intro", userId: "u1" },
    {
      _id: "t2",
      text: "Answer Norman's questions accurately & slowly",
      userId: "u1",
    },
    { _id: "t3", text: "Let's make an extended break soon", userId: "u2" },
  ];

  res.json(todos);
});

// GENERAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}!`);
});

//Run app, then load http://localhost:5000 in a browser to see the output.
