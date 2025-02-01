import React, { useRef, useEffect, useState } from "react";
import JoditEditor from "jodit-react";

// Debounce function
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return (value) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

const TextEditor = ({ onChange, value }) => {
  const editorRef = useRef(null);
  const [localValue, setLocalValue] = useState(value || "");

  const config = {
    readonly: false,
    placeholder: "Write something...",
    height: 300,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "paragraph",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "link",
      "image",
      "source",
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    spellcheck: true,
    toolbarSticky: true,
    showCharsCounter: false,
    showWordsCounter: false,
    disablePlugins: ["poweredByJodit"],
  };

  const debouncedOnChange = useDebounce((newContent) => {
    console.log("Editor Content:", newContent); // Debugging
    setLocalValue(newContent);
    if (onChange) {
      onChange(newContent);
    }
  }, 500);

  const handleBlur = (content) => {
    console.log("Editor Blur Content:", content); // Debugging
    setLocalValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editorRef}
        value={localValue}
        config={config}
        onBlur={handleBlur}
        onChange={debouncedOnChange}
      />
    </div>
  );
};

export default TextEditor;