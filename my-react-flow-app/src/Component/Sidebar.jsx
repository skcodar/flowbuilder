import React from 'react';

export default function Sidebar() {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', 'default');
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={sidebarStyle}>
      <h4>CONTENTS</h4>
      <div
        style={nodeStyle}
        draggable
        onDragStart={onDragStart}
      >
        Node
      </div>
    </aside>
  );
}

const sidebarStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 200,
  height: '100vh',
  padding: '20px 10px',
  background: '#f9f9f9',
  borderRight: '1px solid #ccc',
  zIndex: 50,
};

const nodeStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #888',
  borderRadius: '4px',
  cursor: 'grab',
  textAlign: 'center',
  marginTop: '10px',
};
