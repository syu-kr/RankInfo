const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const fs = require("fs")

app.use(bodyParser.json())

app.use("/", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/index.html")
})

app.get("/student", async (req, res) => {
  const id = req.query.id
  fs.readFile("./request1.xml", "utf8", async function (err, data) {
    const student = data.replace(/{STUNO}/g, id)
    res.set("Content-Type", "text/xml")
    await fetch("https://suwings.syu.ac.kr/websquare/engine/proworks/callServletService.jsp", {
      method: "POST",
      headers: {
        Cookie:
          "JSESSIONID_intranet=BrTjlLr3pnIeKCvT0hOhJV6CWstMeStdrBalazrI8FmNeLtzvDDxjkI0zrnoaVVQ.d2FzX3NlcnZsZXRfZW5naW5lMg==",
      },
      body: student,
    })
      .then((data) => data.text())
      .then((data) => res.send(data))
  })
})

app.get("/rank", async (req, res) => {
  const id = req.query.id
  const year = req.query.y
  const semester = req.query.s
  fs.readFile("./request2.xml", "utf8", async function (err, data) {
    const rank = data
      .replace(/{STUNO}/g, id)
      .replace(/{YY}/g, year)
      .replace(/{SHTM_CD}/g, semester)
    res.set("Content-Type", "text/xml")
    await fetch("https://suwings.syu.ac.kr/websquare/engine/proworks/callServletService.jsp", {
      method: "POST",
      headers: {
        Cookie:
          "JSESSIONID_intranet=BrTjlLr3pnIeKCvT0hOhJV6CWstMeStdrBalazrI8FmNeLtzvDDxjkI0zrnoaVVQ.d2FzX3NlcnZsZXRfZW5naW5lMg==",
      },
      body: rank,
    })
      .then((data) => data.text())
      .then((data) => res.send(data))
  })
})

app.listen(80, () => {
  console.log("Server running at http://127.0.0.1")
})
