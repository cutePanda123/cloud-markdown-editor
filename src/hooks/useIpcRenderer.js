import React, { useState, useEffect } from "react";
const { remote, ipcRenderer } = window.require("electron");

const useIpcRenderer = (actionToCallbackMap) => {
  useEffect(() => {
    Object.keys(actionToCallbackMap).forEach((action) => {
      ipcRenderer.on(action, actionToCallbackMap[action]);
    });
    return () => {
      Object.keys(actionToCallbackMap).forEach((action) => {
        ipcRenderer.removeListener(action, actionToCallbackMap[action]);
      });
    };
  });
};

export default useIpcRenderer;
