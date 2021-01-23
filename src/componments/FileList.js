import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [ editFileId, setEditFileId ] = useState(-1);
  const [ inputValue, setInputValue ] = useState("");
  const node = useRef();
  const closeEdit = (e) => {
    e.preventDefault();
    setEditFileId(-1);
    setInputValue("");
  };

  useEffect(() => {
    const handleInputEvent = (event) => {
      const { keyCode } = event;
      if (editFileId === -1) {
        return;
      }
      if (keyCode === 13) {
        onSaveEdit(editFileId, inputValue);
        setEditFileId(-1);
        closeEdit(event);
      } else if (keyCode === 27) {
        closeEdit(event);
      }
    };

    document.addEventListener("keyup", handleInputEvent);
    return () => {
      document.removeEventListener("keyup", handleInputEvent);
    };
  });

  useEffect(() => {
    if (editFileId !== -1) {
      node.current.focus();
    }
  }, [editFileId]);

  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file, index) => {
        return (
          <li
            key={file.id}
            className="list-group-item bg-light d-flex align-items-center file-item row"
          >
            {file.id !== editFileId && (
              <>
                <span className="col-2">
                  <FontAwesomeIcon size="lg" icon={faMarkdown} />
                </span>
                <span
                  className="col-8 c-link"
                  onClick={() => {
                    onFileClick(file.id);
                  }}
                >
                  {file.title}
                </span>
                <button
                  type="button"
                  className="icon-button col-1"
                  onClick={() => {
                    setEditFileId(file.id);
                    setInputValue(file.title);
                  }}
                >
                  <FontAwesomeIcon size="lg" icon={faEdit} title="Edit" />
                </button>
                <button
                  type="button"
                  className="icon-button col-1"
                  onClick={() => {
                    onFileDelete(file.id);
                  }}
                >
                  <FontAwesomeIcon size="lg" icon={faTrash} title="Delete" />
                </button>
              </>
            )}
            {file.id === editFileId && (
              <>
                <input
                  className="form-control col-10"
                  value={inputValue}
                  ref={node}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={closeEdit}
                >
                  <FontAwesomeIcon size="lg" icon={faTimes} title="Close" />
                </button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func
};

export default FileList;
