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
      if (data.slug) {
        const dir = process.env.SERVER_UPLOAD_FOLDER;
        const folder = path.join(dir, "/" + data.slug);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(folder);
        }
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        data.file.map((ele) => {
          const name = path.basename(ele.url);
          const writeLink = path.join(folder, name);
          const oldname = ele.url.match(/\.(jpe?g|png|webp|svg)$/)
            ? path.join(process.env.SERVER_UPLOAD_PUBLIC, name)
            : ele.url;
          fs.rename(oldname, writeLink, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    },
  },
};
