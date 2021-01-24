import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const TabList = ({ files, activeId, unsavedIds, onClickTab, onCloseTab }) => {
  return (
    <ul className="nav nav-pills">
      {files.map((file, index) => {
        const fClassName = classNames({
          "nav-link": true,
          active: file.id == activeId,
        });
        return (
          <li className={fClassName} key={file.id}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onClickTab(file.id);
              }}
              className="nav-link"
              href="#"
            >
              {file.title}
              <span className='ml-2'>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsavedIds: PropTypes.array,
  onClickTab: PropTypes.func,
  onClickTab: PropTypes.func,
};

TabList.defaultTypes = {
  unsavedIds: [],
};

export default TabList;
