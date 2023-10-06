import React from 'react';
import styles from './Checkbox.module.css';

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
    const iconComponent = ICON_MAPPINGS[iconKey] || null; // 딕셔너리에 없는 경우에 대비하여 기본값 설정
    return (
      <label className={styles.checkboxContainer}>
        <input type="checkbox" className={styles.checkbox} {...props} />
        <span className={styles.checkboxSymbol}>
          {iconComponent}
        </span>
      </label>
    );
  }
  
  export default CustomCheckbox;
