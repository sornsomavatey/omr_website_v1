import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Loader2, FileText, Target, Users, Eye, Undo2, Redo2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { useCmsHistory } from '../../lib/useCmsHistory';
import './index.css';

export const AboutEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const {
    data,
    setData,
    setInitialData,
    updateData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCmsHistory<any>('about.json');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  useEffect(() => {
    setLoading(true);
    loadPageJson('about.json')
      .then((res) => {
        if (!res) {
          setInitialData({
            header: {
              title: 'Our Story',
              subtitle: 'Elevating Cambodian culinary art since 2008',
            },
            paragraphs: [
              'One More Restaurant was born out of a deep-seated love for Cambodia’s traditional recipes and a desire to elevate them to a world-class dining experience.',
              'We collaborate closely with local farmers, sourcing organic ingredients from the fertile plains of Tonle Sap and Battambang.',
              'Every detail is curated to deliver an authentic Khmer dining experience.',
            ],
            mission: {
              title: 'Our Mission',
              desc: 'To preserve the culinary traditions of Cambodia, support our local farming communities, and present the refined flavors of Khmer cuisine to the global community with genuine warmth and excellence.',
            },
          });
        } else {
          setInitialData(res);
        }
      })
      .catch(() => {
        setInitialData({
          header: {
            title: 'Our Story',
            subtitle: 'Elevating Cambodian culinary art since 2008',
          },
          paragraphs: [
            'One More Restaurant was born out of a deep-seated love for Cambodia’s traditional recipes and a desire to elevate them to a world-class dining experience.',
            'We collaborate closely with local farmers, sourcing organic ingredients from the fertile plains of Tonle Sap and Battambang.',
            'Every detail is curated to deliver an authentic Khmer dining experience.',
          ],
          mission: {
            title: 'Our Mission',
            desc: 'To preserve the culinary traditions of Cambodia, support our local farming communities, and present the refined flavors of Khmer cuisine to the global community with genuine warmth and excellence.',
          },
        });
      })
      .finally(() => setLoading(false));
  }, [language, setInitialData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageJson('about.json', data);
      setMessage(`Successfully saved About Us content for ${currentLangInfo.label}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Failed to save About Us content.');
    } finally {
      setSaving(false);
    }
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...(data?.paragraphs || [])];
    updated[index] = val;
    setData({ ...data, paragraphs: updated });
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
            <FileText className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>About Us Page Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} brand story & mission text (about.json)
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
        pageName="About Us Page"
      />

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-medium shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-emerald-950 text-sm">Draft Content Saved!</span>
              <span className="text-emerald-800 font-normal">{message}</span>
            </div>
          </div>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white rounded-xl font-bold text-xs shadow-md shadow-[#5b8045]/20 flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Changes Now</span>
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5b8045]" />
          <span>Page Hero & Title</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              PAGE TITLE ({currentLangInfo.short})
            </label>
            <input
              type="text"
              value={data?.header?.title || ''}
              onChange={(e) => setData({ ...data, header: { ...data.header, title: e.target.value } })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              HERO SUBTITLE ({currentLangInfo.short})
            </label>
            <input
              type="text"
              value={data?.header?.subtitle || ''}
              onChange={(e) => setData({ ...data, header: { ...data.header, subtitle: e.target.value } })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>
        </div>
      </div>

      {/* Brand Story Paragraphs */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#5b8045]" />
          <span>Brand Story & Heritage Paragraphs</span>
        </h2>

        <div className="space-y-4">
          {(data?.paragraphs || []).map((p: string, idx: number) => (
            <div key={idx}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                PARAGRAPH #{idx + 1} ({currentLangInfo.short})
              </label>
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#5b8045]" />
          <span>Our Mission</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              MISSION TITLE
            </label>
            <input
              type="text"
              value={data?.mission?.title || ''}
              onChange={(e) => setData({ ...data, mission: { ...data.mission, title: e.target.value } })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              MISSION STATEMENT
            </label>
            <textarea
              rows={3}
              value={data?.mission?.desc || ''}
              onChange={(e) => setData({ ...data, mission: { ...data.mission, desc: e.target.value } })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath="/about"
      />
    </div>
  );
};
