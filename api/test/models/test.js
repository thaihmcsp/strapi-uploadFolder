"use strict";
const fs = require("fs");
const path = require("path");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  /**
   * Triggered before user creation.
   */
  lifecycles: {
    async afterCreate(result, data) {
      const dir = process.env.SERVER_UPLOAD_FOLDER;
      const folder = path.join(dir, "/" + data.slug);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(folder);
      }
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }

      const listFile = fs.readdirSync(process.env.FRONTEND_UPLOAD_FOLDER);
      for (let i = 0; i < listFile.length; i++) {
        const link = path.join(process.env.FRONTEND_UPLOAD_FOLDER, listFile[i]);
        fs.readFile(link, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            const writeLink = path.join(folder, `/${listFile[i]}`);
            fs.writeFile(writeLink, data, function (err) {
              if (err) {
                console.log(err);
              } else {
                fs.unlink(link, function (err) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            });
          }
        });
      }
    },
  },
};
