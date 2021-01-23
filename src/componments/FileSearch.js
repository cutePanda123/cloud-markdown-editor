import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from '../hooks/useKeyPress';
import { KEY_RETURN, KEY_ESCAPE } from 'keycode-js';

const FileSearch = ({ title, onFileSearch }) => {
  const [isInputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const enterPressed = useKeyPress(KEY_RETURN);
  const escPressed = useKeyPress(KEY_ESCAPE);
  let node = useRef(null);
  const closeSearch = () => {
    setInputActive(false);
    setInputValue("");
  };

  useEffect(() => {
      if (!isInputActive) {
        return;
      }
      if (enterPressed) {
        onFileSearch(inputValue);
        return;
      }
      if (escPressed) {
        closeSearch();
      }
  });

  useEffect(() => {
    if (isInputActive) {
      node.current.focus();
    }
  }, [isInputActive]);

  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center">
      {!isInputActive && (
        <>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon size="lg" icon={faSearch} title="Search" />
          </button>
        </>
      )}
      {isInputActive && (
        <>
          <input
            className="form-control"
            value={inputValue}
            ref={node}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon size="lg" icon={faTimes} title="Close" />
          </button>
        </>
      )}
    </div>
  );
};

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
};

FileSearch.defaultProps = {
  title: "My files",
};

export default FileSearch;
