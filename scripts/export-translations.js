#!/usr/bin/nodejs
const https = require("https");
const fs = require('fs');
const process = require('process');
const path = require('path');

if (process.argv.length < 3) {
    console.error("Missing output file");
    process.exit(1);
}

const inputPath = path.join(path.dirname(process.argv[1]), "../src/assets/translations");

exportTsv(process.argv[2]);

/**
 * Export to TSV
 * @param {string} outputFile
 */
function exportTsv(outputFile) {
    const output = { header: ['key'] };
    for (const file of fs.readdirSync(inputPath)) {
        const lang = path.basename(file).replace(".json", "");
        output.header.push(lang);

        const messages = JSON.parse(fs.readFileSync(path.join(inputPath, file)).toString());
        for (const key in messages) {
            if (!output[key])
                output[key] = [key];
            output[key].push(formatTsvText(messages[key]));
        }
    }

    let fileContent = '';

    for (const item in output)
        fileContent = fileContent + output[item].join('\t') + "\r\n";

    fs.writeFileSync(outputFile, fileContent);
    console.log("Written " + outputFile);
}

/**
 * format value in TSV compliant format.
 * @param {string} value
 */
function formatTsvText(value) {
    return '"' + value.replace(/\r\n/g, "  ") + '"';
}