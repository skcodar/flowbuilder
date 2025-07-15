import React, { memo,useState,useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import {
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
import CardHeader from "../component/CardHeader";
import useCommanFunctions from "../component/useCommanFunction";



const TextButtonsNode = ({ data }) => {

  const {
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
    editorRef,
    dropdownRef,
    handleInput,
    execFormat,
    insertEmoji,
    MAX_CHARS,
    emojiList,

  } = useCommanFunctions();
    const [isBoldActive, setIsBoldActive] = useState(false);
    const [isItalicActive, setIsItalicActive] = useState(false);

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

  

  // Render dynamic content block
  const renderBlock = (block) => {
    const closeIcon = (
      <FaTimes
        onClick={() => removeBlock(block.id)}
        className="absolute top-3 right-3 text-green-800 hover:text-red-500 cursor-pointer text-[13px]"
      />
    );

    switch (block.type) {
      case "quick":
        return (
          <div key={block.id} className="relative flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2">
            <FaReply className="shrink-0 text-gray-500 text-sm" />
            {closeIcon}
            <div>
              <input type="text" placeholder="Quick Reply" className="flex-1 outline-none text-sm" />
              <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-[#E4DFDF] !absolute top-[11px] !-translate-y-1/2" />
            </div>
          </div>
        );
      case "copy":
        return (
          <div key={block.id} className="relative flex items-center gap-2 rounded-md border border-gray-300 mt-2 bg-white px-2 py-2">
            {closeIcon}
            <FaRegClone className="shrink-0 text-gray-500 text-sm" />
            <input type="text" placeholder="Copy Code" className="flex-1 outline-none text-sm" />
          </div>
        );
      case "phone":
        return (
          <div key={block.id} className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2">
            {closeIcon}
            <FaPhoneAlt className="mt-[10px] shrink-0 text-sm text-gray-500" />
            <div className="flex flex-1 flex-col justify-center gap-1">
              <input type="text" placeholder="Title" className="border-b border-gray-300 pb-[2px] outline-none" />
              <input type="text" placeholder="Number" className="outline-none" />
            </div>
          </div>
        );
      case "url":
        return (
          <div key={block.id} className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2">
            {closeIcon}
            <FaLink className="mt-[10px] shrink-0 text-sm text-gray-500" />
            <div className="flex flex-1 flex-col gap-1">
              <input type="text" placeholder="Title" className="border-b border-gray-300 pb-[2px] outline-none" />
              <input type="text" placeholder="URL" className="outline-none" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Disable duplicate block types
  const hasPhoneBlock = contentBlocks.some((block) => block.type === "phone");
  const hasCopyBlock = contentBlocks.some((block) => block.type === "copy");

  return (
    <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
      {/* Handle for connection (left) */}
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />

      {/* Header */}
      < CardHeader data={data} name="Text Button" />


      {/* Body Content */}
      <div className="p-2">
        <div className="bg-[#EBF5F3] p-2">
          <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
            {/* ContentEditable Editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`min-h-[96px] w-full rounded p-1 text-sm outline-none ${html === "" && !isFocused ? "text-gray-400" : "text-black"
                }`}
              style={{ whiteSpace: "pre-wrap", cursor: "text" }}
            >
              {html === "" && !isFocused ? "Type something..." : null}
            </div>

            {/* Formatting + Emoji + Character Count */}
            <div className="flex items-center gap-3 text-xs text-green-800 cursor-pointer relative">
              <FaBold
                onClick={() => {
                  document.execCommand("bold");
                  setIsBoldActive(prev => !prev);
                }}
                className={`cursor-pointer ${isBoldActive ? "bg-green-200 text-black" : "hover:text-black"}`}
                style={{ borderRadius: "4px", padding: "2px",fontSize:'medium' }}
              />
              <FaItalic
              onClick={() => {
                document.execCommand("italic");
                setIsItalicActive(prev => !prev);
              }}
              className={`cursor-pointer ${isItalicActive ? "bg-green-200 text-black" : "hover:text-black"}`}
              style={{ borderRadius: "4px", padding: "2px",fontSize:'medium' }}
            />
              <FaStrikethrough />
              <FaRegSmile onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer hover:text-black" />

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

              {/* ✅ Fixed Character Count Display */}
              <p className="ml-auto text-right text-[10px] text-gray-400">
                {characterCount}/{MAX_CHARS}
              </p>
            </div>
          </div>

          {/* Render Blocks */}
          {contentBlocks.map(renderBlock)}

          {/* Add Content Dropdown */}
          <div className="relative mt-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaThLarge className="text-[14px]" />
              Add Content
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute left-full top-0 ml-2 mt-[-145px] w-48 rounded-md border border-[#E4DFDF] bg-white shadow overflow-hidden z-10"
                // onMouseDown={(e) => e.preventDefault()}
              >
                <button
                  onClick={() => addBlock("quick")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 border-b border-[#E4DFDF]"
                >
                  <FaReply className="text-sm mr-3" />
                  Quick Reply
                </button>
                <button
                  onClick={() => addBlock("copy")}
                  disabled={hasCopyBlock}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm border-b border-[#E4DFDF] ${hasCopyBlock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                    }`}
                >
                  <FaRegClone className="text-sm mr-3" />
                  Copy Code
                </button>
                <button
                  onClick={() => addBlock("url")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 border-b border-[#E4DFDF]"
                >
                  <FaLink className="text-sm mr-3" />
                  URL Button
                </button>
                <button
                  onClick={() => addBlock("phone")}
                  disabled={hasPhoneBlock}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm ${hasPhoneBlock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
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
