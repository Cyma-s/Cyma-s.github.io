import React from "react"
import _ from "lodash"
import { graphql } from "gatsby"
import styled from "styled-components"

import Layout from "components/Layout"
import SEO from "components/SEO"
import PostList from "components/PostList"
import VerticalSpace from "components/VerticalSpace"

import { title, description, siteUrl } from "../../blog-config"

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


const AllPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to &quot;content/blog&quot; (or
        the directory you specified for the &quot;gatsby-source-filesystem&quot;
        plugin in gatsby-config.js).
      </p>
    )
  }

  return (
    <Layout>
        <SEO title={title} description={description} url={siteUrl} />
        <VerticalSpace size={48} />
        <PostsCount>총 {posts.length}개의 글이 있습니다</PostsCount>
        <PostList postList={posts} />
    </Layout>
  )
}

export default AllPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY년 MM월 DD일 HH:MM")
          updated(formatString: "YYYY년 MM월 DD일 HH:MM")
          title
          description
          tags
        }
      }
    }
  }
`
