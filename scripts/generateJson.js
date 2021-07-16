const fs = require("fs");
const path = require("path");
const glob = require("glob");
const beautify = require("json-beautify");

const pattern = "src/views/**/index.js";
const stringsFileName = "strings.json";
const iconsFileName = "icons.json";
const outputFile = "plugin.json";

const saveFile = (output, content) => {
  fs.writeFileSync(output, beautify(content, null, 4, 100));
}

const getAssets = (pathname) => {
  const contents = fs.readFileSync(pathname, "utf-8")
  return JSON.parse(contents);
}

const getBundleName = (pathname) => {
  const bundleName = path.basename(path.dirname(pathname));
  return `${bundleName}.js`
}

const webViews = glob.sync(pattern)
  .reduce((acc, curr) => {
  const webView = {
    src: getBundleName(curr),
    target: '',
    meta: {
      strings: getAssets(`${path.dirname(curr)}/${stringsFileName}`),
      icons: getAssets(`${path.dirname(curr)}/${iconsFileName}`)
    }
  };

 return [...acc, webView]
  }, []);

const plugin = {
  webView: webViews
}

saveFile(outputFile, plugin);