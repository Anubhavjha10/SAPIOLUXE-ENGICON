import React, { useState } from 'react';
import { Upload, X, Loader2, CheckCircle, Video, FileImage } from 'lucide-react';
import { uploadToCloudinary, validateMediaFile, CloudinaryUploadResponse } from '../utils/cloudinary';

interface ImageUploaderProps {
  value?: string;
  onUploadSuccess: (data: CloudinaryUploadResponse) => void;
  onRemove?: () => void;
  label?: string;
  isBrandingAsset?: boolean;
  acceptVideo?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onUploadSuccess,
  onRemove,
  label = "Upload Media Asset",
  isBrandingAsset = false,
  acceptVideo = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  const processFile = async (file: File) => {
    const validation = validateMediaFile(file, isBrandingAsset);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file format selected.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Media file size must be under 50MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const res = await uploadToCloudinary(file, isBrandingAsset);
      setPreviewUrl(res.cloudinaryUrl);
      onUploadSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Media upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setError(null);
    if (onRemove) onRemove();
  };

  const isVideo = acceptVideo && (previewUrl?.endsWith('.mp4') || previewUrl?.includes('video'));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-label-caps text-xs text-secondary uppercase tracking-widest">
          {label} {isBrandingAsset && <span className="text-tertiary-fixed-dim font-bold">(PNG Only)</span>}
        </label>
      )}

      {previewUrl ? (
        <div className="relative aspect-[16/9] w-full bg-surface-variant overflow-hidden ghost-border group">
          {isVideo ? (
            <video src={previewUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={previewUrl} alt="Media preview" className="w-full h-full object-contain p-2" />
          )}
          <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-error text-white p-2 hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
              title="Remove media asset"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-primary/80 text-tertiary-fixed-dim text-[10px] font-mono-technical px-2 py-0.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Media Asset Ready
          </div>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed ${
            isDragging ? 'border-tertiary-fixed-dim bg-surface-container-high' : 'border-outline-variant'
          } hover:border-tertiary-fixed-dim bg-surface-container/30 hover:bg-surface-container p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[140px] text-center`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-tertiary-fixed-dim animate-spin" />
              <span className="font-mono-technical text-xs text-secondary">
                Processing media upload...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-secondary hover:text-primary">
              <Upload className="w-8 h-8 text-tertiary-fixed-dim" />
              <div className="font-body-md text-xs font-semibold">
                Click or Drag & Drop File to Upload
              </div>
              <p className="font-mono-technical text-[10px] text-outline">
                {isBrandingAsset
                  ? 'Strictly PNG format (.png)'
                  : acceptVideo
                  ? 'Supports JPG, PNG, WEBP & MP4 Video'
                  : 'Supports JPG, PNG, WEBP'}
              </p>
            </div>
          )}
          <input
            type="file"
            accept={isBrandingAsset ? 'image/png' : acceptVideo ? 'image/*,video/mp4' : 'image/*'}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="font-body-md text-xs text-error font-medium">{error}</p>}
    </div>
  );
};

