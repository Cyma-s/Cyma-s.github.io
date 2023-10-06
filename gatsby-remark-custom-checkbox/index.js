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
      const icon = matches[1];
      node.data = {
        ...node.data,
        iconKey: icon
      };
      // 아이콘 정보를 저장한 후, 원래의 [icon] 텍스트를 제거합니다.
      textNode.value = textNode.value.replace(regex, "");
    }
  });

  return markdownAST;
};
