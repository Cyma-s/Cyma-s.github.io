import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"

import { Link } from "gatsby"

import { title } from "../../../../blog-config"

import {
  FaSun,
  FaMoon,
  FaTags,
  FaRss,
  FaSearch,
  FaListUl,
  FaEyeSlash,
} from "react-icons/fa"

const HeaderWrapper = styled.header`
  display: block;
  position: fixed;
  top: ${props => (props.isHidden ? -60 : 0)}px;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: ${props => props.theme.colors.headerBackground};
  box-shadow: 0 0 8px ${props => props.theme.colors.headerShadow};
  backdrop-filter: blur(5px);
  opacity: ${props => (props.isHidden ? 0 : 1)};
  transition: top 0.5s, opacity 0.5s;
  z-index: 999;

  @media (max-width: 768px) {
    padding: 16px 0;
  }
`

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 64px;

  @media (max-width: 768px) {
    margin: 0 15px;
  }
`

const BlogTitle = styled.span`
  letter-spacing: -1px;
  font-family: "Source Code Pro", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${props => props.theme.colors.text};

  & > a {
    text-decoration: none;
    color: inherit;
  }
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & svg {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    cursor: pointer;
  }

  & svg path {
    fill: ${props => props.theme.colors.flipAccentText};
    transition: fill 0.3s;
  }

  & svg:hover path {
    fill: ${props => props.theme.colors.flipAccentOppositeText};
  }
`

const ToggleWrapper = styled.div`
  width: 20px;
  height: 24px;
  margin-right: 15px;
  overflow: hidden;
  box-sizing: border-box;
`

const IconRail = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 40px;
  top: ${props => (props.theme === "light" ? "-19px" : "0px")};
  transition: top 0.4s;

  & > svg {
    transition: opacity 0.25s;
  }

  & > svg:first-child {
    opacity: ${props => (props.theme === "light" ? 0 : 1)};
  }

  & > svg:last-child {
    opacity: ${props => (props.theme === "dark" ? 0 : 1)};
  }
`

const IconTitle = styled.p`
  font-size: 10px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  display: none;
  transition: opacity 0.3s, transform 0.3s, margin-top 0.3s;

  &.active {
    display: block;
    opacity: 1;
    margin-top: 10px;
    transform: translateY(0);
  }
`;

const LinkWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: margin-left 0.3s, margin-right 0.3s;

  &:hover {
    margin-left: 5px;
    margin-right: 5px;
  }

  &:hover svg path {
    fill: ${props => props.theme.colors.flipAccentOppositeText};
  }

  & > a {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    color: inherit;
    text-decoration: none;
  }
`;

const Header = ({ toggleTheme }) => {
  const theme = useTheme()
  const [hidden, setHidden] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null) // 추가된 상태

  useEffect(() => {
    const detectScrollDirection = () => {
      setHidden(window.scrollY > 400);
    };

    window.addEventListener("scroll", detectScrollDirection);

    return () => {
      window.removeEventListener("scroll", detectScrollDirection);
    };
  }, [])

  const menuItems = [
    {to: "/tags", icon: <FaTags />, title: "전체 태그"},
    {to: "/series", icon: <FaListUl />, title: "전체 시리즈"},
    {to: "/rss.xml", icon: <FaRss />, title: "RSS"},
    {to: "/search", icon: <FaSearch />, title: "전체 글 검색"},
    {to: "/all", icon: <FaEyeSlash />, title: "전체 글 보기"},
  ]

  return (
    <HeaderWrapper isHidden={hidden}>
      <Inner>
        <BlogTitle>
          <Link to="/">{title}</Link>
        </BlogTitle>
        <Menu>
          <ToggleWrapper onClick={toggleTheme}>
            <IconRail theme={theme.name}>
              <FaSun />
              <FaMoon />
            </IconRail>
          </ToggleWrapper>
          {menuItems.map((item, index) => (
            <LinkWrapper key={index}
            onMouseEnter={() => setHoveredIndex(index)} // 마우스가 들어올 때
            onMouseLeave={() => setHoveredIndex(null)} // 마우스가 나갈 때
            >
              <Link to={item.to}>
                {item.icon}
                <IconTitle className={hoveredIndex === index ? "active" : ""}>{item.title}</IconTitle>
              </Link>
            </LinkWrapper>
          ))}
        </Menu>
      </Inner>
    </HeaderWrapper>
  )
}

export default Header
