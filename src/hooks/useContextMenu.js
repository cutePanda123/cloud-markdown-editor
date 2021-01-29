import { useEffect, useRef } from "react";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

const useContextMenu = (itemArray, targetSelector) => {
  let clickedElement = useRef(null);
  useEffect(() => {
    const menu = new Menu();
    itemArray.forEach((item) => {
      menu.append(new MenuItem(item));
    });
    const handleContextMenu = (e) => {
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target;
        menu.popup({ window: remote.getCurrentWindow() });
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return clickedElement;
};

export default useContextMenu;
