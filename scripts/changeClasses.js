let fs = require("fs");

let { randName } = require("./commonFunctions.js");
let { findStyleTags } = require("./commonFunctions.js");

function changeClasses(html, stylePaths, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>changeClasses</span><br/>`);
  }

  let styleTags = findStyleTags(html);
  let classDict = getAllClasses(html);

  html = changeHTMLClasses(html, classDict);
  if (debug && res) {
    res.write(`<span>Classes were changed in HTML document</span><br/>`);
  }

  if (stylePaths) {
    stylePaths.forEach((path) => {
      if (!fs.existsSync(path)) {
        return;
      }

      let css = fs.readFileSync(path, "utf-8");
      css = changeCSSClasses(css, classDict);
      fs.writeFileSync(path, css);

      if (debug && res) {
        res.write(
          `<span>Style "${path}" was found => classes were changed</span><br/>`
        );
      }
    });
  }

  if (styleTags) {
    styleTags.forEach((css) => {
      let cssCopy = changeCSSClasses(css, classDict);
      html = html.replaceAll(css, cssCopy);
    });
  }

  return html;
}

function getAllClasses(html) {
  let classMatches = html.match(/(?<=(class="))[^"]+?(?=")/g) ?? [];
  let classDict = {};

  classMatches.forEach((match) => {
    match
      .trim()
      .split(" ")
      .forEach((className) => {
        if (
          className.length &&
          !className.match(/\s/g) &&
          !classDict[className]
        ) {
          classDict[className] = randName("class");
        }
      });
  });

  return classDict;
}

function changeHTMLClasses(html, classDict) {
  html = html.replaceAll(/(?<=(class="))[^"]+?(?=")/g, (classMatch) => {
    classMatch = classMatch
      .trim()
      .split(" ")
      .map((className) => {
        return classDict[className] ?? className;
      });

    return classMatch.join(" ");
  });

  return html;
}

function changeCSSClasses(css, classDict) {
  css = css.replaceAll(
    /(?<=[\.])[\w\-]+?(?=[,:\[\s\.>~#\+\{\(])/g,
    (classMatch) => {
      return classDict[classMatch] ?? classMatch;
    }
  );

  return css;
}

module.exports = { changeClasses };
