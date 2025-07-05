import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FaRocket, FaTimes } from 'react-icons/fa';

const FlowStartNode = () => {
  const [keywords, setKeywords] = useState(['Hii', 'Hi', 'Hello']);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setKeywords((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (indexToRemove) => {
    setKeywords((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500"
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-3 py-2 shadow-lg">
        <span className="absolute left-0 top-0 h-full w-[6px] rounded-l-md bg-green-600" />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 p-[6px] text-green-600">
            <FaRocket className="text-[17px]" />
          </span>
          <span className="text-[16px] font-semibold text-green-700">
            Fow Start
          </span>
        </div>
        <button className="text-green-600 hover:text-red-500 cursor-pointer">
          <FaTimes className="text-[15px]" />
        </button>
      </header>

      {/* Content */}
      <div className='p-2'>
        <div className="p-2 bg-[#EBF5F3]">
          {/* Keyword List */}
          <div className="space-y-2 mb-2">
            {keywords.map((word, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-300 text-green-800 rounded px-2 py-1 text-[12px] bg-white"
              >
                <span>{word}</span>
                <button
                  className="hover:text-red-600 cursor-pointer"
                  onClick={() => handleRemove(index)}
                >
                  <FaTimes className="text-[13px]" />
                </button>
              </div>
            ))}
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your keyword"
            className="w-full border border-gray-300 rounded px-2 py-1 text-[12px] placeholder-gray-500 text-green-700 focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
          />

          {/* Choose Template Button */}
          <button className="w-full mt-4 border border-gray-300 text-[12px] text-gray-700 rounded px-2 py-2 bg-white hover:bg-green-50 transition">
            Choose template
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowStartNode;
