import React, { useState, useEffect, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
    FaTimes,
    FaThLarge,
    FaReply,
    FaRegClone,
    FaLink,
    FaPhoneAlt,
} from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import TextArea from "../component/TextArea";

const TextButton = ({ data }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [sections, setSections] = useState(data?.sections || []);
    const [textAreaValue, setTextAreaValue] = useState(data?.textAreaValue || "");

    useEffect(() => {
        data.sections = sections;
        data.textAreaValue = textAreaValue;
    }, [sections, textAreaValue]);

    const addSection = (type) => {
        const newSection = { id: Date.now(), type, values: {} };

        setSections((prev) =>
            type === "quick"
                ? [newSection, ...prev] // ✅ add quick reply at the top
                : [...prev, newSection] 
        );
    };

    const removeSection = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    const updateField = (id, field, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, values: { ...s.values, [field]: value } } : s
            )
        );
    };
    //  DropDown List add
    const renderSection = (section) => {
        const { id, type, values } = section;
        const commonInputProps = {
            className: "outline-none text-sm w-full",
        };

        switch (type) {
            case "quick":
                return (
                    <div key={id} className="relative flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2">
                        <FaReply className="text-gray-500 text-sm shrink-0" />
                        <FaTimes onClick={() => removeSection(id)} className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]" />
                        <input
                            type="text"
                            placeholder="Quick Reply"
                            value={values.quick || ""}
                            onChange={(e) => updateField(id, "quick", e.target.value)}
                            {...commonInputProps}
                        />
                        <Handle type="source" id={`quick-${id}`} position={Position.Right} className="!w-2.5 !h-2.5 !bg-[#E4DFDF] absolute top-[20px] " />
                    </div>
                );
            case "copy":
                return (
                    <div key={id} className="relative flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2">
                        <FaRegClone className="text-gray-500 text-sm shrink-0" />
                        <FaTimes onClick={() => removeSection(id)} className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]" />
                        <input
                            type="text"
                            placeholder="Copy Code"
                            value={values.copy || ""}
                            onChange={(e) => updateField(id, "copy", e.target.value)}
                            {...commonInputProps}
                        />
                    </div>
                );
            case "url":
                return (
                    <div key={id} className="relative flex gap-2 rounded-md border border-gray-300 bg-white mt-2 p-2">
                        <FaLink className="mt-[10px] text-sm text-gray-500" />
                        <FaTimes onClick={() => removeSection(id)} className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]" />
                        <div className="flex flex-1 flex-col gap-1">
                            <input
                                type="text"
                                placeholder="Title"
                                value={values.urlTitle || ""}
                                onChange={(e) => updateField(id, "urlTitle", e.target.value)}
                                className="border-b border-gray-300 pb-[2px] outline-none"
                            />
                            <input
                                type="text"
                                placeholder="URL"
                                value={values.url || ""}
                                onChange={(e) => updateField(id, "url", e.target.value)}
                                className="outline-none"
                            />
                        </div>
                    </div>
                );
            case "phone":
                return (
                    <div key={id} className="relative flex gap-2 rounded-md border border-gray-300 bg-white mt-2 p-2">
                        <FaPhoneAlt className="mt-[10px] text-sm text-gray-500" />
                        <FaTimes onClick={() => removeSection(id)} className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]" />
                        <div className="flex flex-1 flex-col gap-1">
                            <input
                                type="text"
                                placeholder="Title"
                                value={values.phoneTitle || ""}
                                onChange={(e) => updateField(id, "phoneTitle", e.target.value)}
                                className="border-b border-gray-300 pb-[2px] outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Number"
                                value={values.phoneNo || ""}
                                onChange={(e) => updateField(id, "phoneNo", e.target.value)}
                                className="outline-none"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const hasSection = (type) => sections.some((s) => s.type === type);
    const urlCount = sections.filter((s) => s.type === "url").length;

    return (
        <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
            <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#E4DFDF]" />
            <CardHeader data={data} name="Text Button" />

            {/* Body */}
            <div className="p-2">
                <div className="bg-[#EBF5F3] p-2">
                    <TextArea
                        value={textAreaValue}
                        onChange={(e) => setTextAreaValue(e.target.value)}
                    />
                    {sections.map(renderSection)}

                    {/* Add Content Dropdown */}
                    <div className="relative mt-2">
                        <button
                            onClick={() => setShowDropdown((prev) => !prev)}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 py-2 text-[12px] font-medium text-gray-700 cursor-pointer hover:bg-gray-300"
                        >
                            <FaThLarge className="text-[14px]" />
                            Add Content
                        </button>

                        {showDropdown && (
                            <div className="absolute left-full top-0 ml-2 mt-[-145px] w-48 rounded-md border border-[#E4DFDF] bg-white shadow overflow-hidden z-10">
                                <button
                                    onClick={() => {
                                        addSection("quick");
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 border-b border-[#E4DFDF]"
                                >
                                    <FaReply className="text-sm mr-3" />
                                    Quick Reply
                                </button>
                                <button
                                    onClick={() => {
                                        if (!hasSection("copy")) {
                                            addSection("copy");
                                            setShowDropdown(false);
                                        }
                                    }}
                                    disabled={hasSection("copy")}
                                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#E4DFDF] ${hasSection("copy")
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <FaRegClone className="text-sm mr-3" />
                                    Copy Code
                                </button>
                                <button
                                    onClick={() => {

                                        if (urlCount < 2) {
                                            addSection("url");
                                            setShowDropdown(false);
                                        }
                                    }}
                                    disabled={sections.filter((s) => s.type === "url").length >= 2}
                                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#E4DFDF] ${sections.filter((s) => s.type === "url").length >= 2
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    <FaLink className="text-sm mr-3" />
                                    URL
                                </button>
                                <button
                                    onClick={() => {
                                        if (!hasSection("phone")) {
                                            addSection("phone");
                                            setShowDropdown(false);
                                        }
                                    }}
                                    disabled={hasSection("phone")}
                                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm ${hasSection("phone")
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <FaPhoneAlt className="text-sm mr-3" />
                                    Phone Number
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default memo(TextButton);
