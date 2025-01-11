import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const TextEditor = ({ onChange, value }) => {
  const [editorState, setEditorState] = useState(value || EditorState.createEmpty());

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    setEditorState(newState);
  };

  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    setEditorState(newState);
  };

  const focusEditor = () => {
    // Focus editor when clicking the editor area
    document.querySelector('.editor').focus();
  };

  const handleChange = (editorState) => {
    setEditorState(editorState);
    onChange && onChange(editorState);
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => toggleBlockType('header-one')}>H1</button>
        <button onClick={() => toggleBlockType('header-two')}>H2</button>
        <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
        <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
        <button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</button>
        <button onClick={() => toggleInlineStyle('STRIKETHROUGH')}>Strikethrough</button>
        <button onClick={() => toggleBlockType('unordered-list-item')}>UL</button>
        <button onClick={() => toggleBlockType('ordered-list-item')}>OL</button>
      </div>

      <div className="editor" onClick={focusEditor}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleChange}
          placeholder="Write something..."
        />
      </div>
    </div>
  );
};

export default TextEditor;
