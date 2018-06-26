const client = require("cheerio-httpcli");
const _ = require("underscore");
const moment = require("moment");
const fs = require("fs");
const nodemailer = require("nodemailer");

const p = client.fetch(
  "http://petit.lib.yamaguchi-u.ac.jp/G0000006y2j2/ListByFieldDetail.e?sort=r:dateofissued&fieldName=creator_transcription&id=%E3%82%B3%E3%83%B3%E3%83%89%E3%82%A6%2C+%E3%82%BF%E3%82%AB%E3%82%A4%E3%83%81"
);

const arg = process.argv[2];

const output = (path, data) => {
  fs.writeFile(path, data, (err) => {
    if (err) { throw err; }
  });
};

p.then(function(result) {
  const titles = [];
  result.$("dt").each(function() {
    // タイトル部分取得
    titles.push(
      result
        .$(this)
        .text()
        .replace(/(^\s+)|(\s+$)/g, "")
    );
  });

  let accesses = [];
  let downloads = [];
  let line = "";
  let body = "";
  let csv = ""
  let entries = [];
  let html =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>yunoca</title></head></body>';
  html += "<table><tr><th>title</th><th>accesses</th><th>downloads</th><tr>";

  result.$("dd").each(function() {
    // アクセス情報取得
    const dd = result.$(this).text();
    const start1 = dd.lastIndexOf("アクセス件数 ： ");
    const start2 = dd.lastIndexOf("ダウンロード件数 ： ");
    const end = dd.lastIndexOf(" 件");
    if (start1 != -1 && start2 != -1) {
      accesses.push(dd.substring(start1 + 9, start2 - 4));
      downloads.push(dd.substring(start2 + 11, end));
    }
  });
  _.chain(_.zip(titles, accesses, downloads)).each(function(elm) {
    line = elm[0] + "," + elm[1] + "," + elm[2] + "\n";
    csv += line + ""
    const entry = {
      title: elm[0],
      accesses: elm[1],
      dounloads: elm[2]
    };
    entries.push(entry);
    body += line + "\n";
    html +=
      "<tr><td>" +
      elm[0] +
      "</td><td>" +
      elm[1] +
      "</td><td>" +
      elm[2] +
      "</td></tr>";
  });
  html += "</table></body></html>";

  const fileName = "yunoca-" + moment().format("YYYYMMDDHHmmss");
  if (arg == "csv") {
    output(`work/${fileName}.csv`, csv);
  }
  if (arg == "json") {
    output(`work/${fileName}.json`, JSON.stringify(entries, null, 2));
  }
  if (arg == "html") {
    const pretty = require("pretty");
    output(`work/${fileName}.html`, pretty(html));
  }
});

p.catch(function(err) {
  console.log(err);
});

p.finally(function() {
  console.log("finished.");
});
