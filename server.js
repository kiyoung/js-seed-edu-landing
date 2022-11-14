// const http = require("http")
// const https = require("https")
const fs = require("fs");
const nodemailer = require("nodemailer");
let authInfo;
let smtpTransport;
// var privateKey = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/privkey.pem")
// var certificate = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/cert.pem")
// var ca = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/chain.pem")
// const credentials = { key: privateKey, cert: certificate, ca: ca }

// nodemailer.createTransport에 필요한 접속 정보 json parsing
// async function getConnectionInfo(jsonAuth) {
fs.readFile("./auth.json", async (err, data) => {
  if (err) {
    throw err;
  }
  authInfo = await JSON.parse(data.toString());
});
// }

// console.log("authInfo: "+ authInfo);    // undefined
async function makeTransport() {
  smtpTransport = await nodemailer.createTransport({
    host: authInfo.hostInfo,
    port: authInfo.portInfo,
    service: authInfo.service,
    secure: false,
    requireTLS: true,
    auth: {
      user: authInfo.email,
      pass: authInfo.passwd,
    },
    logger: true,
  });
}

console.log("after makeTransport(): " + smtpTransport);

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 80;
const index = "index";
const consulting = "consulting";
const reference_table = "reference_table";
const test = "test";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// const client = require('') // DB
app.set("view engine", "ejs");

let corsOptions = {
  // origin: 'https://seedconsulting.co.kr/', // 실서버 구동시 주석 해제
  origin: "*", // 로컬 작업시 사용
  credentials: true,
};

// cors 옵션에 따라 cors 허용
app.use(cors(corsOptions));

app.listen(port, function () {
  console.log(`http://localhost`);
});

// http.createServer(app).listen(80)
// https.createServer(credentials, app).listen(443)

// main page
app.use("/vendors", require("./라우터/공급사"));

app.get("/", (req, res) => {
  res.render(index);
});

app.get("/consulting", (req, res) => {
  res.render(consulting);
});

app.get("/reference_table", (req, res) => {
  res.render(reference_table);
});

app.get("/test", (req, res) => {
  res.render(test);
});

app.get("/reference_2nd3rd", (req, res) => {
  res.sendFile("reference_2nd3rd.html", { root: "views" });
});

app.post("/mail", async (req, res) => {
  console.log(req.body);
  var params = req.body;

  var html = `
        <div>
            성별 : ${params.sex}
        </div>
        <div>
            이름 : ${params.name}
        </div>
    `;

  await makeTransport();
  await smtpTransport.sendMail({
    from: '"mySelf" <seedconsulting2022@gmail.com>',
    to: "seedconsulting2022@gmail.com",
    subject: "Hello from node",
    text: "Hello world?",
    html: "<strong>Hello world?</strong>",
    headers: { "x-myheader": "test header" },
  });

  //res.redirect("/");
});
