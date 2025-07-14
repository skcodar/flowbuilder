import { useEffect, useRef, useState } from "react";

// Maximum allowed characters in the content editor
const MAX_CHARS = 1024;

// Custom React hook containing reusable content editor logic
const useCommanFunctions = () => {
  // Predefined list of emojis for the emoji picker
  const emojiList = ["😀", "😂", "😍", "😎", "👍", "🔥", "🎉", "😢", "🥳", "💡"];

  // UI state variables
  const [showDropdown, setShowDropdown] = useState(false); // Controls visibility of dropdown
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Controls visibility of emoji picker
  const [contentBlocks, setContentBlocks] = useState([]); // Stores added content blocks like phone, copy
  const [isFocused, setIsFocused] = useState(false); // Tracks focus state of editor
  const [html, setHtml] = useState(""); // Stores current HTML content of editor
  const [characterCount, setCharacterCount] = useState(0); // Tracks character count of editor content
  const [uploadedFiles, setUploadedFiles] = useState([]); // Stores uploaded image preview

  // Refs to DOM elements
  const fileInputRef = useRef(null); // File input for image uploads
  const editorRef = useRef(null); // Reference to the contentEditable editor
  const dropdownRef = useRef(null); // Reference to the dropdown container

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside the dropdown, close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add a content block (e.g., phone, copy)
  const addBlock = (type) => {
    // Prevent duplicate phone or copy blocks
    if (type === "phone" && contentBlocks.some((block) => block.type === "phone")) return;
    if (type === "copy" && contentBlocks.some((block) => block.type === "copy")) return;

    // Add new block with unique ID
    setContentBlocks((prev) => [...prev, { type, id: Date.now() }]);

    // Close the dropdown after adding
    setShowDropdown(false);
  };

  // Remove a content block by ID
  const removeBlock = (id) => {
    setContentBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  // Handle input in the editor, enforce max character limit
  const handleInput = (e) => {
    const newText = e.target.innerText.replace(/\n/g, "");

    if (newText.length <= MAX_CHARS) {
      // If within limit, update state
      setHtml(e.target.innerHTML);
      setCharacterCount(newText.length);
    } else {
      // If exceeded, revert content and restore caret
      e.target.innerHTML = html;
      placeCaretAtEnd(editorRef.current);
    }
  };

  // Utility to move caret to end of contentEditable element
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

  // Apply formatting like bold/italic/etc using execCommand
  const execFormat = (command) => {
    document.execCommand(command);
    editorRef.current?.focus();
  };

  // Insert an emoji at current caret position
  const insertEmoji = (emoji) => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) return;

    // Insert emoji at the selected position
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(emoji));
    range.collapse(false);

    // Restore selection and update state
    sel.removeAllRanges();
    sel.addRange(range);

    setHtml(editor.innerHTML);
    setCharacterCount(editor.innerText.replace(/\n/g, "").length);
    setShowEmojiPicker(false);
    editor.focus();
  };

  // Expose all necessary state and functions
  return {
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
  };
};

export default useCommanFunctions;
