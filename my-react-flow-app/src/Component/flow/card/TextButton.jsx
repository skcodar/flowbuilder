import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FaTimes,
  FaLink,
  FaPhoneAlt,
  FaRegClone,
  FaReply,
  FaThLarge,
} from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import useCommanFunctions from "../component/useCommanFunction";
import TextArea from "../component/TextArea";


const TextButtonsNode = ({ data }) => {
   
  const {
    showDropdown,
    setShowDropdown,
    contentBlocks,
    addBlock,
    removeBlock,
    dropdownRef,

  } = useCommanFunctions();


  // Render dynamic content block
  const renderBlock = (block) => {
     var blockId = block.id;
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
                        <input type="text" name={`quick-${block.id}`}  placeholder="Quick Reply" className="flex-1 outline-none text-sm" />
                        <Handle type="source" id={`quick-${block.id}`} position={Position.Right} className="!w-2.5 !h-2.5 !bg-[#E4DFDF] !absolute top-[11px] !-translate-y-1/2" />
                    </div>
                </div>
            );
        case "copy":
            return (
                <div key={block.id} className="relative flex items-center gap-2 rounded-md border border-gray-300 mt-2 bg-white px-2 py-2">
                    {closeIcon}
                    <FaRegClone className="shrink-0 text-gray-500 text-sm" />
                    <input type="text" name="copyCode" placeholder="Copy Code" className="flex-1 outline-none text-sm" />
                </div>
            );
        case "phone":
            return (
                <div key={`phone-${blockId}`}  className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2">
                    {closeIcon}
                    <FaPhoneAlt className="mt-[10px] shrink-0 text-sm text-gray-500" />
                    <div className="flex flex-1 flex-col justify-center gap-1">
                        <input type="text" id={blockId} cardname="phone" name="phoneTitle" placeholder="Title" className="border-b border-gray-300 pb-[2px] outline-none" />
                        <input type="text" id={blockId} cardname="phone" name="phoneNo" placeholder="Number" className="outline-none" />
                    </div>
                </div>
            );
        case "url":
            return (
                <div key={`URL-${blockId}`} className="relative flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2">
                    {closeIcon}
                    <FaLink className="mt-[10px] shrink-0 text-sm text-gray-500" />
                    <div className="flex flex-1 flex-col gap-1">
                        <input type="text" id={blockId} cardname="URL" name="urlTitle" placeholder="Title" className="border-b border-gray-300 pb-[2px] outline-none" />
                        <input type="text" id={blockId} cardname="URL" name="url" placeholder="URL" className="outline-none" />
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
          <TextArea />

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
