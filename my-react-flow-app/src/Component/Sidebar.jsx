import React from 'react';

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-[200px] h-screen p-5 bg-gray-50 border-r border-gray-300">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">CONTENTS</h4>

      {/* <div
        draggable
        onDragStart={(event) => onDragStart(event, 'customInput')}
        className="p-2 bg-white border border-gray-500 rounded cursor-grab text-center mt-2 shadow-sm hover:bg-gray-100 transition"
      >
        Custom Input Node
      </div> */}
      <div
        draggable
        onDragStart={(event) => onDragStart(event, 'textButton')}
        className="p-2 bg-white border border-gray-500 rounded cursor-grab text-center mt-2 shadow-sm hover:bg-gray-100 transition"
      >
        Custom Input Node
      </div>
    </aside>
  );
}
