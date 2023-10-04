const visit = require("unist-util-visit");

module.exports = ({ markdownAST }, pluginOptions) => {
  visit(markdownAST, "text", node => {
    const regex = /\[(>|\[|<|\]|\!|-|\/|\?|\*|n|l|i|I|S|p|c|b|"|0|1|2|3|4|5|6|7|8|9)\]/g;
    const matches = node.value.match(regex);

    if (matches) {
      node.type = "html";
      node.value = node.value.replace(regex, match => {
        const icon = match.slice(1, -1); // 괄호 [] 내부의 값을 추출
        return `<span class="custom-checkbox" data-icon="${icon}"></span>`;
      });
    }
  });

  return markdownAST;
};
