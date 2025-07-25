import React, { useState, useEffect, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaTimes, FaThLarge } from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import TextArea from "../component/TextArea";

const List = ({ data, id }) => {
  const [sections, setSections] = useState(data?.sections || []);
  const [header, setHeader] = useState(data?.header || "");
  const [footer, setFooter] = useState(data?.footer || "");
  const [buttonLabel, setButtonLabel] = useState(data?.buttonLabel || "");
  const [textAreaValue, setTextAreaValue] = useState(data?.textAreaValue || "");

  // ✅ Directly mutate `data` to ensure it's included in export
  useEffect(() => {
    data.sections = sections;
    data.header = header;
    data.footer = footer;
    data.buttonLabel = buttonLabel;
    data.textAreaValue = textAreaValue;
  }, [sections, header, footer, buttonLabel, textAreaValue]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), sectionTitle: "", rows: [] },
    ]);
  };

  const addRowToSection = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: [
                ...section.rows,
                { id: Date.now(), title: "", description: "" },
              ],
            }
          : section
      )
    );
  };

  const updateSectionTitle = (sectionId, title) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, sectionTitle: title } : section
      )
    );
  };

  const updateRow = (sectionId, rowId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.id === rowId ? { ...row, [field]: value } : row
              ),
            }
          : section
      )
    );
  };

  const removeRow = (sectionId, rowId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.filter((row) => row.id !== rowId),
            }
          : section
      )
    );
  };

  const removeSection = (sectionId) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const renderSection = (section) => (
    <div
      key={section.id}
      className="relative bg-white border border-gray-300 rounded-md p-2 mt-3"
    >
      <FaTimes
        onClick={() => removeSection(section.id)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700 cursor-pointer text-[14px]"
        title="Remove section"
      />
      <input
        type="text"
        placeholder="Section Title"
        value={section.sectionTitle}
        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
        className="w-full mb-2 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
      />

      {section.rows.map((row, index) => (
        <div
          key={row.id}
          className="relative flex items-center gap-2 rounded-md border border-gray-200 bg-white mt-2 px-2 py-2"
        >
          <span className="text-xs text-gray-500">{index + 1}</span>
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              placeholder="Title"
              value={row.title}
              onChange={(e) =>
                updateRow(section.id, row.id, "title", e.target.value)
              }
              className="border-b border-gray-300 pb-1 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={row.description}
              onChange={(e) =>
                updateRow(section.id, row.id, "description", e.target.value)
              }
              className="outline-none text-sm text-gray-500"
            />
          </div>
          <Handle
            type="source"
            id={`row-${row.id}`}
            position={Position.Right}
            className="!w-2.5 !h-2.5 !bg-[#E4DFDF] absolute top-[14px] right-[-6px]"
          />
          <FaTimes
            onClick={() => removeRow(section.id, row.id)}
            className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]"
            title="Remove row"
          />
        </div>
      ))}

      <button
        onClick={() => addRowToSection(section.id)}
        className="px-3 py-1 bg-gray-800 hover:bg-black text-white text-[12px] rounded mt-3 cursor-pointer"
      >
        Add row
      </button>
    </div>
  );

  return (
    <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />
      <CardHeader data={data} name="List" />

      <div className="p-2">
        <div className="bg-[#EBF5F3] p-2">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="w-full mb-2 rounded border border-gray-300 px-2 py-1 text-sm outline-none"
            />
            <TextArea
              onChange={(e) => setTextAreaValue(e.target.value)}
            />
            <input
              type="text"
              placeholder="Footer"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="w-full my-2 rounded border border-gray-300 px-2 py-1 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Button Label"
              value={buttonLabel}
              onChange={(e) => setButtonLabel(e.target.value)}
              className="w-full mb-2 rounded border border-gray-300 px-2 py-1 text-sm outline-none"
            />
          </div>

          {sections.map(renderSection)}

          <button
            onClick={addSection}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300 mt-3"
          >
            <FaThLarge className="text-[14px]" />
            Add section
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(List);
