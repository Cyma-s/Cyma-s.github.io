import React from "react"
import _ from "lodash"
import { graphql } from "gatsby"

import IndexLayout from "components/IndexLayout"
import IndexPage from "components/IndexPage"
import SEO from "components/SEO"
import SideTagList from "components/SideTagList"
import VerticalSpace from "components/VerticalSpace"

import { title, description, siteUrl } from "../../blog-config"
import SidePostList from "components/SidePostList"

function isIndex(element)  {
  if(element.frontmatter.title === 'readme')  {
    return true;
  }
}

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const tags = _.sortBy(data.allMarkdownRemark.group, ["totalCount"]).reverse()

  const indexHtml = data.markdownRemark.html

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
    <IndexLayout>
      <SEO title={title} description={description} url={siteUrl} />
      <VerticalSpace size={48} />
      <SideTagList tags={tags} postCount={posts.length} />
      <SidePostList posts={posts} recentPostCount={20}/>
      <IndexPage html={indexHtml}></IndexPage>
    </IndexLayout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query BlogIndex {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: {title: {eq: "readme"}}) {
      html
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt
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
