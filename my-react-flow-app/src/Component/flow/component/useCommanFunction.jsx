import { useEffect, useRef, useState } from "react";

// Maximum allowed characters in the content editor
const MAX_CHARS = 1024;

const useCommanFunctions = () => {
  // Emoji list
  const emojiList = ["😀", "😂", "😍", "😎", "👍", "🔥", "🎉", "😢", "🥳", "💡"];

  // State variables
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [html, setHtml] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sections, setSections] = useState([]);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);


  // Refs
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const dropdownRef = useRef(null);
// Bolde
useEffect(() => {
  const checkFormatState = () => {
    setIsBoldActive(document.queryCommandState("bold"));
    setIsItalicActive(document.queryCommandState("italic"));
  };

  document.addEventListener("selectionchange", checkFormatState);
  return () => {
    document.removeEventListener("selectionchange", checkFormatState);
  };
}, []);


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ➕ Add a content block (e.g., phone, copy)
  const addBlock = (type) => {
    if (type === "phone" && contentBlocks.some((block) => block.type === "phone")) return;
    if (type === "copy" && contentBlocks.some((block) => block.type === "copy")) return;

    setContentBlocks((prev) => [...prev, { type, id: Date.now() }]);
    setShowDropdown(false);
  };

  // ❌ Remove a content block by ID
  const removeBlock = (id) => {
    setContentBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  // ✏️ Handle contentEditable input
  const handleInput = (e) => {
    const newText = e.target.innerText.replace(/\n/g, "");
    if (newText.length <= MAX_CHARS) {
      setHtml(e.target.innerHTML);
      setCharacterCount(newText.length);
    } else {
      e.target.innerHTML = html;
      placeCaretAtEnd(editorRef.current);
    }
  };

  // Utility to place cursor at the end
  const placeCaretAtEnd = (el) => {
    if (!el) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  };

  // 🔠 Format text
  const execFormat = (command) => {
    document.execCommand(command);
    editorRef.current?.focus();
  };

  // 😊 Insert emoji at caret
  const insertEmoji = (emoji) => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(emoji));
    range.collapse(false);

    sel.removeAllRanges();
    sel.addRange(range);

    setHtml(editor.innerHTML);
    setCharacterCount(editor.innerText.replace(/\n/g, "").length);
    setShowEmojiPicker(false);
    editor.focus();
  };



// List Component

  // ➕ Add a new section
  const addSection = () => {
  setSections((prev) => [
    ...prev,
    {
      id: Date.now(),
      sectionTitle: "",
      rows: [
        {
          id: 1, // Default row ID
          title: "",
          description: "",
        },
      ],
    },
  ]);
};

  // ➕ Add row to specific section
  const addRow = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].rows.push({
      id: Date.now(),
      title: "",
      description: "",
    });
    setSections(updated);
  };

  // ✏️ Update row field (title/description)
  const updateRow = (sectionIndex, rowIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].rows[rowIndex][field] = value;
    setSections(updated);
  };

  // ✏️ Update section title
  const updateSectionTitle = (sectionIndex, value) => {
    const updated = [...sections];
    updated[sectionIndex].sectionTitle = value;
    setSections(updated);
  };

  // ❌ Remove a row and remove its associated block
  const removeRow = (sectionIndex, rowId) => {
    setSections((prevSections) =>
        prevSections.map((section, idx) =>
            idx === sectionIndex
                ? {
                      ...section,
                      rows: section.rows.filter((row) => row.id !== rowId),
                  }
                : section
        )
    );
};

// ❌ Remove section List Card

const removeSection = (sectionIndex) => {
  setSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
};


  return {
    // content state
    showDropdown,
    setShowDropdown,
    showEmojiPicker,
    setShowEmojiPicker,
    contentBlocks,
    addBlock,
    removeBlock,
    isFocused,
    setIsFocused,
    html,
    setHtml,
    characterCount,
    setCharacterCount,
    fileInputRef,
    editorRef,
    dropdownRef,
    handleInput,
    execFormat,
    insertEmoji,
    uploadedFiles,
    setUploadedFiles,
    MAX_CHARS,
    emojiList,

    // section/row state
    removeSection,
    sections,
    addSection,
    addRow,
    updateRow,
    updateSectionTitle,
    removeRow,
    isBoldActive, 
    setIsBoldActive,
    isItalicActive, 
    setIsItalicActive,
  };
};

export default useCommanFunctions;
