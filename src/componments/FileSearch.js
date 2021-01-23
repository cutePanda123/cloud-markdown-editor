import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const FileSearch = ({ title, onFileSearch }) => {
  const [isInputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  let node = useRef(null);
  const closeSearch = (e) => {
    e.preventDefault();
    setInputActive(false);
    setValue("");
  };

  useEffect(() => {
    const handleInputEvent = (event) => {
      const { keyCode } = event;
      if (!isInputActive) {
        return;
      }
      if (keyCode === 13) {
        onFileSearch(value);
      } else if (keyCode === 27) {
        closeSearch(event);
      }
    };

    document.addEventListener("keyup", handleInputEvent);
    return () => {
      document.removeEventListener("keyup", handleInputEvent);
    };
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
            value={value}
            ref={node}
            onChange={(e) => {
              setValue(e.target.value);
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
