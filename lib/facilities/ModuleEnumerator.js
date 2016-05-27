'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = function ModuleEnumerator(rootPath, options) {

  var recursive = options ? options.recursive : false;
  var pattern   = options ? options.pattern : null;

  this.enumerate = function () {

    var files = [];

    var getFilesRecursively = function (folderPath) {

      fs.readdirSync(folderPath).forEach(filename => {

        var fullFilename = path.join(folderPath, filename);

        var isDirectory = fs.statSync(fullFilename).isDirectory();

        if (isDirectory) {

          if (!recursive) return;

          getFilesRecursively(fullFilename);

        } else {

          var moduleName = fullFilenameToModule(fullFilename);

          if (pattern && !moduleName.match(pattern)) return;

          files.push(moduleName);

        }

      });

    };

    getFilesRecursively(rootPath);

    return files;

  };

  var fullFilenameToModule = function (fullFilename) {

    return fullFilename
      .replace(rootPath, '')
      .split('\\')
      .filter(x => !!x)
      .join('/');

  };

};
