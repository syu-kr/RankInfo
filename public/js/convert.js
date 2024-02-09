function convertSemester(data) {
  if (data == "10") return "1학기 정규"
  else if (data == "15") return "1학기 계절"
  else if (data == "20") return "2학기 정규"
  else if (data == "25") return "2학기 계절"
}
function submit() {
  const id = document.getElementById("STUDENT_NUMBER").value
  document.getElementById("info").innerHTML = ""
  fetch("http://127.0.0.1/student?id=" + id, {
    method: "GET",
  })
    .then((data11) => data11.text())
    .then((data1) => {
      let xml1 = new DOMParser().parseFromString(data1, "text/xml")
      let convert = xmlToJson(xml1)["vector"]["data"]
      for (let c of convert) {
        const y = c["ROW"]["YY"]["@attributes"]["value"]
        const s = c["ROW"]["SHTM_CD"]["@attributes"]["value"]
        if (s == 15 || s == 25) continue
        fetch("http://127.0.0.1/rank?id=" + id + "&y=" + y + "&s=" + s, {
          method: "GET",
        })
          .then((data22) => data22.text())
          .then((data2) => {
            let body = ""
            let xml2 = new DOMParser().parseFromString(data2, "text/xml")
            let cc = xmlToJson(xml2)["vector"]["data"]
            body += "<div>"
            body += y + "-" + convertSemester(s)
            body += " : " + c["ROW"]["AVRP"]["@attributes"]["value"]
            body +=
              " | 학과 " +
              (cc == undefined ? "00" : cc["ROW"]["ORGN4_PRNS"]["@attributes"]["value"]) +
              "명 중 <b>" +
              c["ROW"]["SUST_RANK"]["@attributes"]["value"] +
              "</b>등"
            body +=
              " | 전교 " +
              (cc == undefined ? "00" : cc["ROW"]["ORGN2_PRNS"]["@attributes"]["value"]) +
              "명 중 <b>" +
              (cc == undefined ? "00" : cc["ROW"]["TESCH_RANK"]["@attributes"]["value"]) +
              "</b>등"
            // body +=
            //   " : " +
            //   c["ROW"]["SUST_RANK"]["@attributes"]["value"] +
            //   " / " +
            //   (cc == undefined ? "00" : cc["ROW"]["ORGN4_PRNS"]["@attributes"]["value"]);
            body += "</div>"
            document.getElementById("info").innerHTML += body
          })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}
