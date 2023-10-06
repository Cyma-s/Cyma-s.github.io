import React, { useState, useEffect } from "react"
import styled from "styled-components"
import ReactHtmlParser from 'react-html-parser';
import CustomCheckbox from "components/CustomCheckbox";

import useOffsetTop from "hooks/useOffsetTop"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"
import PrismTheme from "./PrismTheme"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 112px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const Body = ({ html }) => {
  const [toc, setToc] = useState([])

  const [ref, offsetTop] = useOffsetTop()

  useEffect(() => {
    setToc(
      Array.from(
        document.querySelectorAll("#article-body > h2, #article-body > h3")
      )
    )
  }, [])

  const transformNode = (node) => {
    if (node.type === 'tag' && node.name === 'span' && node.attribs && node.attribs['data-icon']) {
      return <CustomCheckbox iconKey={node.attribs['data-icon']} />;
    }
    // 아무것도 반환하지 않으면 원래의 노드가 그대로 유지됩니다.
  };

  const reactComponents = ReactHtmlParser(html, { transform: transformNode });

  return (
    <Wrapper>
      <Toc items={toc} articleOffset={offsetTop} />

      <PrismTheme />

      <StyledMarkdown
        id="article-body"
        itemProp="articleBody"
        ref={ref}
      >
       {reactComponents} 
      </StyledMarkdown>
    </Wrapper>
  )
}

export default Body
