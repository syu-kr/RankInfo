function convertSemester(data) {
  if (data == "10") return "1학기 정규"
  else if (data == "15") return "1학기 계절"
  else if (data == "20") return "2학기 정규"
  else if (data == "25") return "2학기 계절"
}
async function submit() {
  const id = document.getElementById("STUDENT_NUMBER").value
  document.getElementById("info").innerHTML = ""

  try {
    const data11 = await fetch("http://127.0.0.1/student?id=" + id, {
      method: "GET",
    })
    const data1 = await data11.text()
    let xml1 = new DOMParser().parseFromString(data1, "text/xml")
    let convert = xmlToJson(xml1)["vector"]["data"]

    let tableHTML = '<table border="1" cellpadding="5" cellspacing="0">'
    tableHTML += `
      <thead>
        <tr>
          <th>년도</th>
          <th>학기</th>
          <th>평균 학점</th>
          <th>학과 순위</th>
          <th>전교 순위</th>
        </tr>
      </thead>
      <tbody>`

    for (let c of convert) {
      const y = c["ROW"]["YY"]["@attributes"]["value"]
      const s = c["ROW"]["SHTM_CD"]["@attributes"]["value"]
      if (s == 15 || s == 25) continue

      const data22 = await fetch("http://127.0.0.1/rank?id=" + id + "&y=" + y + "&s=" + s, { method: "GET" })
      const data2 = await data22.text()
      let xml2 = new DOMParser().parseFromString(data2, "text/xml")
      let cc = xmlToJson(xml2)["vector"]["data"]

      let rowHTML = `<tr>`
      rowHTML += `<td>${y}년</td>`
      rowHTML += `<td>${convertSemester(s)}</td>`
      rowHTML += `<td><b>${c["ROW"]["AVRP"]["@attributes"]["value"]}</b> / 4.5</td>`
      rowHTML += `<td>${cc == undefined ? "00" : cc["ROW"]["ORGN4_PRNS"]["@attributes"]["value"]}명 중 <b>${
        c["ROW"]["SUST_RANK"]["@attributes"]["value"]
      }</b>등</td>`
      rowHTML += `<td>${cc == undefined ? "00" : cc["ROW"]["ORGN2_PRNS"]["@attributes"]["value"]}명 중 <b>${
        cc == undefined ? "00" : cc["ROW"]["TESCH_RANK"]["@attributes"]["value"]
      }</b>등</td>`
      rowHTML += `</tr>`

      tableHTML += rowHTML
    }

    tableHTML += `</tbody></table>`
    document.getElementById("info").innerHTML = tableHTML
  } catch (error) {
    console.log(error)
  }

  /* try {
    const data11 = await fetch("http://127.0.0.1/student?id=" + id, {
      method: "GET",
    })
    const data1 = await data11.text()
    let xml1 = new DOMParser().parseFromString(data1, "text/xml")
    let convert = xmlToJson(xml1)["vector"]["data"]

    for (let c of convert) {
      const y = c["ROW"]["YY"]["@attributes"]["value"]
      const s = c["ROW"]["SHTM_CD"]["@attributes"]["value"]
      if (s == 15 || s == 25) continue

      const data22 = await fetch("http://127.0.0.1/rank?id=" + id + "&y=" + y + "&s=" + s, { method: "GET" })
      const data2 = await data22.text()
      let body = ""
      let xml2 = new DOMParser().parseFromString(data2, "text/xml")
      let cc = xmlToJson(xml2)["vector"]["data"]

      body += "<div>"
      body += y + "년 " + convertSemester(s)
      body += " | " + c["ROW"]["AVRP"]["@attributes"]["value"] + " / 4.5"
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
      body += "</div>"
      document.getElementById("info").innerHTML += body
    }
  } catch (error) {
    console.log(error)
  } */
}
