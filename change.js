let fs = require("fs");
let jimp = require("jimp");

let { sleep } = require("./scripts/commonFunctions.js");
let { clearScriptTags } = require("./scripts/ignoreScripts.js");
let { changeClasses } = require("./scripts/changeClasses.js");
let { changeId } = require("./scripts/changeId.js");
let { splitWords } = require("./scripts/splitWords.js");
let { changeTags } = require("./scripts/changeTags.js");
let { changeURL } = require("./scripts/changeURL.js");
let {
  imageHorisontalFlip,
  imageAddShade,
  imageAddBorders,
  imageMixPixels
} = require("./scripts/modifyImages.js");

async function fileChanger(
  url,
  dir,
  mainPage = "index.html",
  configJSON = randomConfig(),
  response
) {
  let html = fs.readFileSync(dir + mainPage, "utf-8");
  let config = JSON.parse(configJSON);
  let debug;

  let stylePaths;
  let imagePaths;

  if (config.debug == "true") {
    debug = true;
  }

  html = clearScriptTags(html, debug, response);

  if (
    config.changeTags == "true" ||
    config.changeClasses == "true" ||
    config.changeId == "true"
  ) {
    stylePaths = findStylePaths(html, dir, debug, response);
  }

  if (
    config.imageHorisontalFlip == "true" ||
    config.imageAddShade == "true" ||
    config.imageAddBorders == "true" ||
    config.imageMixPixels == "true"
  ) {
    imagePaths = await findImagePaths(html, dir, debug, response);
  }

  if (config.changeURL == "true") {
    html = changeURL(html, url, debug, response);
  }

  if (config.changeTags == "true") {
    html = changeTags(html, stylePaths, debug, response);
  }

  if (config.changeClasses == "true") {
    html = changeClasses(html, stylePaths, debug, response);
  }

  if (config.changeId == "true") {
    html = changeId(html, stylePaths, debug, response);
  }

  if (config.splitWords == "true") {
    html = splitWords(html, config.splitWordsNumber, debug, response);
  }

  if (config.imageHorisontalFlip == "true") {
    await imageHorisontalFlip(imagePaths, debug, response);
  }

  if (config.imageAddShade == "true") {
    await imageAddShade(imagePaths, config.imageAddShadeColor, debug, response);
  }

  if (config.imageAddBorders == "true") {
    await imageAddBorders(
      imagePaths,
      config.imageAddBordersColor,
      config.imageAddBordersWidth,
      debug,
      response
    );
  }

  if (config.imageMixPixels == "true") {
    await imageMixPixels(imagePaths, debug, response);
  }

  fs.writeFileSync(dir + mainPage, html);
}

function findStylePaths(html, dir, debug, res) {
  let matchList = [];
  (html.match(/<link[^>]+?>/gs) ?? []).forEach((linkTag) => {
    if (linkTag.match(/rel="stylesheet/gs)) {
      matchList.push(linkTag.match(/(?<=href=")[^"]+?(?=")/gs));
    }
  });

  if (debug && res) {
    res.write(`<br/><span>findStylePaths</span><br/>`);

    matchList.forEach((match) => {
      res.write(`<span>New style path "${match}"</span><br/>`);
    });
  }

  return matchList.map((match) => {
    return dir + match;
  });
}

async function findImagePaths(html, dir, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>findImagePaths</span><br/>`);
  }

  let regExp = /(?<=img[^>]+?src=")[^"]+?\.(png|jpeg|jpg)(?=")/gs;
  let matchList = html.match(regExp) ?? [];

  let pathList = matchList
    .map((match) => dir + match)
    .filter((match) => {
      return fs.existsSync(match);
    });

  let pathSet = [...new Set(pathList)];
  let checkedPathSet = [];

  for (let i = 0; i < pathSet.length; i++) {
    let path = pathSet[i];
    let support;

    try {
      await jimp.read(path);
      support = true;
    } catch (err) {
      support = false;
    }

    if (debug && res && support) {
      res.write(`<span>New image path "${path}"</span><br/>`);
    }

    if (support) {
      checkedPathSet.push(path);
    }

    await sleep(50);
  }

  return checkedPathSet;
}

function randomConfig() {
  return JSON.stringify({
    debug: "false",

    changeTags: Math.random() < 0.5 ? "true" : "false",
    changeClasses: Math.random() < 0.5 ? "true" : "false",
    changeId: Math.random() < 0.5 ? "true" : "false",
    changeURL: Math.random() < 0.5 ? "true" : "false",
    splitWords: Math.random() < 0.5 ? "true" : "false",

    imageHorisontalFlip: Math.random() < 0.5 ? "true" : "false",
    imageAddShade: Math.random() < 0.5 ? "true" : "false",
    imageAddBorders: Math.random() < 0.5 ? "true" : "false",
    imageMixPixels: Math.random() < 0.5 ? "true" : "false"
  });
}

module.exports = { fileChanger };
