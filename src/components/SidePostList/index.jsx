import React, { useState, useEffect } from "react"
import _ from "lodash"
import styled from "styled-components"
import {Link} from "gatsby"
import Divider from "components/Divider"

const RelativeWrapper = styled.div`
  position: relative;
`

const Wrapper = styled.aside`
  position: absolute;
  right: 117%;
  top: 0px;
  width: 200px;
  height: 100px;
  font-size: 16px;

  @media (max-width: 1300px) {
    display: none;
  }
`

const Date = styled.p`
  margin-bottom: 5px;
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText};
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none
`

const Title = styled.div`
  margin-bottom: 25px;
  font-weight: bold;
  color: ${props => props.theme.colors.flipAccentText};
`


const PostTitle = styled.div`
    margin-bottom: 30px;
    color: ${props => props.theme.colors.tertiaryText};
    transition: color 0.3s;
`

const TitleLink = styled(Link)`
    padding: 1.6px 0;
    color: ${props => props.theme.colors.text};
    cursor: pointer;
    text-decoration-line: none;
    line-height: 8px;
    
    &:hover {
    color: ${props => props.theme.colors.hoveredLinkText};
    }
`

const PostDiscription = styled.p`
    margin-bottom: 16px;
    font-size: 14.4px;
    color: ${props => props.theme.colors.secondaryText};
`

const checkIsScrollAtBottom = () => {
  return (
    document.documentElement.scrollHeight -
      document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 100
  )
}

const SidePostList = ({ posts, recentPostCount }) => {
    return (
        <RelativeWrapper>
            <Wrapper>
            <Title>POSTS LIST</Title>
            {posts.slice(0, recentPostCount).map((post, i) => {
                const { title, discription, updated } = post.frontmatter
                const { slug } = post.fields
                return (
                    <>
                    <PostTitle>
                        <Date>{updated}</Date><TitleLink to={slug}>{title}</TitleLink>
                    </PostTitle>
                    <PostDiscription>{discription}</PostDiscription>
                        {recentPostCount - 1 !== i && posts.length - 1 !== i && (
                            <Divider mt="10px" mb="32px" />
                        )}
                    </>       
                )
            })}
            
            </Wrapper>
        </RelativeWrapper>
  )
}

export default SidePostList
