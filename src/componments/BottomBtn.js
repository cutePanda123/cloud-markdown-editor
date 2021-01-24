import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BottomBtn = ({ text, colorClassName, iconName, onBtnClick }) => (
  <button type="button" className={`btn btn-block no-border ${colorClassName}`}>
    <FontAwesomeIcon className="mr-2" size="lg" icon={iconName} />
    {text}
  </button>
);

BottomBtn.propTypes = {
  text: PropTypes.string,
  colorClassName: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  onBtnClick: PropTypes.func.isRequired,
};

BottomBtn.defaultProps = {
  text: "empty button",
};

export default BottomBtn;
