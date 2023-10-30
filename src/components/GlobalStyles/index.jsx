import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyles = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: 'Pretendard'; 
    src: url('../fonts/Pretendard-Medium.ttf') format('truetype');
    font-weight: normal; 
    font-style: normal; 
  }

  body {
    font-family: 'Pretendard', sans-serif;
    background: ${props => props.theme.colors.bodyBackground};
  }
`

export default GlobalStyles
