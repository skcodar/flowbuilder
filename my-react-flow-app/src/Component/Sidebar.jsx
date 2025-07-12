import React from 'react';
import { SidebarButton } from "./flow/component/Components";

export default function Sidebar() {
    return (
    <aside className="w-[200px] h-screen p-5 bg-gray-50 border-r border-gray-300">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">CONTENTS</h4>
      
      {/* <SidebarButton name="Custom input node" cardName="customInput"/> */}
      <SidebarButton name="Text +  Button"  cardName="textButton"/>
    </aside>
  );
}
