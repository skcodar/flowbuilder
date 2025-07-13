import React from 'react';
import {
  FaRocket,
  FaTimes,

} from "react-icons/fa";

export default function CardHeader({data , name}) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <header className="drag-handle__custom cursor-move relative flex items-center mb-1 justify-between px-3 py-2 shadow-lg">
            <span className="absolute left-0 top-0 h-full w-[6px] rounded-l-md bg-green-600" />
            <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-100 p-[6px] text-green-600">
                    <FaRocket className="text-[17px]" />
                </span>
                <span className="text-[16px] font-semibold text-green-700">{name}</span>
            </div>
            <button onClick={data?.onDelete} className="text-green-600 transition hover:text-red-500 cursor-pointer">
                <FaTimes className="text-[15px]" />
            </button>
        </header>
    )
}