import React from 'react';
import { SidebarButton } from "./flow/component/Components";

export default function Sidebar() {
    return (
    <aside className="w-[200px] h-screen p-5 bg-gray-50 border-r border-gray-300">
      <h4 className="text-[18px] text-center font-semibold text-green-600 mb-3">CONTENTS</h4>
      
      <SidebarButton name="Text +  Button"  cardName="textButton"/>
      <SidebarButton name="Media + Button" cardName="mediaButton"/>
      <SidebarButton name="List" cardName="list"/>
    </aside>
  );
}
