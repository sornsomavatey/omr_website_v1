import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Loader2, ShieldCheck, FileText, Plus, Trash2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import './index.css';

export const TermsEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadPageJson('terms.json')
      .then((res) => {
        if (!res) {
          setData({
            title: 'Terms & Conditions & Privacy Policy',
            subtitle: 'Last updated: July 10, 2026',
            sections: [
              {
                id: 'reservations_policy',
                heading: '1. Table Reservations & Cancellation Policy',
                content: 'Reservations must be confirmed at least 2 hours prior to arrival. Table holds are honored for up to 15 minutes past reservation time.',
              },
              {
                id: 'privacy_policy',
                heading: '2. Customer Privacy & Data Protection',
                content: 'One More Restaurant respects guest privacy. Contact details provided during booking are strictly used for reservation confirmation and service notifications.',
              },
              {
                id: 'event_deposits',
                heading: '3. Private Dining & Event Prepayment',
                content: 'Private event room bookings require a 30% advance deposit. Cancellations made 48 hours prior to the event are eligible for full refund.',
              },
            ],
          });
        } else {
          setData(res);
        }
      })
      .catch(() => {
        setData({
          title: 'Terms & Conditions & Privacy Policy',
          subtitle: 'Last updated: July 10, 2026',
          sections: [
            {
              id: 'reservations_policy',
              heading: '1. Table Reservations & Cancellation Policy',
              content: 'Reservations must be confirmed at least 2 hours prior to arrival. Table holds are honored for up to 15 minutes past reservation time.',
            },
            {
              id: 'privacy_policy',
              heading: '2. Customer Privacy & Data Protection',
              content: 'One More Restaurant respects guest privacy. Contact details provided during booking are strictly used for reservation confirmation and service notifications.',
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageJson('terms.json', data);
      setMessage(`Successfully saved Terms & Conditions for ${currentLangInfo.label}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Failed to save Terms & Conditions.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = () => {
    const newSec = {
      id: `sec_${Date.now()}`,
      heading: 'New Policy Section',
      content: 'Enter section content details here...',
    };
    setData({ ...data, sections: [...(data?.sections || []), newSec] });
  };

  const handleRemoveSection = (index: number) => {
    const updated = [...(data?.sections || [])];
    updated.splice(index, 1);
    setData({ ...data, sections: updated });
  };

  const handleSectionChange = (index: number, field: string, val: string) => {
    const updated = [...(data?.sections || [])];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, sections: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading content...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 text-[#1c2819] font-sans">
      <div>
        <CmsBackToPagesLink />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e8df] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Terms & Conditions Page Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} legal policies & terms (terms.json)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
          <button
            onClick={() => setShowSaveConfirmModal(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
          </button>
        </div>
      </div>

      <CmsSaveConfirmModal
        isOpen={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        onConfirm={async () => {
          await handleSave();
          setShowSaveConfirmModal(false);
        }}
        saving={saving}
        pageName="Terms & Conditions Page"
      />

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Hero Title */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5b8045]" />
          <span>Page Heading Info</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              PAGE TITLE ({currentLangInfo.short})
            </label>
            <input
              type="text"
              value={data?.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              SUBTITLE / LAST UPDATED
            </label>
            <input
              type="text"
              value={data?.subtitle || ''}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
          <span>Policy Sections ({(data?.sections || []).length}) — {currentLangInfo.label}</span>
        </h2>
        <button
          onClick={handleAddSection}
          className="flex items-center gap-1.5 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      <div className="space-y-4">
        {(data?.sections || []).map((sec: any, idx: number) => (
          <div key={sec.id || idx} className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Section #{idx + 1}</span>
              <button
                onClick={() => handleRemoveSection(idx)}
                className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                SECTION HEADING ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={sec.heading || ''}
                onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                SECTION CONTENT / DETAILS ({currentLangInfo.short})
              </label>
              <textarea
                rows={4}
                value={sec.content || ''}
                onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
