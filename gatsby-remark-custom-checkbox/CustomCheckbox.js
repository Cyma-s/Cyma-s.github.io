import React from 'react';
import {styled} from 'styled-components';
import StyledMarkdown from "./StyledMarkdown"


const StyledCheckboxSymbol = styled.span`
  svg {
    fill: ${props => props.theme.colors.secondAccentText || 'black'};
    width: 24px;
    height: 24px;
  }
`

import {
  FaShare,
  FaCalendar,
  FaExclamation,
  FaTimes,
  FaStarHalfAlt,
  FaQuestion,
  FaStar,
  FaThumbtack,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaLightbulb,
  FaDollarSign,
  FaThumbsUp,
  FaThumbsDown,
  FaBookmark,
  FaQuoteLeft,
  FaComment,
} from "react-icons/fa";

const ICON_MAPPINGS = {
    '>': <FaShare/>,
    '<': <FaCalendar/>,
    '!': <FaExclamation/>,
    '-': <FaTimes/>,
    '/': <FaStarHalfAlt/>,
    '?': <FaQuestion/>,
    '*': <FaStar/>,
    'n': <FaThumbtack/>,
    'l': <FaMapMarkerAlt/>,
    'i': <FaInfoCircle/>,
    'I': <FaLightbulb/>,
    'S': <FaDollarSign/>,
    'p': <FaThumbsUp/>,
    'c': <FaThumbsDown/>,
    'b': <FaBookmark/>,
    '\"': <FaQuoteLeft/>,
    '1': <FaComment/>,
    '2': <FaComment/>,
    '3': <FaComment/>,
    '4': <FaComment/>,
    '5': <FaComment/>,
    '6': <FaComment/>,
    '7': <FaComment/>,
    '8': <FaComment/>,
    '9': <FaComment/>,
    '0': <FaComment/>,
};

const CustomCheckbox = ({ iconKey, ...props }) => {
  const iconComponent = ICON_MAPPINGS[iconKey] || null;

  return (
    <StyledMarkdown>
      <label> 
        <input type="checkbox" {...props} />
        <StyledCheckboxSymbol>
            {iconComponent}
        </StyledCheckboxSymbol>
      </label>
    </StyledMarkdown>
  );
}

export default CustomCheckbox;
