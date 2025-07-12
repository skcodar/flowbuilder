import React, { memo, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FaRocket,
  FaTimes,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaRegSmile,
  FaLink,
  FaPhoneAlt,
  FaRegClone,
  FaReply,
  FaThLarge,
} from "react-icons/fa";

// Emoji options
const emojiList = ["😀", "😂", "😍", "😎", "👍", "🔥", "🎉", "😢", "🥳", "💡"];

const TextButtonsNode = ({ data }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [html, setHtml] = useState("0");
  const editorRef = useRef(null);
  const MAX_CHARS = 1024;

  // Add a content block, only one phone allowed
  const addBlock = (type) => {
    if (type === "phone" && contentBlocks.some((block) => block.type === "phone")) {
      return;
    }
    setContentBlocks((prev) => [...prev, { type, id: Date.now() }]);
    setShowDropdown(false);
  };

  // Remove a block by ID
  const removeBlock = (id) => {
    setContentBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  // Handle editable input change with character limit
  const handleInput = (e) => {
    const newText = e.target.innerText;
    if (newText.length <= MAX_CHARS) {
      setHtml(e.target.innerHTML);
    } else {
      e.target.innerHTML = html;
      placeCaretAtEnd(editorRef.current);
    }
  };

  // Move caret to end
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

  // Apply formatting
  const execFormat = (command) => {
    document.execCommand(command);
    editorRef.current?.focus();
  };

  // Insert emoji at cursor
  const insertEmoji = (emoji) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(emoji));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    setShowEmojiPicker(false);
    editorRef.current?.focus();
  };

  // Render different types of blocks with close button (left)
  const renderBlock = (block) => {
    const closeIcon = (
      <FaTimes
        onClick={() => removeBlock(block.id)}
        className="absolute mt-[-32px] ml-[-14px] text-green-800 hover:text-red-500 cursor-pointer text-xs"
      />
    );

    switch (block.type) {
      case "quick":
        return (
          <div
            key={block.id}
            className="relative flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2"
          >
            {closeIcon}
            <FaReply className="shrink-0 text-gray-500 text-sm" />
            <div>
              <input
                type="text"
                placeholder="Quick Reply"
                className="flex-1 outline-none text-sm"
              />
              <Handle
                type="source"
                position={Position.Right}
                className="!w-2.5 !h-2.5 !bg-[#E4DFDF] !absolute top-[11px] !-translate-y-1/2"
              />
            </div>
          </div>
        );
      case "copy":
        return (
          <div
            key={block.id}
            className="relative flex items-center gap-2 rounded-md border border-gray-300 mt-2 bg-white px-2 py-2"
          >
            {closeIcon}
            <FaRegClone className="shrink-0 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Copy Code"
              className="flex-1 outline-none text-sm"
            />
          </div>
        );
      case "phone":
        return (
          <div
            key={block.id}
            className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2"
          >
           <FaTimes
              onClick={() => removeBlock(block.id)}
              className="absolute mt-[-11px] ml-[-14px] text-green-800 hover:text-red-500 cursor-pointer text-xs"
            />
            <FaPhoneAlt className="mt-[10px] shrink-0 text-sm text-gray-500" />
            <div className="flex flex-1 flex-col justify-center gap-1">
              <input
                type="text"
                placeholder="Title"
                className="border-b border-gray-300 pb-[2px] outline-none"
              />
              <input
                type="text"
                placeholder="Number"
                className="outline-none"
              />
            </div>
          </div>
        );
      case "url":
        return (
          <div
            key={block.id}
            className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2"
          >
            <FaTimes
              onClick={() => removeBlock(block.id)}
              className="absolute mt-[-11px] ml-[-14px] text-green-800 hover:text-red-500 cursor-pointer text-xs"
            />
            <FaLink className="mt-[10px] shrink-0 text-sm text-gray-500" />
            <div className="flex flex-1 flex-col gap-1">
              <input
                type="text"
                placeholder="Title"
                className="border-b border-gray-300 pb-[2px] outline-none"
              />
              <input
                type="text"
                placeholder="URL"
                className="outline-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Check if phone block already exists
  const hasPhoneBlock = contentBlocks.some((block) => block.type === "phone");
  const hasCopyCodeBlock = contentBlocks.some((block) => block.type === "copy");

  return (
    <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#E4DFDF]"
      />

      {/* Header */}
      <header className="drag-handle__custom cursor-move relative flex items-center mb-1 justify-between px-3 py-2 shadow-lg">
        <span className="absolute left-0 top-0 h-full w-[6px] rounded-l-md bg-green-600" />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 p-[6px] text-green-600">
            <FaRocket className="text-[17px]" />
          </span>
          <span className="text-[16px] font-semibold text-green-700">
            Text + Buttons
          </span>
        </div>
        <button
          onClick={data?.onDelete}
          className="text-green-600 transition hover:text-red-500 cursor-pointer"
        >
          <FaTimes className="text-[15px]" />
        </button>
      </header>

      {/* Body */}
      <div className="p-2">
        <div className="bg-[#EBF5F3] p-2">
          {/* Editor */}
          <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`min-h-[96px] w-full rounded p-1 text-sm outline-none ${
                html === "" && !isFocused ? "text-gray-400" : "text-black"
              }`}
              style={{ whiteSpace: "pre-wrap", cursor: "text" }}
            >
              {html === "" && !isFocused ? "Type something..." : null}
            </div>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-3 text-xs text-gray-500 cursor-pointer relative">
              <FaBold
                onClick={() => execFormat("bold")}
                className="hover:text-black cursor-pointer"
              />
              <FaItalic
                onClick={() => execFormat("italic")}
                className="hover:text-black cursor-pointer"
              />
              <FaStrikethrough />
              <FaRegSmile
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="cursor-pointer hover:text-black"
              />
              <span className=" cursor-pointer">(x)</span>
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute z-20 top-6 left-20 grid grid-cols-5 gap-1 bg-white border border-gray-300 rounded-md p-2 cursor-pointer shadow-lg">
                  {emojiList.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertEmoji(emoji)}
                      className="text-xl hover:scale-110 cursor-pointer transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <p className="ml-auto text-right text-[10px] text-gray-400">
              {(editorRef.current?.innerText.length || 0)}/{MAX_CHARS}
            </p>
            </div>

            {/* Character Counter */}
            
          </div>

          {/* Render added content blocks */}
          {contentBlocks.map(renderBlock)}

          {/* Add Content Dropdown */}
          <div className="relative mt-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaThLarge className="text-[12px]" />
              Add Content
            </button>

            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-[#E4DFDF] bg-white shadow overflow-hidden">
                <button
                  onClick={() => addBlock("quick")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-b border-[#E4DFDF] cursor-pointer"
                >
                  <FaReply className="text-sm mr-3" />
                  Quick Reply
                </button>
                <button
                  onClick={() => !hasCopyCodeBlock && addBlock("copy")}
                  disabled={hasCopyCodeBlock}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-left text-sm border border-[#E4DFDF] cursor-pointer ${
                    hasCopyCodeBlock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaRegClone className="text-sm mr-3" />
                  Copy Code
                </button>

                <button
                  onClick={() => addBlock("url")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-b border-[#E4DFDF] cursor-pointer"
                >
                  <FaLink className="text-sm mr-3" />
                  URL Button
                </button>

                <button
                  onClick={() => !hasPhoneBlock && addBlock("phone")}
                  disabled={hasPhoneBlock}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-left text-sm border-[#E4DFDF] cursor-pointer ${
                    hasPhoneBlock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaPhoneAlt className="text-sm mr-3" />
                  Ph. Number
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TextButtonsNode);
