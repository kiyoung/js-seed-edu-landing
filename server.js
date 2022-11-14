const http = require("http")
const https = require("https")
const fs = require("fs");
const nodemailer = require("nodemailer");
let authInfo;
let smtpTransport;
var privateKey = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/privkey.pem")
var certificate = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/cert.pem")
var ca = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/chain.pem")
const credentials = { key: privateKey, cert: certificate, ca: ca }

// nodemailer.createTransport에 필요한 접속 정보 json parsing
fs.readFile("./auth.json", async (err, data) => {
    if (err) {
        throw err;
    }
    authInfo = await JSON.parse(data.toString());
});

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

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.get("*", (req, res) => {
    let to = "https://" +  req.headers.host + req.url;
    res.redirect(to)
})

const port = 80;
const index = "index";
const consulting = "consulting";
const reference_table = "reference_table";
const test = "test";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// const client = require('') // DB
app.set("view engine", "ejs");

let corsOptions = {
    // origin: 'https://seedconsulting.co.kr/',
    origin: "*",
    credentials: true,
};

// cors 옵션에 따라 cors 허용
app.use(cors(corsOptions));

app.listen(port, function () {
    console.log(`http://localhost`);
});

// http.createServer(app).listen(80)
https.createServer(credentials, app).listen(443)

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
    res.sendFile("reference_2nd3rd.html", {root: "views"});
});

