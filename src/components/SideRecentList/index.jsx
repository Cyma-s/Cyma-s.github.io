import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const RelativeWrapper = styled.div`
  position: relative;
`

const Wrapper = styled.aside`
  position: absolute;
  left: 117%;
  top: 0px;
  width: 200px;
  height: auto;
  font-size: 16px;

  @media (max-width: 1300px) {
    display: none;
  }
`

const RecentTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`

const RecentList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.6;
`

const RecentItem = styled.li`
  margin-bottom: 14px;
  font-size: 13px;
`

const RecentLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.hoveredLinkText};
  }
`

const UpdatedDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText || "#bbb"};
  margin-top: 2px;
`

const SideRecentList = ({ posts }) => {
  return (
    <RelativeWrapper>
      <Wrapper>
        <RecentTitle>최근 수정된 글</RecentTitle>
        <RecentList>
          {posts
            .sort((a, b) => new Date(b.frontmatter.updated) - new Date(a.frontmatter.updated))
            .slice(0, 5)
            .map(post => (
              <RecentItem key={post.fields.slug}>
                <RecentLink to={post.fields.slug}>
                  {post.frontmatter.title || post.fields.slug}
                </RecentLink>
                <UpdatedDate>{post.frontmatter.updated}</UpdatedDate>
              </RecentItem>
            ))}
        </RecentList>
      </Wrapper>
    </RelativeWrapper>
  )
}

export default SideRecentList
