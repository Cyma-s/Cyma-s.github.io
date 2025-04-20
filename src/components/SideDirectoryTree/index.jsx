import React, { useState } from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const RelativeWrapper = styled.div`
  position: relative;
`

const Wrapper = styled.aside`
  position: absolute;
  right: 117%;
  top: 0px;
  width: 240px;
  height: auto;
  font-size: 16px;

  @media (max-width: 1300px) {
    display: none;
  }
`

const Directory = styled.div`
  margin-bottom: 5px;
`

const DirectoryTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: black;
  margin: 10px 0;
  cursor: pointer;
  user-select: none;
`

const PostItem = styled.div`
  margin: 10px 0 10px 15px;
  font-size: 14px;

  a {
    color: ${props => props.theme.colors.tertiaryText};
    text-decoration: none;

    &:hover {
      color: ${props => props.theme.colors.hoveredLinkText};
    }
  }
`

const TitleLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.hoveredLinkText};
  }
`

const FolderContents = styled.div`
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0")};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
`

const SideDirectoryTree = ({ posts }) => {
  const [openFolders, setOpenFolders] = useState(() => ({}))

  const toggleFolder = (pathKey) => {
    setOpenFolders(prev => ({ ...prev, [pathKey]: !prev[pathKey] }))
  }

  const countPosts = (node) => {
    return Object.values(node).reduce((acc, val) => {
      if (val.slug) return acc + 1
      return acc + countPosts(val)
    }, 0)
  }

  const tree = {}
  posts
    .slice()
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
    .forEach(post => {
      const { slug } = post.fields
      const { title } = post.frontmatter
      const pathParts = slug.split("/").filter(Boolean)

      let current = tree
      pathParts.slice(0, -1).forEach(part => {
        if (!current[part]) current[part] = {}
        current = current[part]
      })
      current[pathParts[pathParts.length - 1]] = { title, slug }
    })

    const renderTree = (node, path = []) => {
    const nodeEntries = Object.entries(node).sort(([keyA, valA], [keyB, valB]) => {
      const isDirA = !valA.slug
      const isDirB = !valB.slug
      if (isDirA && !isDirB) return -1
      if (!isDirA && isDirB) return 1
      return keyA.localeCompare(keyB, "ko")
    })

    return nodeEntries.map(([key, value]) => {
      const currentPath = [...path, key].join("/")
      if (value.slug) {
        return (
          <PostItem key={value.slug}>
            <TitleLink to={value.slug}>{value.title}</TitleLink>
          </PostItem>
        )
      } else {
        const isOpen = openFolders[currentPath] ?? false
        const postCount = countPosts(value)
        return (
          <Directory key={currentPath}>
            <DirectoryTitle onClick={() => toggleFolder(currentPath)}>
              <span style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "7px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0 }}>
                  <polyline points={isOpen ? "6 9 12 15 18 9" : "9 6 15 12 9 18"} />
                </svg>
                {key}
                <span style={{ fontWeight: "normal", fontSize: "13px", color: "#aaa" }}>({postCount})</span>
              </span>
            </DirectoryTitle>
            <FolderContents isOpen={isOpen}>
              <div style={{ display: "flex" }}>
                <div style={{ width: "1px", background: "#e0e0e0", marginLeft: "6px", marginRight: "8px", marginTop: "0px" }} />
                <div>{renderTree(value, [...path, key])}</div>
              </div>
            </FolderContents>
          </Directory>
        )
      }
    })
  }

  return (
    <RelativeWrapper>
      <Wrapper>
        {renderTree(tree)}
      </Wrapper>
    </RelativeWrapper>
  )
}

export default SideDirectoryTree
