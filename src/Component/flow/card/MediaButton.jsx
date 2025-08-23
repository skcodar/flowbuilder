import React, { useState, useEffect, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaTimes, FaThLarge, FaReply, FaLink } from "react-icons/fa";
import CardHeader from "../component/CardHeader";
import TextArea from "../component/TextArea";
import { generateRandom12DigitKey } from "../component/useCommanFunction";

const MediaButton = ({ data }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [sections, setSections] = useState(data?.sections || []);
    const [uploadedFiles, setUploadedFiles] = useState(data?.uploadedFiles || []);
    const [textAreaValue, setTextAreaValue] = useState(data?.textAreaValue || "");

    useEffect(() => {
        data.sections = sections;
        data.uploadedFiles = uploadedFiles;
        data.textAreaValue = textAreaValue;
    }, [sections, uploadedFiles, textAreaValue]);

    // ✅ Add section
    const addSection = (type) => {
        const newSection = { id: generateRandom12DigitKey(), type, values: {} };
        setSections((prev) =>
            type === "quick" ? [newSection, ...prev] : [...prev, newSection]
        );
    };

    // ✅ Remove section
    const removeSection = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    // ✅ Update input values
    const updateField = (id, field, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, values: { ...s.values, [field]: value } } : s
            )
        );
    };

   
    const renderSection = (section) => {
        const { id, type, values } = section;
        const commonInputProps = { className: "outline-none text-sm w-full" };

        switch (type) {
            case "quick":
                return (
                    <div
                        key={id}
                        className="relative flex items-center gap-2 rounded-md border border-gray-300 bg-white mt-2 px-2 py-2"
                    >
                        <FaReply className="text-gray-500 text-sm shrink-0" />
                        <FaTimes
                            onClick={() => removeSection(id)}
                            className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]"
                        />
                        <input
                            type="text"
                            placeholder="Quick Reply"
                            value={values.quick || ""}
                            onChange={(e) => updateField(id, "quick", e.target.value)}
                            {...commonInputProps}
                        />
                        <Handle
                            type="source"
                            id={`${id}`}
                            position={Position.Right}
                            className="!w-2.5 !h-2.5 !bg-[#E4DFDF] absolute top-[20px]"
                        />
                    </div>
                );

            case "url":
                return (
                    <div
                        key={id}
                        className="relative flex gap-2 rounded-md border border-gray-300 bg-white mt-2 p-2"
                    >
                        <FaLink className="mt-[10px] text-sm text-gray-500" />
                        <FaTimes
                            onClick={() => removeSection(id)}
                            className="absolute top-1 right-1 text-green-800 hover:text-red-500 cursor-pointer text-[13px]"
                        />
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

            default:
                return null;
        }
    };

    // ✅ Limits
    const quickCount = sections.filter((s) => s.type === "quick").length;
    const urlCount = sections.filter((s) => s.type === "url").length;

    return (
        <div className="relative w-[260px] rounded-md border border-gray-200 bg-white shadow-lg text-[13px]">
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-[#E4DFDF]"
            />
            <CardHeader data={data} name="Media Button" />

            {/* Upload */}
            <div className="p-2">
                {uploadedFiles.length === 0 ? (
                    <label className="flex flex-col items-center justify-center gap-2 h-[60px] w-full rounded-md bg-[#EDF5F2] cursor-pointer border-2 border-dashed border-green-300 hover:bg-green-50">
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const fileKey = file.name + file.size;
                                const alreadyExists = uploadedFiles.some(
                                    (f) => f.file.name + f.file.size === fileKey
                                );
                                if (!alreadyExists) {
                                    const newFile = { file, url: URL.createObjectURL(file) };
                                    setUploadedFiles([newFile]);
                                }
                            }}
                            className="hidden"
                        />
                        <div className="text-green-700 text-xs">Upload file</div>
                    </label>
                ) : (
                    <div className="relative flex items-center justify-between rounded-md border p-2 bg-white">
                        <span className="text-sm truncate">
                            {uploadedFiles[0].file.name}
                        </span>
                        <FaTimes
                            onClick={() => setUploadedFiles([])}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-2">
                <div className="bg-[#EBF5F3] p-2">
                    <TextArea
                        value={data.plainText || ""}
                        onChange={(val) => (data.plainText = val)}
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
                            <div className="absolute left-full top-0 ml-2 mt-[-80px] w-48 rounded-md border border-[#E4DFDF] bg-white shadow overflow-hidden z-10">
                                {/* Quick Reply (max 3, disabled if URL exists) */}
                                <button
                                    onClick={() => {
                                        if (quickCount < 3 && urlCount === 0) {
                                            addSection("quick");
                                            setShowDropdown(false);
                                        }
                                    }}
                                    disabled={quickCount >= 3 || urlCount > 0}
                                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-[#E4DFDF] ${
                                        quickCount >= 3 || urlCount > 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    <FaReply className="text-sm mr-3" />
                                    Quick Reply
                                </button>

                                {/* URL (max 1, disabled if Quick Replies exist) */}
                                <button
                                    onClick={() => {
                                        if (urlCount < 1 && quickCount === 0) {
                                            addSection("url");
                                            setShowDropdown(false);
                                        }
                                    }}
                                    disabled={urlCount >= 1 || quickCount > 0}
                                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm ${
                                        urlCount >= 1 || quickCount > 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    <FaLink className="text-sm mr-3" />
                                    URL Button
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(MediaButton);
