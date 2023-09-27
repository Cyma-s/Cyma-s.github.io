const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
    visit(markdownAST, "link", (node) => {
        if (node.wikiLink) {
          // node에 data 속성을 추가하거나 변경합니다.
          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};
          node.data.hProperties["data-wiki-link"] = "true";
        }
      });
};
