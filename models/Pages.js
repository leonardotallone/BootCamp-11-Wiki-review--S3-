const S = require("sequelize");
const db = require("../db");
const marked = require("marked");

class Pages extends S.Model {
  static findByTag = function (tag) {
    return Pages.findAll({
      where: {
        tags: {
          [S.Op.overlap]: [tag],
        },
      },
    });
  };
  findSimilar() {
    return Pages.findAll({
      where: {
        id: {
          [S.Op.not]: this.id,
        },
        tags: {
          [S.Op.overlap]: this.tags,
        },
      },
    });
  }
}

Pages.init(
  {
    title: {
      type: S.STRING,
      allowNull: false,
    },
    urlTitle: {
      type: S.STRING,
      allowNull: false,
    },
    content: {
      type: S.TEXT,
      allowNull: false,
    },
    route: {
      type: S.VIRTUAL,
      get() {
        return `/wiki/${this.getDataValue("urlTitle")}`;
      },
    },
    tags: {
      type: S.ARRAY(S.STRING),
      defaultValue: [],
      set: function (tags) {
        tags = tags || [];
        if (typeof tags === "string") {
          tags = tags.split(",").map(function (str) {
            return str.trim();
          });
        }
        this.setDataValue("tags", tags);
      },
    },
    renderedContent: {
      type: S.VIRTUAL,
      get() {
        return marked(this.getDataValue("content"));
      },
    },
  },
  { sequelize: db, modelName: "page" }
);

Pages.beforeValidate((page, options) => {
  if (page.title) {
    page.urlTitle = page.title.replace(/\s+/g, "_").replace(/\W/g, "");
    options.fields.push("urlTitle");
  }
});

module.exports = Pages;
