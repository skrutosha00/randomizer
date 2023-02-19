let fs = require("fs");

let { randElem } = require("../scripts/commonFunctions.js");
let { findStyleTags } = require("./commonFunctions.js");

function changeTags(html, stylePaths, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>changeTags</span><br/>`);
  }

  let styleTags = findStyleTags(html);

  let substitutes = {
    header: ["section", "div"],
    main: ["section", "div"],
    footer: ["section", "div"],

    section: ["div"],
    article: ["section", "div"],
    p: ["article", "section", "div"],

    h1: ["h2", "h3", "h4", "h5", "h6"],
    h2: ["h1", "h3", "h4", "h5", "h6"],
    h3: ["h1", "h2", "h4", "h5", "h6"],
    h4: ["h1", "h2", "h3", "h5", "h6"],
    h5: ["h1", "h2", "h3", "h4", "h6"],
    h6: ["h1", "h2", "h3", "h4", "h5"]
  };

  let setSubstitutes = {};
  Object.keys(substitutes).forEach((tag) => {
    setSubstitutes[tag] = randElem(substitutes[tag]);
  });

  html = changeHTMLTags(html, setSubstitutes);
  if (debug && res) {
    res.write(`<span>Tags were changed in HTML document</span><br/>`);
  }

  if (stylePaths) {
    stylePaths.forEach((path) => {
      if (!fs.existsSync(path)) {
        return;
      }

      let css = fs.readFileSync(path, "utf-8");
      css = changeCSSTags(css, setSubstitutes);
      fs.writeFileSync(path, css);

      if (debug && res) {
        res.write(
          `<span>Style "${path}" was found => tags were changed</span><br/>`
        );
      }
    });
  }

  if (styleTags) {
    styleTags.forEach((css) => {
      let cssCopy = changeCSSTags(css, setSubstitutes);
      html = html.replaceAll(css, cssCopy);
    });
  }

  return html;
}

function changeHTMLTags(html, setSubstitutes) {
  let regExpStart = new RegExp(`(?<=<(\\s)*?)\\w+?(?=[\\s>])`, "gs");
  let regExpEnd = new RegExp(`(?<=</)\\w+?(?=(\\s)*?>)`, "gs");

  html = html
    .replaceAll(regExpStart, (tagMatch) => {
      return setSubstitutes[tagMatch] ?? tagMatch;
    })
    .replaceAll(regExpEnd, (tagMatch) => {
      return setSubstitutes[tagMatch] ?? tagMatch;
    });

  return html;
}

function changeCSSTags(css, setSubstitutes) {
  let regExp = new RegExp(
    `(^[\\w\-]+?(?=[,\.: \r\n>~#])|((?<=[, \r\n>~])[\\w\-]+?)(?=[,\.: \r\n>~#]))`,
    "gs"
  );

  css = css.replaceAll(regExp, (tagMatch) => {
    return setSubstitutes[tagMatch] ?? tagMatch;
  });

  return css;
}

module.exports = { changeTags };
