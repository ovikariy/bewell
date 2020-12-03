#!/usr/bin/nodejs
const https = require("https");
const fs = require('fs');
const process = require('process');
const path = require('path');

if (process.argv.length < 3) {
    console.error("Missing input file");
    process.exit(1);
}

const outputPath = path.join(path.dirname(process.argv[1]), "../src/assets/translations");

updateFromSourceAsync(process.argv[2], outputPath)
    .catch(e => console.error(e));

/**
 * @param {string} inputPath
 * @param {string} outputPath
 */
async function updateFromSourceAsync(inputPath, outputPath) {
    const tsv = inputPath.startsWith("http") ?
        await getAsync(inputPath) :
        fs.readFileSync(inputPath).toString();
    updateFromTsv(tsv, outputPath);
}

/**
 * Update from TSV content
 * @param {string} tsv
 * @param {string} outputPath
 */
function updateFromTsv(tsv, outputPath) {
    const lines = tsv.split("\r\n");
    const languages = lines.shift().split('\t');
    languages.shift();
    const maps = languages.map(_ => ({}));
    for (const line of lines) {
        if (!line) continue;
        const values = line.split('\t');
        const key = values[0];
        for (const index in languages) {
            const translation = values[parseInt(index) + 1];
            maps[index][key] = normalizeTranslationText(translation);
        }
    }
    for (const index in languages) {
        const language = languages[index];
        const map = maps[index];
        const path = outputPath + "/" + language + ".json";
        fs.writeFileSync(path, JSON.stringify(map, null, '  '));
    }
    const summary = { languages, messagesCount: Object.keys(maps[0]).length };
    console.log("SUMMARY: ", summary);
}

/**
 * Normalize translation text
 * - replace double spaces with CRLF
 * @param {string} value
 */
function normalizeTranslationText(value) {
    if (value.startsWith('"') && value.endsWith('"'))
        value = value.substring(1, value.length - 1);
    return value.replace(/\s\s/g, "\r\n");
}

/**
 * Get url
 * @param {string} url
 */
async function getAsync(url) {
    return new Promise((resolve, reject) => get(url, resolve, reject));
}

/**
 * Get with redirect
 * @param {string} url
 * @param {callback} resolve
 * @param {callback} reject
 */
function get(url, resolve, reject) {
    https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307)
            return get(res.headers.location, resolve, reject);

        const body = [];

        res.on("data", (chunk) => {
            body.push(chunk);
        });

        res.on("end", () => {
            try {
                // remove JSON.parse(...) for plain data
                resolve(Buffer.concat(body).toString());
            }
            catch (err) {
                reject(err);
            }
        });
    });
}
