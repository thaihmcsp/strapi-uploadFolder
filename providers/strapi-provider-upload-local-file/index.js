"use strict";

/**
 * Module dependencies
 */

// Public node modules.
const fs = require("fs");
const path = require("path");
/* eslint-disable no-unused-vars */
module.exports = {
  provider: "strapi-provider-upload-local-path",
  name: "Local server",
  init: (config) => {
    return {
      upload: (file) => {
        const fileName = file.name.split(".")[0];
        return new Promise((resolve, reject) => {
          // write file in configured folder
          fs.writeFile(
            path.join(config.path, `/${fileName}${file.ext}`),
            file.buffer,
            (err) => {
              if (err) {
                return reject(err);
              }
              if (file.name.match(/\.(jpe?g|png|webp|svg)$/)) {
                file.url = path.join("/uploads", `/${fileName}${file.ext}`);
              } else {
                file.url = path.join(config.path, `/${fileName}${file.ext}`);
              }

              resolve();
            }
          );
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          const fileName = file.name.split(".")[0];
          console.log(41, file);
          const filePath = path.join(config.path, `/${fileName}${file.ext}`);
          console.log(43, filePath);
          if (!fs.existsSync(filePath)) {
            return resolve("File doesn't exist");
          }

          // remove file from public/assets folder
          fs.unlink(filePath, (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      },
    };
  },
};
