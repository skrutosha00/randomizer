let { randInt } = require("../scripts/commonFunctions.js");

function splitWords(html, symbolAmount = "20", debug, res) {
  if (debug && res) {
    res.write(`<br/><span>splitWords</span><br/>`);
  }

  symbolAmount = Number(symbolAmount);

  let textRegExp = new RegExp(
    "(?<=(<).*?>)[^<>]+?(?=</(section|p|article|div))",
    "gs"
  );

  let textMatches = html.matchAll(textRegExp);

  for (let match of textMatches) {
    let pureText = match[0].replaceAll(/(\n|\r| {2,})/g, "");

    if (pureText.length < symbolAmount) {
      continue;
    }

    html = html.replace(
      match[0],
      pureText.slice(0, Math.ceil(pureText.length / 2)) +
        `<span style="display:none;">rand_${randInt(1, 9999)}</span>` +
        pureText.slice(Math.ceil(pureText.length / 2))
    );
  }

  if (debug && res) {
    res.write(`<span>Empty spans were added</span><br/>`);
  }

  return html;
}

module.exports = { splitWords };
