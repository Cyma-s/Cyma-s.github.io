const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "listItem", node => {
    const paragraphNode = node.children.find(child => child.type === "paragraph");
    if (!paragraphNode) return;
    const textNode = paragraphNode.children.find(child => child.type === "text");
    if (!textNode) return;

    const regex = /\[(>|\[|<|\]|\!|-|\/|\?|\*|n|l|i|I|S|p|c|b|"|0|1|2|3|4|5|6|7|8|9)\]/;
    const matches = textNode.value.match(regex);

    if (matches) {
      console.log(textNode.value);
      textNode.type = "html";
      textNode.value = textNode.value.replace(regex, match => {
        const icon = match.slice(1, -1); // 괄호 [] 내부의 값을 추출
        return `<span class="custom-checkbox" data-icon="${icon}"></span>`;
      });
    }
  });

  return markdownAST;
};
