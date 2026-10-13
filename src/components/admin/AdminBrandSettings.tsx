import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  GluckGifyLogo,
  DESIGNATED_LOGO_PUBLIC_PATH,
  DESIGNATED_LOGO_ASSETS_PATH,
} from '../brand/GluckGifyLogo';
import { SparkleStarIcon, LilyFlowerIcon } from '../brand/BrandIcons';

interface AdminBrandSettingsProps {
  onShowToast: (msg: string) => void;
}

export const AdminBrandSettings: React.FC<AdminBrandSettingsProps> = ({ onShowToast }) => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [brandName, setBrandName] = useState('GLÜCK GIFY');
  const [tagline, setTagline] = useState('CUTE GIFY AND ACCESSORIES');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [logoMode, setLogoMode] = useState<'auto' | 'image' | 'vector'>('auto');
  const [announcementText, setAnnouncementText] = useState(
    'Welcome to GLÜCK GIFY: Cute Gify & Botanical Accessories ✨ Free Keepsake Wrapping'
  );
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [loadingBloomSpeed, setLoadingBloomSpeed] = useState(2800);
  const [pageTransitions, setPageTransitions] = useState(true);
  const [primaryAccent, setPrimaryAccent] = useState('#4CAF50');
  const [secondaryAccent, setSecondaryAccent] = useState('#2B2D2F');
  const [highlightAccent, setHighlightAccent] = useState('#FAF9F6');
  const [goldAccent, setGoldAccent] = useState('#E9C46A');

  // Local uploaded image preview
  const [uploadedLogoPreview, setUploadedLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.brandSettings.get();
      if (res.settings) {
        setBrandName(res.settings.brandName || 'GLÜCK GIFY');
        setTagline(res.settings.tagline || 'CUTE GIFY AND ACCESSORIES');
        setLogoUrl(res.settings.logoUrl || '/logo.png');
        setLogoMode(res.settings.logoFallbackMode || 'auto');
        setAnnouncementText(res.settings.announcementText || '');
        setAnnouncementActive(res.settings.announcementActive ?? true);
        setLoadingBloomSpeed(res.settings.loadingBloomSpeed || 2800);
        setPageTransitions(res.settings.pageTransitions ?? true);
        setPrimaryAccent(res.settings.primaryAccent || '#4CAF50');
        setSecondaryAccent(res.settings.secondaryAccent || '#2B2D2F');
        setHighlightAccent(res.settings.highlightAccent || '#FAF9F6');
        setGoldAccent(res.settings.goldAccent || '#E9C46A');
      }

      const stored = localStorage.getItem('gluck_custom_logo');
      if (stored) {
        setUploadedLogoPreview(stored);
      }
    } catch {
      // Fallback to initial defaults
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload an image file (PNG, JPG, or SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedLogoPreview(result);
      setLogoUrl(result);
      localStorage.setItem('gluck_custom_logo', result);
      onShowToast('Custom logo uploaded & cached locally!');
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultLogo = () => {
    localStorage.removeItem('gluck_custom_logo');
    setUploadedLogoPreview(null);
    setLogoUrl('/logo.png');
    onShowToast('Reset to default designated logo path (/logo.png)');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        brandName,
        tagline,
        logoUrl,
        logoFallbackMode: logoMode,
        announcementText,
        announcementActive,
        loadingBloomSpeed: Number(loadingBloomSpeed),
        pageTransitions,
        primaryAccent,
        secondaryAccent,
        highlightAccent,
        goldAccent,
      };

      await api.brandSettings.update(payload);
      if (logoUrl) {
        localStorage.setItem('gluck_custom_logo', logoUrl);
      }
      onShowToast('Brand settings and theme configuration saved!');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-[#7A8276] animate-pulse">
        Loading GLÜCK GIFY brand configuration...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8D8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <LilyFlowerIcon size={20} color="#4CAF50" />
            <h3 className="text-lg font-bold text-[#2B2D2F]">Brand Identity &amp; System Configuration</h3>
          </div>
          <p className="text-xs text-[#7A8276] mt-1">
            Configure dynamic logo files, blooming animation speed, storefront announcement text, and color aesthetics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#3d9140] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:shadow-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. LOGO LOCATION & CUSTOMIZATION SETUP */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8D8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                <h4 className="text-sm font-bold text-[#2B2D2F]">
                  Logo Location &amp; Customization Setup
                </h4>
              </div>
              <p className="text-xs text-[#7A8276] mt-0.5">
                Designated file paths, upload tools, and automatic vector emblem fallback.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold bg-[#EAF5EC] text-[#2D6A4F]">
              Hybrid Emblem Engine
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Logo Live Interactive Preview */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E2E8D8] flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-bold text-[#7A8276] uppercase tracking-wider">
                Live Rendering Preview
              </span>
              <div className="p-4 bg-white rounded-full border border-[#E2E8D8] shadow-sm">
                <GluckGifyLogo
                  size="lg"
                  glow={true}
                  customSrc={uploadedLogoPreview || logoUrl}
                  forceVector={logoMode === 'vector'}
                />
              </div>
              <div className="text-[11px] text-[#7A8276]">
                Mode:{' '}
                <span className="font-bold text-[#2D6A4F] capitalize">
                  {logoMode === 'auto'
                    ? 'Automatic Fallback'
                    : logoMode === 'vector'
                    ? 'Strict Vector'
                    : 'Image Only'}
                </span>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="lg:col-span-2 space-y-4">
              {/* Designated File Paths Notification Card */}
              <div className="p-4 rounded-xl bg-[#F4F8F3] border border-[#CDE3CD] text-xs space-y-2">
                <div className="font-bold text-[#2D6A4F] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  <span>Designated Workspace Logo Paths</span>
                </div>
                <p className="text-[#4A5568] text-[11.5px]">
                  You can replace your logo file anytime directly in the workspace at either of these two paths:
                </p>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-[#CDE3CD]">
                    <span className="text-[#2D6A4F] font-bold">1. Public Path:</span>
                    <span className="text-[#2B2D2F] font-semibold">{DESIGNATED_LOGO_PUBLIC_PATH}</span>
                    <span className="text-[10px] text-[#7A8276] ml-auto">(Served at root URL)</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-[#CDE3CD]">
                    <span className="text-[#2D6A4F] font-bold">2. Source Path:</span>
                    <span className="text-[#2B2D2F] font-semibold">{DESIGNATED_LOGO_ASSETS_PATH}</span>
                    <span className="text-[10px] text-[#7A8276] ml-auto">(Bundled in build)</span>
                  </div>
                </div>
              </div>

              {/* Upload or Custom URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">
                    Manual Upload Logo File
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#E2E8D8] hover:border-[#4CAF50] bg-white cursor-pointer transition-all text-xs font-semibold text-[#2D6A4F]">
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                    <span>Choose PNG/JPG/SVG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">
                    Or Logo Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/logo.png"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Rendering Mode selector */}
              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1.5">
                  Logo Rendering Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Auto (Hybrid)', desc: 'Image with vector fallback' },
                    { id: 'image', label: 'Image Priority', desc: 'Strict custom image' },
                    { id: 'vector', label: 'Pure Vector', desc: 'Handcrafted SVG emblem' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setLogoMode(mode.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        logoMode === mode.id
                          ? 'border-[#4CAF50] bg-[#EAF5EC] text-[#2D6A4F] shadow-2xs'
                          : 'border-[#E2E8D8] bg-white text-[#7A8276] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="text-xs font-bold">{mode.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  className="text-xs text-[#7A8276] hover:text-[#2D6A4F] underline cursor-pointer"
                >
                  Reset logo to default placeholder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ANIMATION & MOTION SETTINGS */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8D8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]" />
                <h4 className="text-sm font-bold text-[#2B2D2F]">
                  Animation &amp; Transition Controls
                </h4>
              </div>
              <p className="text-xs text-[#7A8276] mt-0.5">
                Tune the multi-phase lily blooming loop, golden light pulse, and page easing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloom Speed Slider */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E2E8D8] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2B2D2F]">
                  Loading Bloom Duration
                </label>
                <span className="font-mono text-xs font-bold text-[#2D6A4F]">
                  {(loadingBloomSpeed / 1000).toFixed(1)}s ({loadingBloomSpeed}ms)
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="200"
                value={loadingBloomSpeed}
                onChange={(e) => setLoadingBloomSpeed(Number(e.target.value))}
                className="w-full accent-[#4CAF50] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#7A8276]">
                <span>Swift (1.0s)</span>
                <span>Default (2.8s)</span>
                <span>Deliberate (6.0s)</span>
              </div>
            </div>

            {/* Page Transitions Toggle */}
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E2E8D8] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#2B2D2F]">
                  Smooth Page Easing &amp; Micro-Animations
                </div>
                <p className="text-[11px] text-[#7A8276] mt-0.5">
                  Enable subtle botanical glow and blooming transforms across modal dialogs.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pageTransitions}
                  onChange={(e) => setPageTransitions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E2E8D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 3. STOREFRONT ANNOUNCEMENT BANNER */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8D8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                <h4 className="text-sm font-bold text-[#2B2D2F]">
                  Custom Banner &amp; Announcement Text Management
                </h4>
              </div>
              <p className="text-xs text-[#7A8276] mt-0.5">
                Displays on the top banner bar across desktop and mobile storefront headers.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D6A4F]">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="accent-[#4CAF50] rounded"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2D2F] mb-1">
              Banner Announcement Copy
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g., Welcome to GLÜCK GIFY: Cute Gify & Botanical Accessories ✨ Free Keepsake Wrapping"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none text-[#2B2D2F]"
            />
          </div>

          {/* Banner Live Preview */}
          <div className="p-3 rounded-xl bg-[#F3F7F2] border border-[#DDE5DA] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <SparkleStarIcon size={14} color="#E9C46A" />
              <span className="font-medium text-[#2B2D2F]">
                {announcementText || 'Banner is currently empty'}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase text-[#4CAF50] bg-white px-2 py-0.5 rounded border border-[#DDE5DA]">
              Preview
            </span>
          </div>
        </div>

        {/* 4. BRAND THEME PALETTE (PALETTE REFERENCE & CUSTOMIZATION) */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8D8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]" />
                <h4 className="text-sm font-bold text-[#2B2D2F]">
                  Visual Brand Color Harmony
                </h4>
              </div>
              <p className="text-xs text-[#7A8276] mt-0.5">
                Core palette derived from the lily emblem: Lily Green, Charcoal, Cream, and Gold.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Lily Green */}
            <div className="p-4 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6] text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto shadow-sm" style={{ backgroundColor: primaryAccent }} />
              <div className="text-xs font-bold text-[#2B2D2F]">Lily Green</div>
              <div className="font-mono text-[11px] text-[#7A8276]">{primaryAccent}</div>
              <span className="text-[10px] font-semibold text-[#2D6A4F] block">Primary Accent</span>
            </div>

            {/* Charcoal */}
            <div className="p-4 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6] text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto shadow-sm" style={{ backgroundColor: secondaryAccent }} />
              <div className="text-xs font-bold text-[#2B2D2F]">Deep Charcoal</div>
              <div className="font-mono text-[11px] text-[#7A8276]">{secondaryAccent}</div>
              <span className="text-[10px] font-semibold text-[#4A5568] block">Typography &amp; Borders</span>
            </div>

            {/* Pale Cream */}
            <div className="p-4 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6] text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto border border-[#E2E8D8] shadow-sm" style={{ backgroundColor: highlightAccent }} />
              <div className="text-xs font-bold text-[#2B2D2F]">Pale Lily Cream</div>
              <div className="font-mono text-[11px] text-[#7A8276]">{highlightAccent}</div>
              <span className="text-[10px] font-semibold text-[#7A8276] block">Background Neutral</span>
            </div>

            {/* Soft Gold */}
            <div className="p-4 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6] text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto shadow-sm" style={{ backgroundColor: goldAccent }} />
              <div className="text-xs font-bold text-[#2B2D2F]">Gold Stamen</div>
              <div className="font-mono text-[11px] text-[#7A8276]">{goldAccent}</div>
              <span className="text-[10px] font-semibold text-[#B58517] block">Sparkle Accent</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
