import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
    FaThLarge,
    FaBold,
    FaItalic,
    FaStrikethrough,
    FaRegSmile,
} from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import useCommanFunctions from "../component/useCommanFunction";

const List = ({ data }) => {
    const {
        showEmojiPicker,
        setShowEmojiPicker,
        isFocused,
        setIsFocused,
        html,
        setHtml,
        characterCount,
        setCharacterCount,
        editorRef,
        handleInput,
        execFormat,
        insertEmoji,
        MAX_CHARS,
        emojiList,
    } = useCommanFunctions();

    return (
        <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
            {/* Handle for connection (left) */}
            <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />

            {/* Header */}
            <CardHeader data={data} name="List" />

            {/* Body Content */}
            <div className="p-2">
                <div className="bg-[#EBF5F3] p-2">
                    <input
                        type="text"
                        placeholder="Header"
                        className="w-full mb-2 flex items-center justify-between font-medium border border-gray-300 text-gray-800 rounded px-2 py-1 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
                    />
                    <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
                        {/* ContentEditable Editor */}
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

                        {/* Formatting + Emoji + Character Count */}
                        <div className="flex items-center gap-3 text-xs text-green-800 cursor-pointer relative">
                            <FaBold onClick={() => execFormat("bold")} className="hover:text-black cursor-pointer" />
                            <FaItalic onClick={() => execFormat("italic")} className="hover:text-black cursor-pointer" />
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

                            {/* Character Count */}
                            <p className="ml-auto text-right text-[10px] text-gray-400">
                                {characterCount}/{MAX_CHARS}
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-2">
                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
                        >
                            <FaThLarge className="text-[12px]" />
                            Add Content
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(List);
