import React from "react"
import SEO from "components/SEO"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import Article from "components/Article"

import { siteUrl } from "../../blog-config"

const Post = ({ data }) => {
  const post = data.markdownRemark
  const { previous, next, seriesList } = data

  const { title, date, updated, tags, series } = post.frontmatter
  const { excerpt } = post
  const { slug } = post.fields

  let filteredSeries = []
  if (series !== null) {
    filteredSeries = seriesList.edges.map(seriesPost => {
      if (seriesPost.node.id === post.id) {
        return {
          ...seriesPost.node,
          currentPost: true,
        }
      } else {
        return {
          ...seriesPost.node,
          currentPost: false,
        }
      }
    })
  }

  return (
    <Layout>
      <SEO title={title} description={excerpt} url={`${siteUrl}${slug}`} />
      <Article>
        <Article.Header
          title={title}
          date={date}
          updated={updated}
          tags={tags}
        />
        {filteredSeries.length > 0 && (
          <Article.Series header={series} series={filteredSeries} />
        )}
        <Article.Body html={post.html} />
        <Article.Footer previous={previous} next={next} title={title} />
      </Article>
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $series: String
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200, truncate: true)
      html
      frontmatter {
        title
        date(formatString: "YYYY년 MM월 DD일 HH:MM")
        updated(formatString: "YYYY년 MM월 DD일 HH:MM")
        tags
        series
      }
      fields {
        slug
      }
    }
    seriesList: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___date] }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
