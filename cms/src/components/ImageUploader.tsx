import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { uploadCMSImage } from '../lib/cmsStorage';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image Asset',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await uploadCMSImage(file);
      if (res.success && res.url) {
        onChange(res.url);
        setStatus('Uploaded successfully!');
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus(`Upload failed: ${res.message}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message || 'Failed to upload'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-[#a9ca96]">{label}</label>}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-[#18271a] border border-[#2d402f] rounded-xl shadow-sm">
        <div className="relative w-20 h-20 bg-[#121c13] rounded-lg border border-[#2d402f] flex items-center justify-center overflow-hidden shrink-0 group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#8ba38e]" />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image path or URL (e.g. /uploads/image.webp)"
            className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-mono"
          />

          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs bg-[#c8a962]/15 text-[#e5c158] hover:bg-[#c8a962]/25 px-3 py-1.5 rounded-lg transition font-medium border border-[#c8a962]/30">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {loading ? 'Uploading...' : 'Upload New File'}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            </label>

            {status && (
              <span className="text-xs flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
