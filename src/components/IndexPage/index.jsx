import React from "react"
import styled from "styled-components"

import useOffsetTop from "hooks/useOffsetTop"

import StyledMarkdown from "../Article/Body/StyledMarkdown"
import PrismTheme from "../Article/Body/PrismTheme"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 112px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const IndexPage = ({ html }) => {
  const [ref] = useOffsetTop()

  return (
    <Wrapper>
      <PrismTheme />

      <StyledMarkdown
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
        ref={ref}
      />
    </Wrapper>
  )
}

export default IndexPage
