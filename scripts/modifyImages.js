let fs = require("fs");
let jimp = require("jimp");

let { randElem, randInt, sleep } = require("./commonFunctions.js");

async function imageHorisontalFlip(imagePaths, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>imageHorisontalFlip</span><br/>`);
  }

  for (let i = 0; i < imagePaths.length; i++) {
    let path = imagePaths[i];
    let image = await jimp.read(path);

    image.flip(true, false);

    await image.writeAsync(path);

    if (debug && res) {
      res.write(`<span>Image "${path} is flipped"</span><br/>`);
    }

    await sleep(50);
  }
}

async function imageAddShade(imagePaths, color, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>imageAddShade</span><br/>`);
  }

  let colorOptions = ["#071672", "#FFF440", "#FF0000", "#00CC00", "#5E0DAC"];

  color = color ?? randElem(colorOptions);

  for (let i = 0; i < imagePaths.length; i++) {
    let path = imagePaths[i];

    let image = await jimp.read(path);
    image.opacity(0.8).background(jimp.cssColorToHex(color));
    await image.writeAsync(path);

    if (debug && res) {
      res.write(`<span>Image "${path} changed shade"</span><br/>`);
    }

    await sleep(50);
  }
}

async function imageAddBorders(
  imagePaths,
  borderColor,
  borderWidth,
  debug,
  res
) {
  if (debug && res) {
    res.write(`<br/><span>imageAddBorders</span><br/>`);
  }

  let colorOptions = ["#071672", "#FFF440", "#FF0000", "#00CC00", "#5E0DAC"];

  let color = borderColor ?? randElem(colorOptions);
  let width = borderWidth ?? randInt(20, 30);

  for (let i = 0; i < imagePaths.length; i++) {
    let path = imagePaths[i];
    let image = await jimp.read(path);

    let imageWidth = image.bitmap.width;
    let imageHeight = image.bitmap.height;

    image.scan(0, 0, imageWidth, imageHeight, (x, y) => {
      if (
        x < width ||
        y < width ||
        y > imageHeight - width ||
        x > imageWidth - width
      ) {
        image.setPixelColor(jimp.cssColorToHex(color), x, y);
      }
    });

    await image.writeAsync(path);

    if (debug && res) {
      res.write(`<span>Image "${path} obtained border"</span><br/>`);
    }

    await sleep(50);
  }
}

async function imageMixPixels(imagePaths, debug, res) {
  if (debug && res) {
    res.write(`<br/><span>imageMixPixels</span><br/>`);
  }

  for (let i = 0; i < imagePaths.length; i++) {
    let path = imagePaths[i];
    let image = await jimp.read(path);

    let imageWidth = image.bitmap.width;
    let imageHeight = image.bitmap.height;

    image.scan(0, 0, imageWidth, imageHeight, (x, y) => {
      let color =
        x + (y % 2)
          ? image.getPixelColor(x + 1, y)
          : image.getPixelColor(x - 1, y);

      image.setPixelColor(color, x, y);
    });

    await image.writeAsync(path);

    if (debug && res) {
      res.write(`<span>Image "${path} shuffled pixels"</span><br/>`);
    }

    await sleep(50);
  }
}

module.exports = {
  imageHorisontalFlip,
  imageAddShade,
  imageAddBorders,
  imageMixPixels
};
