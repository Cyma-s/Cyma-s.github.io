import React from "react"
import styled from "styled-components"

import { title } from "../../../../blog-config"

const IndexFooterWrapper = styled.footer`
  height: auto;
  margin: 0 auto;
  min-height: 100%;
  text-align: center;
  font-size: 11pt;
  font-weight: lighter;
  color: ${props => props.theme.colors.secondaryText};

  & > a {
    color: ${props => props.theme.colors.text};
  }
`

const IndexFooter = () => {
  return (
    <IndexFooterWrapper>
      © {title}, Built with Gatsby and{" "}
      <a href="https://github.com/devHudi/gatsby-starter-hoodie" target="blank">
        gatsby-starter-hoodie
      </a>{" "}
      theme.
    </IndexFooterWrapper>
  )
}

export default IndexFooter
