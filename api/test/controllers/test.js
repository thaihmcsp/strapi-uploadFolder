const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const fs = require("fs");

module.exports = {
  async find() {
    return "strapi";
  },
  async create() {
    console.log(
      1000000000000000000000000000000000000000000000000000000000000000000
    );
    return "strapi";
  },
};
