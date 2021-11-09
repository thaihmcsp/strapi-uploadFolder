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
        data.files.map((ele) => {
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

    async beforeUpdate(data, model) {
      let { _id } = data;
      let existing = await strapi.query("project").findOne({ _id });
      if (existing) {
        const oldSlug = existing.slug;
        const dir = process.env.SERVER_UPLOAD_FOLDER;
        const folder = path.join(dir, "/" + model.slug);
        if (oldSlug === model.slug) {
          model.files.map((ele) => {
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
        } else {
          const oldFolder = path.join(dir, oldSlug);
          const newFolder = path.join(dir, model.slug);
          fs.renameSync(oldFolder, newFolder);
          model.files.map((ele) => {
            const name = path.basename(ele.url);
            const writeLink = path.join(folder, name);
            const oldname = ele.url.match(/\.(jpe?g|png|webp|svg)$/)
              ? path.join(process.env.SERVER_UPLOAD_PUBLIC, name)
              : ele.url;
            if (fs.existsSync(oldname)) {
              fs.rename(oldname, writeLink, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
        }
      }
    },

    async afterDelete(result, params) {
      const folderSlug = path.join(
        process.env.SERVER_UPLOAD_FOLDER,
        result.slug
      );
      if (fs.existsSync(folderSlug)) {
        var rmdir = function (dir) {
          var list = fs.readdirSync(dir);
          for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);

            if (filename == "." || filename == "..") {
              // pass these files
            } else if (stat.isDirectory()) {
              // rmdir recursively
              rmdir(filename);
            } else {
              // rm fiilename
              fs.unlinkSync(filename);
            }
          }
          fs.rmdirSync(dir);
        };

        rmdir(folderSlug);
      }
    },
  },
};
