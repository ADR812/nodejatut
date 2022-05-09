const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();
app.use(express.json());

// /////////////////MONGOOSE SCHEMA /////////////////

const user = new mongoose.Schema(
  {
    IMEIid: Number
  }
);

const model = mongoose.model('user', user);

///////////////////get request /////////////////

app.get("/", (req, res) => {
  res.send("first request");
})
///////////////////////validation ////////////////
function sumDig(n) {
  let a = 0;
  while (n > 0) {
    a = a + n % 10;
    n = parseInt(n / 10, 10);
  }
  return a;
}

function isValidIMEI(n) {
  let s = n.toString();
  let len = s.length;

  if (len != 15)
    return false;

  let sum = 0;
  for (let i = len; i >= 1; i--) {
    let d = (n % 10);
    if (i % 2 == 0)
      d = 2 * d;
    sum += sumDig(d);
    n = parseInt(n / 10, 10);
  }

  return (sum % 10 == 0);
}
///////////////////////post request ///////////////////

app.post("/enterimei",
  async (req, res) => {
    try {
      const newIMEI = new model(req.body);
      await newIMEI.save();
      res.send({
        newIMEI,
        validation:isValidIMEI(newIMEI.IMEIid)
      });
    }
    catch (err) {
      res.send({ message: err });
    }
  }
)

mongoose.connect(process.env.DB_CONNECTION_PASS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
  (req, res) => {
    console.log("connected to db");
  })
app.listen(3000, () => {
  console.log("listening at port 3000");
})