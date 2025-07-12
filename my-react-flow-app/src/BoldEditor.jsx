import React, { useRef } from 'react';

function RichTextEditor() {
  const editorRef = useRef(null);

  const makeBold = () => {
    document.execCommand('bold'); // This bolds selected text
  };

  return (
    <div>
      <button onClick={makeBold}><b>B</b></button>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        style={{
          border: '1px solid #ccc',
          minHeight: '100px',
          padding: '10px',
          marginTop: '10px'
        }}
      >
        Select some text and click the B button to bold it.
      </div>
    </div>
  );
}

export default RichTextEditor;
