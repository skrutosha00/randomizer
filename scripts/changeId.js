let fs = require("fs");

let { randName } = require("./commonFunctions.js");
let { findStyleTags } = require("./commonFunctions.js");

function changeId(html, stylePaths, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>changeId</span><br/>`);
  }

  let styleTags = findStyleTags(html);
  let idDict = getAllId(html);

  html = changeHTMLId(html, idDict);
  if (debug && res) {
    res.write(`<span>Ids were changed in HTML document</span><br/>`);
  }

  if (stylePaths) {
    stylePaths.forEach((path) => {
      if (!fs.existsSync(path)) {
        return;
      }

      let css = fs.readFileSync(path, "utf-8");
      css = changeCSSId(css, idDict);
      fs.writeFileSync(path, css);

      if (debug && res) {
        res.write(
          `<span>Style "${path}" was found => ids were changed</span><br/>`
        );
      }
    });
  }

  if (styleTags) {
    styleTags.forEach((css) => {
      let cssCopy = changeCSSId(css, idDict);
      html = html.replaceAll(css, cssCopy);
    });
  }

  return html;
}

function getAllId(html) {
  let idRegExp = /(?<=(id="))[^"]+?(?=("))/g;
  let idDict = {};

  (html.match(idRegExp) ?? []).forEach((match) => {
    idDict[match] = randName("id");
  });

  return idDict;
}

function changeHTMLId(html, idDict) {
  let idRegExp = /(?<=(id="))[^"]+?(?=("))/g;

  html = html.replaceAll(idRegExp, (idMatch) => {
    return idDict[idMatch] ?? idMatch;
  });

  return html;
}

function changeCSSId(css, idDict) {
  css = css.replaceAll(
    /(?<=[#])[\w\-]+?(?=[ \r\n\,:\[\.>~#\+\{])/g,
    (idMatch) => {
      return idDict[idMatch] ?? idMatch;
    }
  );

  return css;
}

module.exports = { changeId };
