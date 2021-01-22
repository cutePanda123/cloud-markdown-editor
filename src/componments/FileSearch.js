import React, { useEffect, useState, useRef } from "react";

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
    <div className="alert alert-primary">
      {!isInputActive && (
        <div className="d-flex justify-content-between align-items-center">
          <span>{title}</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setInputActive(true);
            }}
          >
            Search
          </button>
        </div>
      )}
      {isInputActive && (
        <div className="row">
          <input
            className="form-control col-8"
            value={value}
            ref={node}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            type="button"
            className="btn btn-primary col-4"
            onClick={closeSearch}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FileSearch;
