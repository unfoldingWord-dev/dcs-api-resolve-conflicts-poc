var fs = require("fs");


var merged = [];

// modeled on http://st-on-it.blogspot.com/2011/05/how-to-read-user-input-with-nodejs.html
function query(text, callback) {
    'use strict';
    process.stdin.resume();
    process.stdout.write("Please clarify what was meant by: " + text);
    process.stdin.once("data", function (data) {
        callback(data.toString().trim());
    });
}

function printLinesWaitForQuestions(lines, someCallbackFunction) {
    'use strict';

    function continueProcessing() {
        if (lines.length) {
            printNextLine(lines.shift());
        } else {
            someCallbackFunction();
        }
    }

    function printNextLine(line) {

        if (/\?$/.test(line)) { // ask user for clarification
            query(line, function (response) {
                console.log(response);
                merged = merged.concat([response]);
                process.stdin.pause();
                continueProcessing();
            });
        } else {
            console.log(line);
            merged.push(line);
            continueProcessing();
        }
    }

    continueProcessing();
}

if (process.argv.length > 2) {
    var filename = process.argv[2];
    fs.readFile(filename, "ascii", function (err, data) {
        'use strict';

        if (err) {
            console.error("" + err);
            process.exit(1);
        }

        var lines = data.split("\n");
        printLinesWaitForQuestions(lines, function () {
            console.log('Were done now');
            console.log(merged.join("\n"));
        });
    });
} else {
    console.error("File name must be supplied on command line.");
    process.exit(1);
}
