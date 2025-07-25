import React, { useEffect, useState, useRef } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaRegSmile,
} from "react-icons/fa";
import useCommanFunctions from "../component/useCommanFunction";

export default function TxtArea() {
  const {
    showEmojiPicker,
    setShowEmojiPicker,
    html,
    setHtml,
    characterCount,
    setCharacterCount,
    editorRef,
    insertEmoji,
    MAX_CHARS,
    emojiList,
  } = useCommanFunctions();
  const [isFocused, setIsFocused] = useState(false);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      setCharacterCount(editorRef.current.innerText.length);
    }
  }, [html]);

  return (
    <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
      {/* contentEditable div */}
      <div
        ref={editorRef}
        contentEditable
        data-role="rich-editor"        // ✅ ADD THIS
        suppressContentEditableWarning
        onInput={(e) => {
            setHtml(e.currentTarget.innerHTML);
            setCharacterCount(e.currentTarget.innerText.length);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type something..."
        className="min-h-[96px] w-full rounded p-1 text-sm outline-none text-black resize-none"
        style={{ whiteSpace: "pre-wrap", cursor: "text" }}
    />


      {/* Toolbar */}
      <div className="flex items-center gap-3 text-xs text-green-800 cursor-pointer relative">
        <FaBold
          onClick={() => {
            document.execCommand("bold");
            setIsBoldActive((prev) => !prev);
          }}
          className={`cursor-pointer ${isBoldActive ? "bg-green-200 text-black" : "hover:text-black"}`}
          style={{ borderRadius: "4px", padding: "2px", fontSize: "medium" }}
        />
        <FaItalic
          onClick={() => {
            document.execCommand("italic");
            setIsItalicActive((prev) => !prev);
          }}
          className={`cursor-pointer ${isItalicActive ? "bg-green-200 text-black" : "hover:text-black"}`}
          style={{ borderRadius: "4px", padding: "2px", fontSize: "medium" }}
        />
        <FaStrikethrough onClick={() => document.execCommand("strikeThrough")} />
        <FaRegSmile
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="cursor-pointer hover:text-black"
        />

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            className="absolute z-20 top-6 left-20 grid grid-cols-5 gap-1 bg-white border border-gray-300 rounded-md p-2 cursor-pointer shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
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

        {/* Character Count */}
        <p className="ml-auto text-right text-[10px] text-gray-400">
          {characterCount}/{MAX_CHARS}
        </p>
      </div>
    </div>
  );
}
