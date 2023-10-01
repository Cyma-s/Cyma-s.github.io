import React from "react"
import styled from "styled-components"

import { author } from "../../../../blog-config"

import Divider from "components/Divider"
import TagList from "components/TagList"
import Bio from "components/Bio"

const Wrapper = styled.div`
  margin-top: 32px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const ArticleTitle = styled.h1`
  margin-bottom: 25.6px;
  line-height: 1.2;
  font-size: 44.8px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Information = styled.div`
  margin-bottom: 32px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Author = styled.span`
  padding-bottom: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Date = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.secondaryText};
`

const Property = styled.strong`
  font-weight: 500;
  color: ${props => props.theme.colors.flipAccentText}
`

const Header = ({ title, date, tags, minToRead, updated }) => {
  return (
    <Wrapper>
      <ArticleTitle> {title} </ArticleTitle>
      <Information>
        <Bio/>
        <div>
          <Property>Created Date </Property><Date>· {date} </Date>
        </div>
        <div>
          <Property>Read Time </Property><Date>· {minToRead} min read </Date>
        </div>
        <div>
          <Property>Last Update </Property><Date>· {updated} </Date>
        </div>
      </Information>
      {tags && <TagList tagList={tags} />}
      <Divider mt="0" />
    </Wrapper>
  )
}

export default Header
