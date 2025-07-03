import React, { useState } from 'react';
import { Handle } from '@xyflow/react';
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
    <div className="w-[200px] rounded-md   border border-gray-200 relative">
      {/* Header */}
      <div className="w-full flex rounded-md mb-1 bg-white shadow-lg  relative">
        <div className="absolute h-full top-0 left-0 w-[7px] bg-green-500 rounded-l-md" />
        <div className="w-full flex items-center justify-between px-2 py-1 bg-[#fffff]">
          <div className="bg-green-100 text-green-600 p-1 p-x ml-2 rounded-full">
            <FaRocket className="text-sm" />
          </div>
          <span className="text-[11px]  font-semibold text-green-700">Flow Start</span>
          <button className="text-green-600 hover:text-red-500 cursor-pointer">
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        <div className="bg-[#EBF5F3] p-2">
          <div className="space-y-1 mb-[2px]">
            {keywords.map((word, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-green-400 text-green-800 rounded p-[6px] text-[8px] bg-white"
              >
                <span>{word}</span>
                <button
                  className="hover:text-red-600 cursor-pointer"
                  onClick={() => handleRemove(index)}
                >
                  <FaTimes className="text-xs text-[8px]" />
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
            className="w-full border border-green-400 rounded p-[6px] text-[8px] placeholder-gray-500 text-green-700 focus:outline-none focus:ring-1 focus:ring-green-400  bg-white"
          />

          {/* Button */}
          <button className="w-full border border-green-500 text-[8px] text-green-500 rounded p-1 hover:bg-green-50 bg-white transition mt-5">
            Choose template
          </button>

          {/* Handle */}
          <Handle type="source" position="bottom" className="w-3 h-3 bg-green-500" />
        </div>
      </div>
    </div>
  );
};

export default FlowStartNode;
