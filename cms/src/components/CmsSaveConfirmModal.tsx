import React from 'react';
import { Save, AlertCircle, Loader2 } from 'lucide-react';
import { useCmsLanguage } from '../context/CmsLanguageContext';

interface CmsSaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  saving?: boolean;
  pageName?: string;
}

export const CmsSaveConfirmModal: React.FC<CmsSaveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  saving = false,
  pageName = 'Page Content',
}) => {
  const { currentLangInfo } = useCmsLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#e2e8df] shadow-2xl text-[#1c2819]">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#5b8045]/10 text-[#5b8045] flex items-center justify-center shrink-0">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c2819]">Confirm Save Changes</h3>
            <p className="text-xs text-gray-500 font-medium">Publish edits for {pageName}</p>
          </div>
        </div>

        <div className="p-3 bg-[#f8faf6] rounded-xl border border-[#e2e8df] space-y-1.5 text-xs text-gray-700">
          <div className="flex items-center gap-2 font-bold text-[#1c2819]">
            <AlertCircle className="w-4 h-4 text-[#5b8045]" />
            <span>Target Language: {currentLangInfo.label} ({currentLangInfo.short})</span>
          </div>
          <p className="text-gray-600 pl-6 leading-relaxed">
            Are you sure you want to save and publish these changes to the public website?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : `Yes, Save (${currentLangInfo.short})`}
          </button>
        </div>
      </div>
    </div>
  );
};
