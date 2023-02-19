function clearScriptTags(html, debug, res) {
  if (debug && res) {
    let scriptCount = 0;

    html = html.replaceAll(/<script[^>]*?>.*?<\/script>/gs, () => {
      scriptCount++;
      return "";
    });

    res.write(`
    <br/><span>clearScriptTags</span><br/>
    <span>${scriptCount} scripts were removed</span><br/>
    `);
    return html;
  }

  return html.replaceAll(/<script[^>]*?>.*?<\/script>/gs, "");
}

module.exports = { clearScriptTags };
