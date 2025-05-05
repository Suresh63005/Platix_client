import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const config = {
    readonly: false,
    placeholder: "Write or paste something...",
    height: 300,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "outdent", "indent", "|",
      "font", "fontsize", "paragraph", "|",
      "align", "undo", "redo", "|",
      "link", "image", "source"
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    spellcheck: true,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    disablePlugins: ["poweredByJodit"],
    pastePlain: false,         // ✅ Allow rich content
    allowPasteHtml: true,      // ✅ Enable HTML pasting
    enableDragAndDropFileToEditor: true,
    askBeforePasteHTML: false, // ✅ Don't prompt when pasting HTML
    askBeforePasteFromWord: false, // ✅ Don't prompt when pasting from Word
    events: {
      // ✅ Handle paste events manually if needed
      paste: (event) => {
        console.log("Paste event:", event);
      }
    }
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default TextEditor;
