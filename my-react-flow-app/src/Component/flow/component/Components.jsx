import React from 'react';

function SidebarButton({ name }) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            draggable
            onDragStart={(event) => onDragStart(event, 'textButton')}
            className="p-2 bg-white border border-gray-500 rounded cursor-grab text-center mt-2 shadow-sm hover:bg-gray-100 transition"
        >
            {name}
        </div>
    )
}


export { SidebarButton };