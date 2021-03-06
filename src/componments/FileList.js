import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";
import { KEY_RETURN, KEY_ESCAPE } from "keycode-js";
import useContextMenu from "../hooks/useContextMenu";
import { getParentDomNode } from "../utils/helper";
const { remote } = window.require("electron");
const { MenuItem } = remote;

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editFileId, setEditFileId] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const enterPressed = useKeyPress(KEY_RETURN);
  const escPressed = useKeyPress(KEY_ESCAPE);
  const node = useRef();
  const closeEdit = (editFileId) => {
    const editFile = files.find((file) => file.id === editFileId);
    setEditFileId(-1);
    setInputValue("");
    if (editFile && editFile.isNew) {
      onFileDelete(editFile.id);
    }
  };
  const clickedItem = useContextMenu([
    new MenuItem({
      label: "Open",
      click: () => {
        const parentDomElement = getParentDomNode(clickedItem.current, 'file-item');
        if (parentDomElement) {
          onFileClick(parentDomElement.dataset.id);
        }
      },
    }),
    new MenuItem({
      label: "Rename",
      click: () => {
        const parentDomElement = getParentDomNode(clickedItem.current, 'file-item');
        if (parentDomElement) {
          const id = parentDomElement.dataset.id;
          const title = parentDomElement.dataset.title
          setEditFileId(id);
          setInputValue(title);
        }
      },
    }),
    new MenuItem({
      label: "Delete",
      click: () => {
        const parentDomElement = getParentDomNode(clickedItem.current, 'file-item');
        if (parentDomElement) {
          onFileDelete(parentDomElement.dataset.id);
        }
      },
    })
  ], '.file-list', [files]);

  useEffect(() => {
    if (editFileId === -1) {
      return;
    }
    const editFile = files.find((file) => file.id === editFileId);
    if (enterPressed && inputValue.trim() !== "") {
      onSaveEdit(editFileId, inputValue, editFile.isNew);
      setEditFileId(-1);
      setInputValue("");
      return;
    }
    if (enterPressed && inputValue.trim() === "") {
      closeEdit(editFile.id);
      return;
    }
    if (escPressed) {
      closeEdit(editFile.id);
    }
  });

  useEffect(() => {
    if (editFileId !== -1) {
      node.current.focus();
    }
  }, [editFileId]);

  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    if (newFile) {
      setEditFileId(newFile.id);
      setInputValue(newFile.title);
    }
  }, [files]);

  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file, index) => {
        return (
          <li
            key={file.id}
            data-id={file.id}
            data-title={file.title}
            className="list-group-item bg-light d-flex align-items-center file-item row mx-0"
          >
            {file.id !== editFileId && !file.isNew && (
              <>
                <span className="col-2">
                  <FontAwesomeIcon size="lg" icon={faMarkdown} />
                </span>
                <span
                  className="col-6 c-link"
                  onClick={() => {
                    onFileClick(file.id);
                  }}
                >
                  {file.title}
                </span>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    setEditFileId(file.id);
                    setInputValue(file.title);
                  }}
                >
                  <FontAwesomeIcon size="lg" icon={faEdit} title="Edit" />
                </button>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    onFileDelete(file.id);
                  }}
                >
                  <FontAwesomeIcon size="lg" icon={faTrash} title="Delete" />
                </button>
              </>
            )}
            {(file.id === editFileId || file.isNew) && (
              <>
                <input
                  className="form-control col-10"
                  value={inputValue}
                  placeholder="Please enter a file name"
                  ref={node}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    closeEdit(file.id);
                  }}
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
  onSaveEdit: PropTypes.func,
};

export default FileList;
