import React from 'react';

export default function Sidebar() {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', 'default');
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="absolute top-0 left-0 w-[200px] h-screen p-5 bg-gray-50 border-r border-gray-300 z-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">CONTENTS</h4>
      
      <div
        draggable
        onDragStart={onDragStart}
        className="p-2 bg-white border border-gray-500 rounded cursor-grab text-center mt-2 shadow-sm hover:bg-gray-100 transition"
      >
        Node
      </div>
    </aside>
  );
}
