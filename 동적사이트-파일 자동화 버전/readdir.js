const testFolder = './data';       // ./data === data  ./는 현제 디렉토리라는 뜻임.
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
    console.log(files);
});