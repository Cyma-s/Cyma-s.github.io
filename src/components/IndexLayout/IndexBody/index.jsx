import React from "react"
import styled from "styled-components"

const IndexBodyWrapper = styled.div`
  margin: 0 auto;
  padding-top: 80px;
  max-width: 680px;
`

const IndexBody = ({ children }) => {
  return <IndexBodyWrapper>{children}</IndexBodyWrapper>
}

export default IndexBody
