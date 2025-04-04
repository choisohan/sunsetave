const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "/public/textures");
const outputFile = path.join(__dirname, "/public/textures.json");

function getAllImages(dir, rootDir = dir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllImages(fullPath, rootDir));
    } else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(file)) {
      results.push(`/textures/${relativePath.replace(/\\/g, "/")}`);
    }
  });

  return results;
}

const imageList = getAllImages(baseDir);

fs.writeFileSync(outputFile, JSON.stringify(imageList, null, 2));
console.log(`✅ Saved ${imageList.length} image paths to ${outputFile}`);