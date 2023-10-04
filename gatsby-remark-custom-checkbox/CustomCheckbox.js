import React from 'react';
import styles from './Checkbox.module.css';

import ReactIcon from "react-icons/fa";

const ICON_MAPPINGS = {
    '>': ReactIcon.FaShare,
    '<': ReactIcon.FaCalendar,
    '!': ReactIcon.FaExclamation,
    '-': ReactIcon.FaTimes,
    '/': ReactIcon.FaStarHalfAlt,
    '?': ReactIcon.FaQuestion,
    '1': ReactIcon.FaComment,
    '2': ReactIcon.FaComment,
    '3': ReactIcon.FaComment,
    '4': ReactIcon.FaComment,
    '5': ReactIcon.FaComment,
    '6': ReactIcon.FaComment,
    '7': ReactIcon.FaComment,
    '8': ReactIcon.FaComment,
    '9': ReactIcon.FaComment,
    '0': ReactIcon.FaComment,
  };
  


const CustomCheckbox = ({ iconKey, ...props }) => {
  const iconValue = ICON_MAPPINGS[iconKey] || iconKey; // 딕셔너리에 없는 경우에 대비하여 기본값 설정
  return (
    <label className={styles.checkboxContainer}>
      <input type="checkbox" className={styles.checkbox} {...props} />
      <span className={styles.checkboxSymbol} data-icon={iconValue}></span>
    </label>
  );
}

export default CustomCheckbox;
