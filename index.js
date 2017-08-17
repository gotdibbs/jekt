#!/usr/bin/env node
const opn = require('opn');
const fs = require('fs');
const path = require('path');
const projectName = process.argv && process.argv.length > 2 ? process.argv[2] : null;
const homedir = process.env.HOME || process.env.USERPROFILE;
const filepath = path.join(homedir, 'jekt.json');

// Open VS Code to edit config when required
function editConfig() {
    console.log('No projects found, invalid project specified, or no config file exists. Launching VS Code...');
    opn('vscode://file/' + filepath);
}

// If no argument specified or the config file doesn't exist...
if (!projectName || !fs.existsSync(filepath)) {
    return editConfig();
}

const projects = require(filepath);

// If no projects are defined, or specified project doesn't exist...
if (!projects || !projects[projectName]) {
    return editConfig();
}

var promises = [];

// Start up all the requested resources...
projects[projectName].forEach(function (app) {
    if (app.thing === 'D365:PluginRegistration') {
        app.thing = path.resolve('./D365/PluginRegistration/PluginRegistration.exe');
    }

    console.log(app.thing + " : " + JSON.stringify(app.params));
    promises.push(opn(app.thing, app.params));
});

Promise.all(promises).then(function () {
    // Close ourself after opening all the things
    process.exit();
});