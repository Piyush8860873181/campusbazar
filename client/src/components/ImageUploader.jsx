// components/ImageUploader.jsx - Upload up to 4 photos with preview & removal
import React, { useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../utils/formatters';

const ImageUploader = ({
  images = [],
  onChange,
  existingImages = [],
  onRemoveExisting,
  maxFiles = 4,
}) => {
  const fileInputRef = useRef(null);

  const totalCount = existingImages.length + images.length;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // Remaining slots
    const availableSlots = maxFiles - totalCount;
    if (availableSlots <= 0) {
      alert(`You can upload at most ${maxFiles} images.`);
      return;
    }

    // Filter valid image files and check size limit (5MB)
    const validFiles = [];
    for (const file of files.slice(0, availableSlots)) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }

    // Reset file input value so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNew = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Upload clear photos (book cover, condition, pages)</span>
        <span className="font-semibold">{totalCount} of {maxFiles} images</span>
      </div>

      {/* Grid of Preview Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Existing Server Images (when editing) */}
        {existingImages.map((imgUrl, idx) => (
          <div
            key={`existing-${idx}`}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-900 bg-slate-100 dark:bg-slate-900 group"
          >
            <img
              src={getImageUrl(imgUrl)}
              alt={`Existing preview ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
              Saved
            </span>
          </div>
        ))}

        {/* 2. Newly Added File Images */}
        {images.map((file, idx) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div
              key={`new-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-500/60 bg-slate-100 dark:bg-slate-900 group"
            >
              <img
                src={previewUrl}
                alt={`New preview ${idx + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
              <button
                type="button"
                onClick={() => handleRemoveNew(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                New
              </span>
            </div>
          );
        })}

        {/* 3. Add Photo Button */}
        {totalCount < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
          >
            <UploadCloud className="w-6 h-6 mb-1 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-xs font-semibold">+ Add Photo</span>
            <span className="text-[10px] text-slate-400">Up to 5MB</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
