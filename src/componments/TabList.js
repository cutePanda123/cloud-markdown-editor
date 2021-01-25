import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./TabList.scss";

const TabList = ({ files, activeId, unsavedIds, onClickTab, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map((file, index) => {
        const isUnsaved = unsavedIds.includes(file.id);
        const fClassName = classNames({
          "nav-link": true,
          active: file.id === activeId,
          withUnsaved: isUnsaved,
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
              <span className="title">{file.title}</span>
              <span
                className="ml-2 close-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(file.id);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
              {isUnsaved && (
                <span className="rounded-circle unsaved-icon ml-2"></span>
              )}
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
  onCloseTab: PropTypes.func,
};

TabList.defaultTypes = {
  unsavedIds: [],
};

export default TabList;
