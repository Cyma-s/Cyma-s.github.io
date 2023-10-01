import React, { useState, useEffect } from "react"
import _ from "lodash"
import styled from "styled-components"
import SEO from "components/SEO"
import filter from "lodash/filter"

import { graphql, navigate } from "gatsby"

import queryString from "query-string"

import Layout from "components/Layout"
import Title from "components/Title"
import TagList from "components/TagList"
import PostList from "components/PostList"
import VerticleSpace from "components/VerticalSpace"

import { title, description, siteUrl } from "../../blog-config"

const TagListWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const TagTitle = styled.p`
  color: ${props => props.theme.colors.secondAccentText};
  display: inline;
`

const TagPostCount = styled.p`
  color: ${props => props.theme.colors.secondAccentText};
  display: inline;
`

const TagsPage = ({ data }) => {
  const tags = _.sortBy(data.allMarkdownRemark.group, ["totalCount"]).reverse()
  const posts = data.allMarkdownRemark.nodes

  const [selected, setSelected] = useState()
  const [filteredPosts, setFilteredPosts] = useState([])

  let query = null
  if (typeof document !== "undefined") {
    query = document.location.search
  }

  useEffect(() => {
    if (!selected) {
      setFilteredPosts(posts)
      return
    }

    const filtered = filter(posts, post => post.frontmatter.tags && post.frontmatter.tags.indexOf(selected) !== -1)
    setFilteredPosts(filtered)
  }, [selected, posts])

  useEffect(() => {
    const q = decodeURIComponent(queryString.parse(query)["q"] || "")
    setSelected(q)
  }, [query])

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />

      <TagListWrapper>
        {selected ? (
          <Title size="sm">
            <TagTitle>#{selected}</TagTitle> 에 <TagPostCount>{filteredPosts.length}</TagPostCount>개의 글이 존재합니다.
          </Title>
        ) : (
          <Title size="sm">
            There are {tags.length} tag{tags.length > 1 && "s"}.
          </Title>
        )}

        <TagList
          count
          tagList={tags}
          selected={selected}
          onClick={tag => {
            console.log(tag, selected)
            if (tag === selected) {
              navigate("/tags")
              alert("zz")
            } else {
              setSelected(tag)
              navigate(`/tags?q=${tag.fieldValue}`)
            }
          }}
        />
      </TagListWrapper>

      <VerticleSpace size={32} />

      <PostList postList={filteredPosts} />
    </Layout>
  )
}

export default TagsPage

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
          tags
        }
      }
    }
  }
`
