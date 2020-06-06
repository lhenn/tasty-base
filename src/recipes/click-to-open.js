import React, { useCallback, useEffect, useRef, useState } from "react";

// Click to toggle between open and closed components. The two handlers make it
// possible to perform some kind of parsing to change these when the component
// opens and closes.
const ClickToOpen = ({ open, closed, onOpen, onClose }) => {
  const node = useRef();
  const [isOpen, setIsOpen] = useState(false);
  // True when this component was just closed
  // TODO: same thing when opening?
  const [closing, setClosing] = useState(false);

  const handleClickOutside = useCallback((e) => {
    // Click was outside node
    if (!node.current.contains(e.target)) {
      // I don't see how to prevent a rerender
      setIsOpen((isInputting) => {
        if (isInputting) setClosing(true);
        return false;
      });
    }
  }, []);

  useEffect(() => {
    if (closing) {
      onClose && onClose();
      setClosing(false);
    }
  }, [closing, onClose]);

  useEffect(() => {
    console.log("add listener");
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      console.log("unmount.");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={node}
      onClick={() => {
        if (!isOpen) {
          onOpen && onOpen();
          setIsOpen(true);
        }
      }}
    >
      {isOpen ? open : closed}
    </div>
  );
};

export default ClickToOpen;
