const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "text", (node, index, parent) => {
    const { value } = node;

    // 텍스트 노드에서 ![[상대 링크]] 패턴을 찾습니다.
    const matches = Array.from(value.matchAll(/!\[\[([^\]]+)\]\]/g));

    if (matches.length > 0) {
      // 변경할 노드들을 저장할 배열
      const newNodes = [];

      // 마지막 매치의 끝 위치
      let lastEnd = 0;

      matches.forEach((match) => {
        const [wholeMatch, link] = match;
        const start = match.index;
        const end = start + wholeMatch.length;

        // 매치 이전의 텍스트를 추가
        if (start > lastEnd) {
          newNodes.push({
            type: "text",
            value: value.slice(lastEnd, start),
          });
        }

        // 매치를 이미지 노드로 변환
        newNodes.push({
          type: "image",
          url: `./attachments/${link}`,
          alt: link,
        });

        lastEnd = end;
      });

      // 마지막 매치 이후의 텍스트를 추가
      if (lastEnd < value.length) {
        newNodes.push({
          type: "text",
          value: value.slice(lastEnd),
        });
      }

      // 부모 노드의 children 배열을 수정
      parent.children.splice(index, 1, ...newNodes);
    }
  });
};
