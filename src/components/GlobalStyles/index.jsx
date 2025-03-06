import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: "Eulyoo1945";
    src: url("/fonts/Eulyoo1945-Regular.otf") format("opentype");
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Eulyoo1945";
    src: url("/fonts/Eulyoo1945-SemiBold.otf") format("opentype");
    font-weight: 700;
    font-style: bold;
  }

  body {
    font-family: "Eulyoo1945", sans-serif;
    background: ${props => props.theme.colors.bodyBackground};
  }
`;

export default GlobalStyles;