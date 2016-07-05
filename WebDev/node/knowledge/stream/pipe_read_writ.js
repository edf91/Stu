var fs = require('fs');

fs.createReadStream('./pipeTest.txt').pipe(fs.createWriteStream('pipeTest2.txt'));