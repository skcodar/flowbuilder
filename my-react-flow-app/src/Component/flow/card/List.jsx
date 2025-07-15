import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
    FaTimes,
    FaBold,
    FaItalic,
    FaStrikethrough,
    FaRegSmile,
    FaThLarge,
    FaPlusSquare,
} from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import useCommanFunctions from "../component/useCommanFunction";

const List = ({ data }) => {
    const {
        showEmojiPicker,
        setShowEmojiPicker,
        isFocused,
        setIsFocused,
        characterCount,
        editorRef,
        handleInput,
        execFormat,
        insertEmoji,
        html,
        MAX_CHARS,
        emojiList,
        sections,
        addSection,
        addRow,
        updateRow,
        updateSectionTitle,
        removeRow,
        removeSection,
    } = useCommanFunctions();

     const [isBoldActive, setIsBoldActive] = useState(false);
        const [isItalicActive, setIsItalicActive] = useState(false);
    
        //  Show Active On Bolde And italic
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

    return (
        <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
            <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />

            <CardHeader data={data} name="List" />

            <div className="p-2">
                <div className="bg-[#EBF5F3] p-2">
                    {/* Header */}
                    <div className="relative flex items-center rounded-md border border-gray-300  bg-white mb-2 px-2 py-2">
                       <input type="text" placeholder="Header" className="flex-1  outline-none text-sm" />
                    </div>

                    {/* Editor */}
                    <div className="space-y-1 mb-2 rounded-md border border-gray-300 bg-white p-2">
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
                                style={{ borderRadius: "4px", padding: "2px", fontSize: 'medium' }}
                            />
                            <FaItalic
                                onClick={() => {
                                    document.execCommand("italic");
                                    setIsItalicActive(prev => !prev);
                                }}
                                className={`cursor-pointer ${isItalicActive ? "bg-green-200 text-black" : "hover:text-black"}`}
                                style={{ borderRadius: "4px", padding: "2px", fontSize: 'medium' }}
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
                            <p className="ml-auto text-right text-[10px] text-gray-400">
                                {characterCount}/{MAX_CHARS}
                            </p>
                        </div>
                    </div>

                    <div className="relative flex items-center rounded-md border border-gray-300  bg-white mb-2 px-2 py-2">
                       <input type="text" placeholder="Footer" className="flex-1  outline-none text-sm" />
                    </div>  
                    <div className="relative flex items-center rounded-md border border-gray-300  bg-white mb-4 px-2 py-2">
                       <input type="text" placeholder="Button Lable" className="flex-1  outline-none text-sm" />
                    </div>  
                      

                    {/* Sections */}
                    {sections.map((section, sectionIndex) => (
                        <div key={section.id} className="relative bg-[#EBF5F3] mb-3 rounded-md">
                            {/* Remove Section Button */}
                            <FaTimes
                                onClick={() => removeSection(sectionIndex)}
                                className="absolute text-[13px] top-[-5px] right-[-5px] text-green-800 hover:text-red-500 cursor-pointer"
                                title="Remove section"
                            />

                            {/* Section Title */}
                            <input
                                type="text"
                                placeholder="Section title"
                                value={section.sectionTitle}
                                onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                                className="w-full mb-2 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
                            />

                            {/* Rows */}
                            {section.rows.map((row, rowIndex) => (
                                <div key={row.id} className="flex border border-gray-300 bg-white rounded text-sm mb-2">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex gap-2 w-full px-2">
                                            <span className="flex items-center justify-center text-center text-gray-700 font-medium w-3">
                                                {rowIndex + 1}
                                            </span>

                                            <div className="w-full relative">
                                                <Handle
                                                    id={`row-${row.id}-source`}
                                                    type="source"
                                                    position={Position.Right}
                                                    className="!w-2 !h-2 !bg-[#E4DFDF] absolute mr-[-7px]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    value={row.title}
                                                    onChange={(e) =>
                                                        updateRow(sectionIndex, rowIndex, "title", e.target.value)
                                                    }
                                                    className="w-full border-b border-gray-300 outline-none py-1 pr-4"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Description (Optional)"
                                                    value={row.description}
                                                    onChange={(e) =>
                                                        updateRow(sectionIndex, rowIndex, "description", e.target.value)
                                                    }
                                                    className="w-full outline-none text-gray-500 py-1 "
                                                />
                                            </div>

                                        </div>
                                       
                                            <FaTimes
                                                onClick={() => removeRow(sectionIndex, row.id)}
                                                className="absolute right-[10px] mt-[-35px] text-green-800 hover:text-red-500 cursor-pointer ml-2"
                                            />
                                       
                                    </div>
                                </div>
                            ))}


                            {/* Add Row */}
                            <button
                                onClick={() => addRow(sectionIndex)}
                                className="px-3 py-1 bg-gray-800 hover:bg-black text-white text-[12px] rounded mt-[5px] cursor-pointer"
                            >
                                Add row
                            </button>
                        </div>
                    ))}

                    {/* Add Section */}
                    <button
                        onClick={addSection}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
                    >
                        <FaPlusSquare className="text-[14px]" />
                        Add Section
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(List);
