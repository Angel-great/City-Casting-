"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import MetalSelector from "./MetalSelector";
import PolishingSelector from "./PolishingSelector";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { MOLD_TYPES } from "@/lib/constants";

export interface OrderItemData {
  styleName: string;
  imageUrl: string;
  imageFile?: File;
  metal: string;
  metals: string[];
  moldType: string;
  moldId: string;
  quantity: number;
  waxSize: string;
  polishingServices: string[];
  printType: string;
  fileUrl: string;
  fileFile?: File;
  fileType: string;
  cadEditNotes: string;
  notes: string;
}

interface OrderItemFormProps {
  orderType: string;
  index: number;
  item: OrderItemData;
  onChange: (index: number, item: OrderItemData) => void;
  onRemove: (index: number) => void;
  molds?: Array<{
    id: string;
    styleNumber: string;
    styleName?: string | null;
    imageUrl?: string | null;
    moldMaterial?: string | null;
  }>;
}

export function createEmptyItem(): OrderItemData {
  return {
    styleName: "",
    imageUrl: "",
    metal: "",
    metals: [],
    moldType: "",
    moldId: "",
    quantity: 1,
    waxSize: "",
    polishingServices: [],
    printType: "",
    fileUrl: "",
    fileType: "",
    cadEditNotes: "",
    notes: "",
  };
}

export default function OrderItemForm({
  orderType,
  index,
  item,
  onChange,
  onRemove,
  molds = [],
}: OrderItemFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    item.imageUrl || null
  );

  const onImageDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        const file = files[0];
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
        onChange(index, { ...item, imageFile: file, imageUrl: preview });
      }
    },
    [index, item, onChange]
  );

  const onFileDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        const file = files[0];
        const ext = file.name.split(".").pop()?.toUpperCase() || "";
        onChange(index, { ...item, fileFile: file, fileUrl: file.name, fileType: ext });
      }
    },
    [index, item, onChange]
  );

  const imageDropzone = useDropzone({
    onDrop: onImageDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
  });

  const fileDropzone = useDropzone({
    onDrop: onFileDrop,
    accept:
      orderType === "FILE_CAST" || orderType === "CAD_ORDER"
        ? {
            "model/stl": [".stl"],
            "application/octet-stream": [".3dm"],
            "application/pdf": [".pdf"],
            "image/*": [".jpg", ".jpeg", ".png"],
          }
        : { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
  });

  const updateField = (field: keyof OrderItemData, value: unknown) => {
    onChange(index, { ...item, [field]: value });
  };

  const showMoldSelector = orderType === "MAKE_MOLD";
  const showMoldSearch = orderType === "MOLD_CAST";
  const showFileUpload = orderType === "FILE_CAST" || orderType === "CAD_ORDER" || orderType === "CAD_EDIT";
  const showCastOptions =
    orderType !== "FINISHING" && orderType !== "QUOTE_REQUEST";
  const showQuantity =
    orderType === "MAKE_MOLD" ||
    orderType === "MOLD_CAST" ||
    orderType === "FILE_CAST" ||
    orderType === "CAD_ORDER";
  const showPrintType = orderType === "FILE_CAST" || orderType === "CAD_ORDER";
  const showCadEditNotes = orderType === "CAD_EDIT";
  const showPolishing = orderType !== "QUOTE_REQUEST";
  const showImage = orderType !== "FILE_CAST" && orderType !== "CAD_ORDER" && orderType !== "CAD_EDIT";

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Item #{index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo of Piece
            </label>
            <div
              {...imageDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                imageDropzone.isDragActive
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-300 hover:border-amber-400"
              }`}
            >
              <input {...imageDropzone.getInputProps()} />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover mx-auto rounded"
                />
              ) : (
                <div className="py-4">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Drop photo here or click to upload
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showFileUpload && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File{" "}
              {orderType === "FILE_CAST"
                ? "(STL, 3DM)"
                : "(PDF, Images)"}
            </label>
            <div
              {...fileDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                fileDropzone.isDragActive
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-300 hover:border-amber-400"
              }`}
            >
              <input {...fileDropzone.getInputProps()} />
              {item.fileUrl ? (
                <div className="py-2">
                  <svg
                    className="w-8 h-8 text-green-500 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium">
                    {item.fileUrl}
                  </p>
                  <p className="text-xs text-gray-500">{item.fileType}</p>
                </div>
              ) : (
                <div className="py-4">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <Input
          label="Style Name / Number"
          value={item.styleName}
          onChange={(e) => updateField("styleName", e.target.value)}
          placeholder="e.g., Classic Signet Ring"
        />

        {showMoldSelector && (
          <Select
            label="Mold Type"
            value={item.moldType}
            onChange={(e) => updateField("moldType", e.target.value)}
            options={MOLD_TYPES.map((t) => ({ value: t, label: t }))}
          />
        )}

        {showMoldSearch && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Mold
            </label>
            {molds.length > 0 ? (
              <select
                value={item.moldId}
                onChange={(e) => {
                  const mold = molds.find((m) => m.id === e.target.value);
                  updateField("moldId", e.target.value);
                  if (mold) {
                    updateField("styleName", mold.styleNumber);
                    if (mold.imageUrl) {
                      setImagePreview(mold.imageUrl);
                      updateField("imageUrl", mold.imageUrl);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a mold...</option>
                {molds.map((mold) => (
                  <option key={mold.id} value={mold.id}>
                    {mold.styleNumber}
                    {mold.styleName ? ` - ${mold.styleName}` : ""} (
                    {mold.moldMaterial})
                  </option>
                ))}
              </select>
            ) : (
              <Input
                value={item.styleName}
                onChange={(e) => updateField("styleName", e.target.value)}
                placeholder="Type style name or number"
              />
            )}
          </div>
        )}

        {showCastOptions && (
          <div className="md:col-span-2">
            <MetalSelector
              value={item.metals.length > 0 ? item.metals : item.metal ? [item.metal] : []}
              onChange={(metals) => {
                updateField("metals", metals);
                updateField("metal", metals[0] || "");
              }}
              multiple={
                orderType === "MAKE_MOLD" ||
                orderType === "MOLD_CAST" ||
                orderType === "FILE_CAST"
              }
            />
          </div>
        )}

        {showQuantity && (
          <Input
            label="Quantity"
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              updateField("quantity", parseInt(e.target.value) || 1)
            }
          />
        )}

        <Input
          label="Wax Size"
          value={item.waxSize}
          onChange={(e) => updateField("waxSize", e.target.value)}
          placeholder="e.g., 7, 8.5 (optional)"
        />

        {showPrintType && (
          <Select
            label="Print Type"
            value={item.printType}
            onChange={(e) => updateField("printType", e.target.value)}
            options={[
              { value: "CASTABLE", label: "Castable Prints" },
              { value: "RESIN_PLASTIC", label: "Resin Plastic (Not Castable)" },
            ]}
          />
        )}

        {showPolishing && (
          <div className="md:col-span-2">
            <PolishingSelector
              value={item.polishingServices}
              onChange={(services) =>
                updateField("polishingServices", services)
              }
            />
          </div>
        )}

        {showCadEditNotes && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CAD Edit Instructions
            </label>
            <textarea
              value={item.cadEditNotes}
              onChange={(e) => updateField("cadEditNotes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Describe the changes needed..."
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions / Notes
          </label>
          <textarea
            value={item.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Any additional instructions..."
          />
        </div>
      </div>
    </div>
  );
}
