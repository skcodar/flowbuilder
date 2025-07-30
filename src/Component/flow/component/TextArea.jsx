import React, { useState, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaRegSmile,
} from "react-icons/fa";
import useCommanFunctions from "../component/useCommanFunction";

const TextArea = () => {
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
    handleInput,
    execFormat,
  } = useCommanFunctions();

  const [isFocused, setIsFocused] = useState(false);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isStrikethroughActive, setIsStrikethroughActive] = useState(false);

  const handleEmojiInsert = (emoji) => {
    insertEmoji(emoji);
    setCharacterCount(editorRef.current?.innerText.length || 0);
    setShowEmojiPicker(false);
  };

  // ✅ Track formatting state based on selection
  useEffect(() => {
    const updateFormatState = () => {
      if (!editorRef.current || !document.activeElement.contains(editorRef.current)) return;

      try {
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");
        const strikethrough = document.queryCommandState("strikethrough");

        setIsBoldActive(bold);
        setIsItalicActive(italic);
        setIsStrikethroughActive(strikethrough);
      } catch (e) {
        console.warn("Command state check failed:", e);
      }
    };

    const editor = editorRef.current;
    document.addEventListener("selectionchange", updateFormatState);
    editor?.addEventListener("keyup", updateFormatState);
    editor?.addEventListener("mouseup", updateFormatState);
    editor?.addEventListener("click", updateFormatState);

    return () => {
      document.removeEventListener("selectionchange", updateFormatState);
      editor?.removeEventListener("keyup", updateFormatState);
      editor?.removeEventListener("mouseup", updateFormatState);
      editor?.removeEventListener("click", updateFormatState);
    };
  }, [editorRef]);

  return (
    <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2 relative">
      {!html && !isFocused && (
        <div className="absolute text-sm text-gray-400 px-3 pt-[6px] pointer-events-none">
          Type something...
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        data-role="rich-editor"
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[96px] w-full rounded p-1 text-sm outline-none text-black resize-none"
        style={{ whiteSpace: "pre-wrap", cursor: "text" }}
      />

      <div className="flex items-center gap-3 text-xs text-green-800 cursor-pointer relative">
        <FaBold
          onClick={() => {
            execFormat("bold");
            setTimeout(() => {
              const bold = document.queryCommandState("bold");
              setIsBoldActive(bold);
            }, 0);
          }}
          className={`cursor-pointer ${isBoldActive ? "bg-green-200 text-black" : "hover:text-black"}`}
          style={{ borderRadius: "4px", padding: "2px", fontSize: "medium" }}
        />
        <FaItalic
          onClick={() => {
            execFormat("italic");
            setTimeout(() => {
              const italic = document.queryCommandState("italic");
              setIsItalicActive(italic);
            }, 0);
          }}
          className={`cursor-pointer ${isItalicActive ? "bg-green-200 text-black" : "hover:text-black"}`}
          style={{ borderRadius: "4px", padding: "2px", fontSize: "medium" }}
        />
        <FaStrikethrough
          onClick={() => {
            execFormat("strikethrough");
            setTimeout(() => {
              const strike = document.queryCommandState("strikethrough");
              setIsStrikethroughActive(strike);
            }, 0);
          }}
          className={`cursor-pointer ${isStrikethroughActive ? "bg-green-200 text-black" : "hover:text-black"}`}
          style={{ borderRadius: "4px", padding: "2px", fontSize: "medium" }}
        />
        <FaRegSmile
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="cursor-pointer hover:text-black"
        />

        {showEmojiPicker && (
          <div
            className="absolute z-20 top-6 left-20 grid grid-cols-5 gap-1 bg-white border border-gray-300 rounded-md p-2 shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {emojiList.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleEmojiInsert(emoji)}
                className="text-xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <p className="ml-auto text-right text-[10px] text-gray-400">
          {characterCount}/{MAX_CHARS}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
