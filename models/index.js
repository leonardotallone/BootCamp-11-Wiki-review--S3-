const Pages = require("./Pages");
const Users = require("./Users");

Pages.belongsTo(Users, { as: "author" }); // Agrega el ID del autor en la tabla Pages

module.exports = { Users, Pages };
