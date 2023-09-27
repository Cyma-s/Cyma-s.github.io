const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
    visit(markdownAST, "image", node => {
        // originalPath는 원래의 상대 경로입니다.
        const originalPath = node.url;
    
        // 이미지를 특정 폴더에서 가져오도록 경로를 변환합니다.
        const newPath = `./attachments/${originalPath}`;
    
        // 변환한 경로를 노드에 설정합니다.
        node.url = newPath;
      });
};