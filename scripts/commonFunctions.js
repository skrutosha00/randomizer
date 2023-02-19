function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randElem(arr) {
  let rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

function randName(type) {
  let name = type + "_";

  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    name += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return name;
}

function findStyleTags(html) {
  let regExp = /(?<=<style([^>]*?)>).+?(?=(<\/style>))/gs;
  let matchList = html.match(regExp) ?? [];

  return matchList;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, ms);
  });
}

module.exports = { randElem, randInt, randName, findStyleTags, sleep };