app.post("/mail", async (req, res) => {
    console.log(req.body);
    let params = req.body;
    let htmlInfo;
    if (params.schedule_1 !== undefined) { // 1st consulting
        htmlInfo = `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>mail from consulting</title>
        </head>
        <style>
            .tg {
                border-collapse: collapse;
                border-color: #ccc;
                border-spacing: 0;
            }
        
            .tg td {
                background-color: #fff;
                border-color: #ccc;
                border-style: solid;
                border-width: 1px;
                color: #333;
                font-family: Arial, sans-serif;
                font-size: 14px;
                overflow: hidden;
                padding: 10px 20px;
                word-break: normal;
            }
        
            .tg th {
                background-color: #f0f0f0;
                border-color: #ccc;
                border-style: solid;
                border-width: 1px;
                color: #333;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: normal;
                overflow: hidden;
                padding: 10px 20px;
                word-break: normal;
            }
        
            .tg .tg-c3ow {
                border-color: inherit;
                text-align: center;
                vertical-align: top
            }
        
            .tg .tg-0pky {
                border-color: inherit;
                text-align: left;
                vertical-align: top
            }
        </style>
        <body>
        <table class="tg">
            <thead>
            <tr>
                <th class="tg-0pky">성별</th>
                <th class="tg-0pky">성명</th>
                <th class="tg-0pky">연락처</th>
                <th class="tg-0pky">이메일</th>
                <th class="tg-0pky">지원성향</th>
                <th class="tg-0pky">컨설팅 옵션</th>
                <th class="tg-0pky"></th>
                <th class="tg-0pky"></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="tg-0pky">${params.sex}</td>
                <td class="tg-0pky">${params.name}</td>
                <td class="tg-0pky">${params.contact}</td>
                <td class="tg-0pky">${params.email}</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky">구분</td>
                <td class="tg-0pky">국어</td>
                <td class="tg-0pky">수학</td>
                <td class="tg-0pky">영어</td>
                <td class="tg-c3ow" colspan="2">탐구영역</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky"></td>
                <td class="tg-0pky">${params.elective_subject_korean[0]}</td>
                <td class="tg-0pky">${params.elective_subject_math[0]}</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky">${params.elctvCrs1}</td>
                <td class="tg-0pky">${params.elctvCrs2}</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky">원점수</td>
                <td class="tg-0pky">${params.elective_subject_korean[1]}</td>
                <td class="tg-0pky">${params.elective_subject_math[1]}</td>
                <td class="tg-0pky">${params.elective_subject_english}</td>
                <td class="tg-0pky">${params.orgnlScore1}</td>
                <td class="tg-0pky">${params.orgnlScore2}</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky">표준점수</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky">백분위</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            <tr>
                <td class="tg-0pky">등급</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky">N/A</td>
                <td class="tg-0pky"></td>
                <td class="tg-0pky"></td>
            </tr>
            </tbody>
        </table>
        <br>
        <br>
        <table class="tg">
        <thead>
          <tr>
            <th class="tg-0lax" colspan="7">수시 대학별 고사 일정</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tg-0pky"></td>
            <td class="tg-0lax">1</td>
            <td class="tg-0lax">2</td>
            <td class="tg-0lax">3</td>
            <td class="tg-0lax">4</td>
            <td class="tg-0lax">5</td>
            <td class="tg-0lax">6</td>
          </tr>
          <tr>
            <td class="tg-0lax">학교/과</td>
            <td class="tg-0lax">${params.schedule_1[0]}</td>
            <td class="tg-0lax">${params.schedule_2[0]}</td>
            <td class="tg-0lax">${params.schedule_3[0]}</td>
            <td class="tg-0lax">${params.schedule_4[0]}</td>
            <td class="tg-0lax">${params.schedule_5[0]}</td>
            <td class="tg-0lax">${params.schedule_6[0]}</td>
          </tr>
          <tr>
            <td class="tg-0lax">날짜</td>
            <td class="tg-0lax">${params.schedule_1[1]}</td>
            <td class="tg-0lax">${params.schedule_2[1]}</td>
            <td class="tg-0lax">${params.schedule_3[1]}</td>
            <td class="tg-0lax">${params.schedule_4[1]}</td>
            <td class="tg-0lax">${params.schedule_5[1]}</td>
            <td class="tg-0lax">${params.schedule_6[1]}</td>
          </tr>
          <tr>
            <td class="tg-0lax">시간</td>
            <td class="tg-0lax">${params.schedule_1[2]}</td>
            <td class="tg-0lax">${params.schedule_2[2]}</td>
            <td class="tg-0lax">${params.schedule_3[2]}</td>
            <td class="tg-0lax">${params.schedule_4[2]}</td>
            <td class="tg-0lax">${params.schedule_5[2]}</td>
            <td class="tg-0lax">${params.schedule_6[2]}</td>
          </tr>
        </tbody>
        </table>
        </body>
        </html>
            `;
    } else { // 2nd, 3rd consulting
        htmlInfo = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>mail from consulting</title>
</head>
<style>
    .tg {
        border-collapse: collapse;
        border-color: #ccc;
        border-spacing: 0;
    }

    .tg td {
        background-color: #fff;
        border-color: #ccc;
        border-style: solid;
        border-width: 1px;
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 14px;
        overflow: hidden;
        padding: 10px 20px;
        word-break: normal;
    }

    .tg th {
        background-color: #f0f0f0;
        border-color: #ccc;
        border-style: solid;
        border-width: 1px;
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: normal;
        overflow: hidden;
        padding: 10px 20px;
        word-break: normal;
    }

    .tg .tg-c3ow {
        border-color: inherit;
        text-align: center;
        vertical-align: top
    }

    .tg .tg-0pky {
        border-color: inherit;
        text-align: left;
        vertical-align: top
    }
</style>
<body>
<table class="tg">
    <thead>
    <tr>
        <th class="tg-0pky">성별</th>
        <th class="tg-0pky">성명</th>
        <th class="tg-0pky">연락처</th>
        <th class="tg-0pky">이메일</th>
        <th class="tg-0pky">지원성향</th>
        <th class="tg-0pky">컨설팅 옵션</th>
        <th class="tg-0pky"></th>
        <th class="tg-0pky"></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="tg-0pky">${params.sex}</td>
        <td class="tg-0pky">${params.name}</td>
        <td class="tg-0pky">${params.contact}</td>
        <td class="tg-0pky">${params.email}</td>
        <td class="tg-0pky">${params.propensity}</td>
        <td class="tg-0pky">${params.package}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky">구분</td>
        <td class="tg-0pky">국어</td>
        <td class="tg-0pky">수학</td>
        <td class="tg-0pky">영어</td>
        <td class="tg-c3ow" colspan="2">탐구영역</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky"></td>
        <td class="tg-0pky">${params.elective_subject_korean[0]}</td>
        <td class="tg-0pky">${params.elective_subject_math[0]}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky">${params.elctvCrs1}</td>
        <td class="tg-0pky">${params.elctvCrs2}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky">원점수</td>
        <td class="tg-0pky">${params.elective_subject_korean[1]}</td>
        <td class="tg-0pky">${params.elective_subject_math[1]}</td>
        <td class="tg-0pky">${params.elective_subject_english}</td>
        <td class="tg-0pky">${params.orgnlScore1}</td>
        <td class="tg-0pky">${params.orgnlScore2}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky">표준점수</td>
        <td class="tg-0pky">${params.stdScore_korean}</td>
        <td class="tg-0pky">${params.stdScore_math}</td>
        <td class="tg-0pky">${params.stdScore_Eng}</td>
        <td class="tg-0pky">${params.stdScore_Explo_1}</td>
        <td class="tg-0pky">${params.stdScore_Explo_2}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky">백분위</td>
        <td class="tg-0pky">${params.percentile_korean}</td>
        <td class="tg-0pky">${params.percentile_math}</td>
        <td class="tg-0pky">${params.percentile_Eng}</td>
        <td class="tg-0pky">${params.percentile_Explo_1}</td>
        <td class="tg-0pky">${params.percentile_Explo_2}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky">등급</td>
        <td class="tg-0pky">${params.grade_korean}</td>
        <td class="tg-0pky">${params.grade_math}</td>
        <td class="tg-0pky">${params.grade_Eng}</td>
        <td class="tg-0pky">${params.grade_Explo_1}</td>
        <td class="tg-0pky">${params.grade_Explo_2}</td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    </tbody>
</table>
<br>
<br>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax"></th>
    <th class="tg-0lax">가군</th>
    <th class="tg-0lax">나군</th>
    <th class="tg-0lax">다군</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">1지망</td>
    <td class="tg-0lax">${params.a_1st_apply}</td>
    <td class="tg-0lax">${params.b_1st_apply}</td>
    <td class="tg-0lax">${params.c_1st_apply}</td>
  </tr>
  <tr>
    <td class="tg-0lax">2지망</td>
    <td class="tg-0lax">${params.a_2nd_apply}</td>
    <td class="tg-0lax">${params.b_2nd_apply}</td>
    <td class="tg-0lax">${params.c_2nd_apply}</td>
  </tr>
  <tr>
    <td class="tg-0lax">3지망</td>
    <td class="tg-0lax">${params.a_3rd_apply}</td>
    <td class="tg-0lax">${params.a_3rd_apply}</td>
    <td class="tg-0lax">${params.a_3rd_apply}</td>
  </tr>
  <br>
  <br>
  <tr>
    <td class="tg-0lax">요청사항</td>
  </tr>
  <tr>
  <td class="tg-0lax">${params.request}</td>
 </tr>
  
</tbody>
</table>
</body>
</html>
    `;
    }


    await makeTransport();
    await smtpTransport.sendMail({
        from: '"mySelf" <seedconsulting2022@gmail.com>',
        to: "seedconsulting2022@gmail.com",
        subject: "2023 수능 컨설팅 요청이 접수되었습니다",
        // text: "Hello world?",
        // html: "<strong>Hello world?</strong>",
        html: htmlInfo,
        headers: {"x-myheader": "test header"},
    });

    res.redirect("/");
});
