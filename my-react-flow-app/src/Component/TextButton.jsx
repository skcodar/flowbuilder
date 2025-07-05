import React, { useState } from "react";
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

const TextButtonsNode = ({ data }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);

  const addBlock = (type) => {
    setContentBlocks((prev) => [...prev, { type, id: Date.now() }]);
    setShowDropdown(false);
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case "quick":
        return (
          <div
            key={block.id}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2"
          >
            <FaReply className="shrink-0 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Quick Reply"
              className="flex-1 outline-none text-sm"
            />
          </div>
        );

      case "copy":
        return (
          <div
            key={block.id}
            className="flex items-center gap-2 rounded-md border border-gray-300 mt-2 bg-white px-2 py-2"
          >
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
            className="flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2">
            <FaPhoneAlt className="mt-1 shrink-0 text-sm text-gray-500" />
            <div className="flex flex-1 flex-col gap-1">
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
            className="flex gap-2 rounded-md border border-gray-300 mt-2 bg-white p-2"
          >
            <FaLink className="mt-1 shrink-0 text-sm text-gray-500" />
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

  return (
    <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500"
      />

      {/* Header */}
      <header className="relative flex items-center mb-1 justify-between px-3 py-2 shadow-lg">
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

        {/* Text area */}
         <div className="bg-[#EBF5F3] p-2">
        <div className="space-y-1 rounded-md border border-gray-300 bg-white p-2">
          <textarea
            placeholder="Body Text"
            className="h-24 w-full resize-none outline-none placeholder-gray-400"
          />
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <FaBold />
            <FaItalic />
            <FaStrikethrough />
            <FaRegSmile />
            <span className="ml-auto">(x)</span>
          </div>
        </div>

        {/* Render added blocks */}
        {contentBlocks.map(renderBlock)}

        {/* Add Content dropdown */}
        <div className="relative mt-2 ">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaThLarge className="text-[12px]" />
            Add Content
          </button>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-[#E4DFDF] bg-white shadow overflow-hidden ">
              <button
                onClick={() => addBlock("quick")}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-b border-[#E4DFDF] cursor-pointer"
              >
                <FaReply className="text-sm" />
                Quick Reply
              </button>
              <button
                onClick={() => addBlock("copy")}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-b border-[#E4DFDF] cursor-pointer"
              >
                <FaRegClone className="text-sm" />
                Copy Code
              </button>
              <button
                onClick={() => addBlock("url")}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-b border-[#E4DFDF] cursor-pointer"
              >
                <FaLink className="text-sm" />
                URL Button
              </button>
              <button
                onClick={() => addBlock("phone")}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100 border-[#E4DFDF] cursor-pointer"
              >
                <FaPhoneAlt className="text-sm" />
                Phone Number
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default TextButtonsNode;
