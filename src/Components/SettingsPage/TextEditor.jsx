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
    readonly: false, // Enable editing
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
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus(); // Auto-focus when the component mounts
    }
  }, []);

  const debouncedOnChange = useDebounce((newContent) => {
    setLocalValue(newContent);
    if (onChange) {
      onChange(newContent); // Call parent onChange after debounce
    }
  }, 500); // Debounce time in milliseconds

  const handleBlur = (content) => {
    setLocalValue(content);
    if (onChange) {
      onChange(content); // Update on blur to avoid unnecessary updates
    }
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editorRef}
        value={localValue}
        config={config}
        onBlur={handleBlur}
        onChange={debouncedOnChange} // Use debounced onChange
      />
    </div>
  );
};

export default TextEditor;
