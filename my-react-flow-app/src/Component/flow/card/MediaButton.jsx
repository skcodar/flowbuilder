import React, { memo } from "react";
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

const MediaButton = ({ data }) => {
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
        isBoldActive, 
        setIsBoldActive,
        isItalicActive, 
        setIsItalicActive,
    } = useCommanFunctions();


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

    const hasPhoneBlock = contentBlocks.some((block) => block.type === "phone");
    const hasCopyBlock = contentBlocks.some((block) => block.type === "copy");

    return (
        <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
            <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />

            <CardHeader data={data} name="Media Button" />

            {/* 📦 Upload Area (Multiple File Uploads) */}
            <div className="p-2">
                <label className="flex flex-col items-center justify-center gap-2 h-[60px] w-full rounded-md bg-[#EDF5F2] cursor-pointer border-2 border-dashed border-green-300 hover:bg-green-50 transition text-center">
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const newFiles = files.map((file) => ({
                                file,
                                url: URL.createObjectURL(file),
                            }));
                            setUploadedFiles((prev) => [...prev, ...newFiles]);
                            e.target.value = null; // reset input so same file can be selected again
                        }}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 flex flex-col items-center justify-center text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64 64"
                                fill="none"
                                stroke="green"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-7 h-7"
                            >
                                <path d="M3 20V52C3 54.2091 4.79086 56 7 56H57C59.2091 56 61 54.2091 61 52V20C61 17.7909 59.2091 16 57 16H28L24 12H7C4.79086 12 3 13.7909 3 16V20Z" />
                                <path d="M32 44V28" />
                                <path d="M24 36L32 28L40 36" />
                            </svg>
                            <p className="text-green-700 text-xs font-medium">Upload file</p>
                        </div>
                    </div>
                </label>

                {/* Uploaded files list */}
                {uploadedFiles.map((item, index) => (
                    <div
                        key={index}
                        className="relative mt-2 rounded-md border border-gray-200 bg-white p-3"
                    >
                        <button
                            onClick={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter((_, i) => i !== index)
                                );
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 cursor-pointer hover:text-red-500 shadow"
                        >
                            <FaTimes size={12} />
                        </button>

                        {item.file.type.startsWith("image/") ? (
                            <img
                                src={item.url}
                                alt="preview"
                                className="w-full h-36 object-cover rounded-md"
                            />
                        ) : (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm">
                                    📎
                                </div>
                                <div className="text-sm text-blue-800 truncate max-w-[180px]">
                                    {item.file.name}
                                </div>
                            </a>
                        )}
                    </div>
                ))}
            </div>



            {/* ✏️ Body */}
            <div className="p-2">
                <div className="bg-[#EBF5F3] p-2">
                    <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={handleInput}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className={`min-h-[96px] w-full rounded p-1 text-sm outline-none ${html === "" && !isFocused ? "text-gray-400" : "text-black"}`}
                            style={{ whiteSpace: "pre-wrap", cursor: "text" }}
                        >
                            {html === "" && !isFocused ? "Type something..." : null}
                        </div>

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

                            <p className="ml-auto text-right text-[10px] text-gray-400">{characterCount}/{MAX_CHARS}</p>
                        </div>
                    </div>

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
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm border-b border-[#E4DFDF] ${hasCopyBlock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
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
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm ${hasPhoneBlock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
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

export default memo(MediaButton);
