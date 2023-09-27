import React, { useState, useCallback } from "react"
import styled from "styled-components"
import SEO from "components/SEO"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import PostList from "components/PostList"
import TextField from "components/TextField"
import Title from "components/Title"
import VerticalSpace from "components/VerticalSpace"

import { title, description, siteUrl } from "../../blog-config"

const SearchWrapper = styled.div`
  margin-top: 20px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const PostsCount = styled.p`
    margin-bottom: 25.6px;
    line-height: 1.2;
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.secondAccentText};

    @media (max-width: 768px) {
        padding: 0 15px;
    }
`

const Search = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  const [query, setQuery] = useState("")

  const filteredPosts = useCallback(
    posts.filter(post => {
      const { frontmatter, rawMarkdownBody } = post
      const { title } = frontmatter
      const lowerQuery = query.toLocaleLowerCase()

      if (rawMarkdownBody.toLocaleLowerCase().includes(lowerQuery)) return true

      return title.toLocaleLowerCase().includes(lowerQuery)
    }),
    [query]
  )

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />
      <SearchWrapper>
        <PostsCount size="sm">
          {filteredPosts.length} 개의 글이 있습니다.
        </PostsCount>
        <TextField
          onChange={e => setQuery(e.target.value)}
          placeholder="Search"
        />
      </SearchWrapper>
      <VerticalSpace size={70} />
      <PostList postList={filteredPosts} />
    </Layout>
  )
}

export default Search

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY년 MM월 DD일 HH:MM")
          title
          tags
        }
        rawMarkdownBody
      }
    }
  }
`
