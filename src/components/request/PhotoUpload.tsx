import React, { useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PRESET_MOCK_PHOTOS } from '../../constants';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  photos, 
  onChange, 
  maxPhotos = 4 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange([...photos, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPreset = (url: string) => {
    if (photos.length >= maxPhotos) return;
    if (photos.includes(url)) return;
    onChange([...photos, url]);
  };

  const handleRemove = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onClick={() => photos.length < maxPhotos && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
          photos.length < maxPhotos
            ? 'border-stone-300 hover:border-[#7A1528] bg-stone-50/50 hover:bg-stone-50 cursor-pointer'
            : 'border-stone-200 bg-stone-100/50 opacity-60 cursor-not-allowed'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={photos.length >= maxPhotos}
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#7A1528] shadow-2xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-stone-800">
            {photos.length < maxPhotos
              ? 'Click to upload room photos or drag and drop'
              : `Maximum limit of ${maxPhotos} photos reached`}
          </p>
          <p className="text-[11px] text-stone-500">
            Supports JPG, PNG, WEBP up to 5MB each ({photos.length}/{maxPhotos} uploaded)
          </p>
        </div>
      </div>

      {/* Preset mock photos shortcuts for easy testing */}
      {photos.length < maxPhotos && (
        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#7A1528]" />
            <span>Quick Test: Select sample campus issue photo</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MOCK_PHOTOS.map((preset) => {
              const isSelected = photos.includes(preset.url);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleAddPreset(preset.url)}
                  disabled={isSelected || photos.length >= maxPhotos}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    isSelected
                      ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-default'
                      : 'bg-white hover:bg-[#FDF2F4] text-stone-700 hover:text-[#7A1528] border-stone-300 hover:border-[#f9d0d9] shadow-2xs'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-stone-400" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Thumbnails Preview */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video shadow-xs">
              <img
                src={url}
                alt={`Room attachment ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold bg-stone-900/70 text-white px-1.5 py-0.5 rounded">
                Photo #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
