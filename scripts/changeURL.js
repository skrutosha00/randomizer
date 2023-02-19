function changeURL(html, url, debug, res) {
  if (url[url.length - 1] != "/") {
    url += "/";
  }

  if (debug && res) {
    let urlCount = 0;

    html = html.replaceAll(/(?<=")https:\/\/[^"]+?(?=")/gs, () => {
      urlCount++;
      return url;
    });

    res.write(`
    <br/><span>changeURL</span><br/>
    <span>${urlCount} URLs were changed</span><br/>
    `);
    return html;
  }

  return html.replaceAll(/https:\/\/[^\/]+?\//gs, url);
}

module.exports = { changeURL };
