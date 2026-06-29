const fs = require('fs');
const path = require('path');

const dir = 'd:\\Project\\Antigravity\\Trial\\DharanixStudio';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(function(file) {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('build')) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;
        
        content = content.replace(/Dharanix/g, 'Dharanix');
        content = content.replace(/Dharanix/g, 'Dharanix');
        content = content.replace(/dharanix/g, 'dharanix');
        content = content.replace(/DHARANIX/g, 'DHARANIX');

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        // Ignore unreadable/binary files
    }
});
console.log("Done");
