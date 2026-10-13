import React, { useState } from 'react';
import { GluckGifyLogo } from '../brand/GluckGifyLogo';
import {
  LilyFlowerIcon,
  GiftRibbonIcon,
  SparkleStarIcon,
  CuteBackpackIcon,
  CuteSearchIcon,
} from '../brand/BrandIcons';
import { Product } from '../../types';
import { api } from '../../services/api';

interface GifyStudioHubProps {
  onAddToCart: (product: any) => void;
  onOpenProductModal: (product: any) => void;
  onShowToast: (message: string) => void;
  onOpenLoadingDemo: () => void;
  onReturnToStorefront: () => void;
  onOpenAdmin: () => void;
}

interface GifyAsset {
  id: string;
  name: string;
  category: 'Botanical' | 'Kawaii' | 'Sparkles' | 'Whimsical';
  previewEmoji: string;
  svgIcon: string;
  tag: string;
  color: string;
}

export const GifyStudioHub: React.FC<GifyStudioHubProps> = ({
  onAddToCart,
  onOpenProductModal,
  onShowToast,
  onOpenLoadingDemo,
  onReturnToStorefront,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery' | 'accessories' | 'maker'>('studio');
  const [selectedAsset, setSelectedAsset] = useState<string>('asset-lily');
  const [canvasBg, setCanvasBg] = useState<string>('#FAF9F6');
  const [animationSpeed, setAnimationSpeed] = useState<'gentle' | 'breeze' | 'bloom'>('gentle');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [canvasStickers, setCanvasStickers] = useState<string[]>(['sparkles']);
  const [activeSearch, setActiveSearch] = useState<string>('');

  // Interactive "CREATE NEW GIFY" Maker Modal State
  const [isMakerModalOpen, setIsMakerModalOpen] = useState(false);
  const [newGifyTitle, setNewGifyTitle] = useState('My Blossom Greeting');
  const [newGifyCaption, setNewGifyCaption] = useState('May your day bloom with endless delight ✨');
  const [newGifySelectedMotif, setNewGifySelectedMotif] = useState('lily');
  const [newGifyColorTheme, setNewGifyColorTheme] = useState('lily-green');

  // Gify Assets Collection (Left Column)
  const gifyAssets: GifyAsset[] = [
    {
      id: 'asset-lily',
      name: 'Unfurling Lily',
      category: 'Botanical',
      previewEmoji: '🌸',
      svgIcon: 'local_florist',
      tag: 'Signature',
      color: '#4CAF50',
    },
    {
      id: 'asset-bunny',
      name: 'Dancing Meadow Bunny',
      category: 'Kawaii',
      previewEmoji: '🐰',
      svgIcon: 'cruelty_free',
      tag: 'Cute',
      color: '#FFA5B7',
    },
    {
      id: 'asset-butterfly',
      name: 'Fluttering Silk Butterfly',
      category: 'Whimsical',
      previewEmoji: '🦋',
      svgIcon: 'flutter',
      tag: 'Airy',
      color: '#64B5F6',
    },
    {
      id: 'asset-kitten',
      name: 'Curled Sleeping Kitten',
      category: 'Kawaii',
      previewEmoji: '🐱',
      svgIcon: 'pets',
      tag: 'Sweet',
      color: '#FFB74D',
    },
    {
      id: 'asset-stars',
      name: 'Four-Point Twinkle Stars',
      category: 'Sparkles',
      previewEmoji: '✨',
      svgIcon: 'auto_awesome',
      tag: 'Glow',
      color: '#E9C46A',
    },
    {
      id: 'asset-tea',
      name: 'Floral Porcelain Teacup',
      category: 'Whimsical',
      previewEmoji: '☕',
      svgIcon: 'coffee',
      tag: 'Cozy',
      color: '#81C784',
    },
    {
      id: 'asset-clover',
      name: 'Glück Lucky 4-Leaf Clover',
      category: 'Botanical',
      previewEmoji: '🍀',
      svgIcon: 'eco',
      tag: 'Lucky',
      color: '#2D6A4F',
    },
    {
      id: 'asset-cloud',
      name: 'Pastel Rainbow Cloud',
      category: 'Kawaii',
      previewEmoji: '☁️',
      svgIcon: 'cloud',
      tag: 'Dreamy',
      color: '#BA68C8',
    },
  ];

  // Curated Physical Accessories (Right Column)
  const physicalAccessories = [
    {
      id: 'acc-pin',
      sku: 'GK-PIN-01',
      name: 'Lily Blossom Enamel Pin',
      category: 'Jewelry & Pins',
      price: 1850,
      description: 'Hand-dipped soft white enamel lily with polished gold border and butterfly clasp.',
      image: 'https://images.unsplash.com/photo-1611591475878-83141dfd16a5?auto=format&fit=crop&w=500&q=80',
      badge: 'Bestseller',
      stock: 42,
    },
    {
      id: 'acc-scarf',
      sku: 'GK-SCF-02',
      name: 'Botanical Lily Silk Scarf',
      category: 'Wearables',
      price: 6400,
      description: '100% pure mulberry silk scarf with hand-rolled hems and illustrated botanical lilies.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80',
      badge: 'Limited',
      stock: 14,
    },
    {
      id: 'acc-notebook',
      sku: 'GK-NB-03',
      name: 'Embossed Lily Hardcover Journal',
      category: 'Stationery',
      price: 2750,
      description: '160gsm bamboo paper with gold-stamped lily emblem, ribbon bookmark, and elastic closure.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
      badge: 'Atelier Favorite',
      stock: 28,
    },
    {
      id: 'acc-keychain',
      sku: 'GK-KEY-04',
      name: 'Glück Clover Brass Keychain',
      category: 'Keepsakes',
      price: 2200,
      description: 'Solid hand-cast brushed brass lucky charm with engraved logo and leather strap.',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=500&q=80',
      badge: 'Handmade',
      stock: 35,
    },
    {
      id: 'acc-pouch',
      sku: 'GK-PCH-05',
      name: 'Botanical Linen Atelier Pouch',
      category: 'Bags & Pouches',
      price: 3100,
      description: 'Washed Belgian linen zipper pouch with embroidered floral lily stem and brass zip.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80',
      badge: 'New',
      stock: 19,
    },
  ];

  const handleCreateNewGify = () => {
    setIsMakerModalOpen(true);
  };

  const handleSaveCustomGify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customRequests.create({
        title: newGifyTitle,
        motif: newGifySelectedMotif,
        caption: newGifyCaption,
        colorTheme: newGifyColorTheme,
        animationSpeed: animationSpeed,
        stickers: canvasStickers,
        requestType: 'custom_gify',
        amount: 2500,
      });
      setIsMakerModalOpen(false);
      onShowToast(`✨ "${newGifyTitle}" saved & submitted to your custom Atelier queue!`);
    } catch {
      setIsMakerModalOpen(false);
      onShowToast(`✨ "${newGifyTitle}" generated & saved!`);
    }
  };

  const toggleSticker = (sticker: string) => {
    if (canvasStickers.includes(sticker)) {
      setCanvasStickers(canvasStickers.filter((s) => s !== sticker));
    } else {
      setCanvasStickers([...canvasStickers, sticker]);
    }
  };

  const filteredAssets = gifyAssets.filter((a) =>
    a.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(activeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans flex flex-col selection:bg-[#D5E8D4]">
      {/* 1. Header (Redesigned Nav Bar) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E1E8DD] shadow-[0_1px_6px_rgba(43,45,47,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3.5">
            <GluckGifyLogo size="sm" showText={true} glow={true} />
            <div className="flex flex-col">
              <span className="text-[20px] font-bold tracking-[0.16em] text-[#2B2D2F] leading-tight">
                GLÜCK GIFY
              </span>
              <span className="text-[10px] tracking-[0.24em] text-[#4CAF50] font-semibold uppercase">
                Cute Gify and Accessories
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold">
            <button
              onClick={() => setActiveTab('studio')}
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                  : 'text-[#586455] hover:text-[#2B2D2F]'
              }`}
            >
              <LilyFlowerIcon size={16} accentColor="#4CAF50" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                  : 'text-[#586455] hover:text-[#2B2D2F]'
              }`}
            >
              <SparkleStarIcon size={16} accentColor="#E9C46A" />
              <span>GIFY Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('accessories')}
              className={`py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'accessories'
                  ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                  : 'text-[#586455] hover:text-[#2B2D2F]'
              }`}
            >
              <CuteBackpackIcon size={16} accentColor="#4CAF50" />
              <span>Cute Accessories</span>
            </button>

            <button
              onClick={() => handleCreateNewGify()}
              className="py-1.5 px-3 rounded-full text-[#586455] hover:text-[#2B2D2F] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-[#4CAF50]">magic_button</span>
              <span>Custom Maker</span>
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLoadingDemo}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#2D6A4F] bg-[#EAF5EC] hover:bg-[#D9EEDB] transition-all"
              title="Preview Animated Lily Loading Experience"
            >
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping" />
              <span>Bloom Animation</span>
            </button>

            <button
              onClick={onReturnToStorefront}
              className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-[#2B2D2F] bg-white border border-[#DCE2D5] hover:bg-[#F4F6F1] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <GiftRibbonIcon size={16} accentColor="#4CAF50" />
              <span className="hidden sm:inline">Luxury Boutique</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full text-[#586455] hover:text-[#2B2D2F] hover:bg-[#EAF5EC] transition-all"
              title="Admin Portal"
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Hub Introduction Banner */}
        <div className="mb-6 bg-linear-to-r from-[#F0F7F2] via-white to-[#FDF9EE] border border-[#DEE7DA] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white border border-[#D2DEC5] flex items-center justify-center shrink-0 shadow-2xs">
              <GluckGifyLogo size="icon-only" showText={false} animated={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] sm:text-[22px] font-bold text-[#2B2D2F]">
                  The Cute Gify &amp; Accessories Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF5EC] text-[#2D6A4F]">
                  Official Atelier
                </span>
              </div>
              <p className="text-[13px] text-[#556353] mt-0.5">
                Design custom botanical animations, explore cute physical keepsakes, and create whimsical gifts with the signature GLÜCK GIFY lily aesthetic.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Key Action Button: CREATE NEW GIFY */}
            <button
              onClick={handleCreateNewGify}
              className="px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide text-[#2B2D2F] bg-white border border-[#4CAF50]/40 hover:border-[#4CAF50] shadow-[0_0_20px_rgba(76,175,80,0.28)] hover:shadow-[0_0_25px_rgba(76,175,80,0.45)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#4CAF50]">add_circle</span>
              <span>CREATE NEW GIFY</span>
            </button>
          </div>
        </div>

        {/* 3. Studio Workspace (Three Column Architecture) */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: GIFY ASSETS (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E1E8DD] p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EC]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4CAF50] text-[20px]">animation</span>
                  <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#2B2D2F]">
                    GIFY ASSETS
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#768573] bg-[#F2F6EF] px-2 py-0.5 rounded-full">
                  {filteredAssets.length} Cute Items
                </span>
              </div>

              {/* Search Assets */}
              <div className="mt-3 relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#919F8E] text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search stickers & gifts..."
                  value={activeSearch}
                  onChange={(e) => setActiveSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-[12px] rounded-lg bg-[#FAF9F6] border border-[#DEE5D9] focus:outline-none focus:border-[#4CAF50] text-[#2B2D2F]"
                />
              </div>

              {/* Asset List Grid */}
              <div className="mt-3 space-y-2 overflow-y-auto max-h-[560px] pr-1">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset === asset.id;
                  return (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAsset(asset.id);
                        onShowToast(`Selected "${asset.name}" for Studio Canvas preview`);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                        isSelected
                          ? 'border-[#4CAF50] bg-[#F1F8F3] shadow-xs'
                          : 'border-[#EEF2EB] hover:border-[#D0DDC9] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 border"
                          style={{
                            backgroundColor: `${asset.color}15`,
                            borderColor: `${asset.color}35`,
                          }}
                        >
                          {asset.previewEmoji}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#2B2D2F] group-hover:text-[#1F2421]">
                            {asset.name}
                          </div>
                          <div className="text-[11px] text-[#71806F] flex items-center gap-1.5 mt-0.5">
                            <span>{asset.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-[#4CAF50]">{asset.tag}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform ${
                          isSelected
                            ? 'text-[#4CAF50] scale-110'
                            : 'text-[#ADC0AA] group-hover:text-[#4CAF50]'
                        }`}
                      >
                        {isSelected ? 'check_circle' : 'add'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F4EC] text-center">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="text-[12px] font-bold text-[#2D6A4F] hover:underline flex items-center justify-center gap-1 w-full"
                >
                  <span>Browse Full 40+ Asset Archive</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* CENTER WORKSPACE: THE STUDIO CANVAS (6 Cols) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Primary Workspace framed by subtle, thin lily-green border */}
              <div className="bg-white rounded-2xl border-2 border-[#4CAF50]/35 p-5 shadow-[0_4px_24px_rgba(76,175,80,0.08)] flex flex-col relative overflow-hidden">
                {/* Canvas Header & Project Label */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EB]">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
                    <h3 className="text-[14px] font-bold text-[#2B2D2F]">
                      Project: <span className="font-serif italic font-normal text-[#2D6A4F]">"Signature Lily Blossom #01"</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Play/Pause Toggle */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg border border-[#DEE5DA] text-[#526053] hover:bg-[#F2F6EF] text-[12px] flex items-center gap-1"
                      title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span className="hidden sm:inline">{isPlaying ? 'Live' : 'Paused'}</span>
                    </button>

                    {/* Speed Selector */}
                    <button
                      onClick={() => {
                        const speeds: Array<'gentle' | 'breeze' | 'bloom'> = ['gentle', 'breeze', 'bloom'];
                        const next = speeds[(speeds.indexOf(animationSpeed) + 1) % speeds.length];
                        setAnimationSpeed(next);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#DEE5DA] text-[11px] font-semibold text-[#526053] hover:bg-[#F2F6EF]"
                      title="Adjust animation speed"
                    >
                      Speed: <span className="text-[#2D6A4F] capitalize">{animationSpeed}</span>
                    </button>
                  </div>
                </div>

                {/* THE LIVE INTERACTIVE CANVAS */}
                <div
                  className="mt-4 rounded-xl border border-[#E3EADE] h-96 relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 shadow-inner"
                  style={{ backgroundColor: canvasBg }}
                >
                  {/* Subtle Background Watermark Grid */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, #4CAF50 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Corner Four-Point Stars */}
                  <div className="absolute top-4 left-4 text-[#E9C46A] opacity-75">
                    <SparkleStarIcon size={18} />
                  </div>
                  <div className="absolute top-4 right-4 text-[#4CAF50] opacity-75">
                    <SparkleStarIcon size={18} accentColor="#4CAF50" />
                  </div>
                  <div className="absolute bottom-4 left-4 text-[#4CAF50] opacity-75">
                    <SparkleStarIcon size={18} accentColor="#4CAF50" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-[#E9C46A] opacity-75">
                    <SparkleStarIcon size={18} />
                  </div>

                  {/* Center Placeholder / Interactive Lily Vector Logo */}
                  <div
                    className={`relative transition-all duration-700 ${
                      isPlaying
                        ? animationSpeed === 'bloom'
                          ? 'animate-[pulse_1.5s_ease-in-out_infinite]'
                          : animationSpeed === 'breeze'
                          ? 'animate-[pulse_2.5s_ease-in-out_infinite]'
                          : 'animate-[pulse_3.8s_ease-in-out_infinite]'
                        : ''
                    }`}
                  >
                    <GluckGifyLogo size="lg" showText={true} glow={true} animated={isPlaying} />
                  </div>

                  {/* Interactive Stickers overlay */}
                  {canvasStickers.includes('sparkles') && (
                    <div className="absolute top-12 right-12 animate-bounce duration-1000 text-[24px]">
                      ✨
                    </div>
                  )}
                  {canvasStickers.includes('bunny') && (
                    <div className="absolute bottom-6 left-12 animate-pulse text-[28px]">
                      🐰
                    </div>
                  )}
                  {canvasStickers.includes('butterfly') && (
                    <div className="absolute top-10 left-14 animate-bounce text-[26px]">
                      🦋
                    </div>
                  )}

                  {/* Canvas Center Caption */}
                  <div className="absolute bottom-3 px-4 py-1 rounded-full bg-white/90 border border-[#DEE5DA] shadow-xs text-[11px] font-semibold text-[#2D6A4F] tracking-wider uppercase flex items-center gap-1.5">
                    <LilyFlowerIcon size={14} accentColor="#4CAF50" />
                    <span>Pure Botanical Vector Canvas</span>
                  </div>
                </div>

                {/* Canvas Controls Toolbar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px]">
                  {/* Canvas Background Color Picker */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#687766] font-medium">Canvas Tint:</span>
                    {[
                      { label: 'Cream', color: '#FAF9F6' },
                      { label: 'Pure White', color: '#FFFFFF' },
                      { label: 'Pastel Mint', color: '#F1F7F2' },
                      { label: 'Blossom Pink', color: '#FFF3F5' },
                      { label: 'Charcoal', color: '#2B2D2F' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setCanvasBg(c.color)}
                        className={`w-5 h-5 rounded-full border transition-all ${
                          canvasBg === c.color ? 'ring-2 ring-[#4CAF50] scale-110' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: c.color, borderColor: '#CFDAC9' }}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Active Stickers Toggle */}
                  <div className="flex items-center gap-1">
                    <span className="text-[#687766] font-medium mr-1">Decor:</span>
                    <button
                      onClick={() => toggleSticker('sparkles')}
                      className={`px-2 py-0.5 rounded-md border text-[11px] ${
                        canvasStickers.includes('sparkles')
                          ? 'bg-[#EAF5EC] border-[#4CAF50] text-[#2D6A4F] font-bold'
                          : 'border-[#DEE5DA] text-[#6C7B6A]'
                      }`}
                    >
                      ✨ Stars
                    </button>
                    <button
                      onClick={() => toggleSticker('butterfly')}
                      className={`px-2 py-0.5 rounded-md border text-[11px] ${
                        canvasStickers.includes('butterfly')
                          ? 'bg-[#EAF5EC] border-[#4CAF50] text-[#2D6A4F] font-bold'
                          : 'border-[#DEE5DA] text-[#6C7B6A]'
                      }`}
                    >
                      🦋 Silk Wings
                    </button>
                    <button
                      onClick={() => toggleSticker('bunny')}
                      className={`px-2 py-0.5 rounded-md border text-[11px] ${
                        canvasStickers.includes('bunny')
                          ? 'bg-[#EAF5EC] border-[#4CAF50] text-[#2D6A4F] font-bold'
                          : 'border-[#DEE5DA] text-[#6C7B6A]'
                      }`}
                    >
                      🐰 Bunny
                    </button>
                  </div>
                </div>

                {/* Action Buttons underneath canvas */}
                <div className="mt-4 pt-3 border-t border-[#F0F4EB] flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setCanvasStickers(['sparkles']);
                      setCanvasBg('#FAF9F6');
                      onShowToast('Studio canvas reset to fresh blank state');
                    }}
                    className="text-[12px] font-semibold text-[#768574] hover:text-[#2B2D2F] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Reset Canvas</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onShowToast('✨ Gify link & SVG frame copied to clipboard!');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#DCE3D6] text-[12px] font-semibold text-[#2B2D2F] hover:bg-[#F2F6EF] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      <span>Share Preview</span>
                    </button>

                    <button
                      onClick={handleCreateNewGify}
                      className="px-4 py-1.5 rounded-lg bg-[#2B2D2F] text-white hover:bg-[#1F2421] text-[12px] font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#4CAF50]">
                        download
                      </span>
                      <span>Export Gify Loop</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Design Tips Card */}
              <div className="bg-[#FAF9F6] border border-[#DEE7DA] rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4CAF50] text-[22px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <div className="text-[12px] text-[#556353]">
                  <strong className="text-[#2B2D2F] font-semibold block mb-0.5">
                    Glück Gify Aesthetic Standard
                  </strong>
                  Always preserve the botanical purity of the white lily flower with clean geometric line art, four-pointed sparkle accents, and deep charcoal lettering.
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACCESSORIES (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E1E8DD] p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F4EC]">
                <div className="flex items-center gap-2">
                  <CuteBackpackIcon size={18} accentColor="#4CAF50" />
                  <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#2B2D2F]">
                    ACCESSORIES
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#2D6A4F] bg-[#EAF5EC] px-2 py-0.5 rounded-full">
                  Curated Goods
                </span>
              </div>

              <p className="text-[11px] text-[#6E7D6C] mt-2 mb-3">
                Physical botanical keepsakes designed to match our signature Gify aesthetic:
              </p>

              {/* Accessories Items List */}
              <div className="space-y-3 overflow-y-auto max-h-[560px] pr-1">
                {physicalAccessories.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[#EEF2EA] hover:border-[#CADAC5] transition-all bg-[#FAF9F6]/50 hover:bg-white group flex flex-col gap-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[#DEE5D9] shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#4CAF50] bg-[#EAF5EC] px-1.5 py-0.5 rounded-sm">
                          {item.badge}
                        </span>
                        <h4 className="text-[12px] font-bold text-[#2B2D2F] leading-snug mt-1 truncate">
                          {item.name}
                        </h4>
                        <div className="text-[12px] font-bold text-[#2D6A4F] mt-0.5">
                          LKR {item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#697866] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#F0F4EC]">
                      <button
                        onClick={() => {
                          onAddToCart({
                            id: item.id,
                            sku: item.sku,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                            stockQuantity: item.stock,
                            isPersonalizable: true,
                          });
                          onShowToast(`Added "${item.name}" to your bag!`);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#2B2D2F] hover:bg-[#1F2421] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenProductModal({
                            id: item.id,
                            sku: item.sku,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                            description: item.description,
                            stockQuantity: item.stock,
                            isPersonalizable: true,
                          });
                        }}
                        className="p-1.5 rounded-lg border border-[#DCE3D6] text-[#556353] hover:text-[#2B2D2F] hover:bg-[#F2F6EF]"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#F0F4EC]">
                <button
                  onClick={() => setActiveTab('accessories')}
                  className="w-full py-2 rounded-xl bg-[#EAF5EC] hover:bg-[#D9EEDB] text-[#2D6A4F] text-[12px] font-bold text-center transition-colors block"
                >
                  View All Boutique Accessories
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Alternative Tab: Full Gify Gallery */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-[#E1E8DD] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#F0F4EC] gap-3">
              <div>
                <h2 className="text-[18px] font-bold text-[#2B2D2F] flex items-center gap-2">
                  <SparkleStarIcon size={20} accentColor="#E9C46A" />
                  <span>Curated GLÜCK GIFY Archive</span>
                </h2>
                <p className="text-[13px] text-[#697967] mt-0.5">
                  Hand-crafted looping botanical GIFs, stickers, and whimsical animations ready for messaging and gifts.
                </p>
              </div>

              <button
                onClick={handleCreateNewGify}
                className="px-4 py-2 rounded-full bg-[#2B2D2F] text-white text-[12px] font-bold flex items-center gap-1.5 self-start"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4CAF50]">add</span>
                <span>Create Custom Loop</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {gifyAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="border border-[#E4EAE0] rounded-xl p-4 hover:border-[#4CAF50] transition-all bg-[#FAF9F6]/40 hover:bg-white flex flex-col items-center text-center group"
                >
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-[44px] mb-3 border shadow-2xs group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${asset.color}15`,
                      borderColor: `${asset.color}35`,
                    }}
                  >
                    {asset.previewEmoji}
                  </div>
                  <h4 className="text-[14px] font-bold text-[#2B2D2F]">{asset.name}</h4>
                  <span className="text-[11px] text-[#71806F] mt-0.5">{asset.category}</span>
                  <div className="mt-3 flex items-center gap-2 w-full">
                    <button
                      onClick={() => {
                        setSelectedAsset(asset.id);
                        setActiveTab('studio');
                        onShowToast(`Loaded "${asset.name}" in Studio Workspace`);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-[#EAF5EC] hover:bg-[#D9EEDB] text-[#2D6A4F] text-[11px] font-bold"
                    >
                      Open in Canvas
                    </button>
                    <button
                      onClick={() => {
                        onShowToast(`Copied GIF embed link for "${asset.name}"!`);
                      }}
                      className="p-1.5 rounded-lg border border-[#DEE5DA] text-[#556353] hover:text-[#2B2D2F]"
                      title="Copy embed link"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Alternative Tab: Dedicated Accessories Showcase */}
        {activeTab === 'accessories' && (
          <div className="bg-white rounded-2xl border border-[#E1E8DD] p-6 shadow-xs">
            <div className="pb-5 border-b border-[#F0F4EC]">
              <h2 className="text-[18px] font-bold text-[#2B2D2F] flex items-center gap-2">
                <CuteBackpackIcon size={20} accentColor="#4CAF50" />
                <span>GLÜCK GIFY Boutique Accessories Collection</span>
              </h2>
              <p className="text-[13px] text-[#697967] mt-0.5">
                Every physical accessory is handcrafted with organic linen, enamel, brass, and silk inspired by our botanical lily emblem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {physicalAccessories.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E1E8DD] overflow-hidden bg-[#FAF9F6]/40 hover:bg-white hover:border-[#CADAC5] transition-all flex flex-col group shadow-2xs"
                >
                  <div className="h-56 relative overflow-hidden bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#2D6A4F] font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#DCE3D6]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#768574]">
                          {item.category}
                        </span>
                        <span className="text-[14px] font-bold text-[#2D6A4F]">
                          LKR {item.price.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-[#2B2D2F] mt-1">
                        {item.name}
                      </h4>
                      <p className="text-[12px] text-[#627160] mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EEF2EB] flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddToCart({
                            id: item.id,
                            sku: item.sku,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                            stockQuantity: item.stock,
                            isPersonalizable: true,
                          });
                          onShowToast(`Added "${item.name}" to your bag!`);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2B2D2F] hover:bg-[#1F2421] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenProductModal({
                            id: item.id,
                            sku: item.sku,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                            description: item.description,
                            stockQuantity: item.stock,
                            isPersonalizable: true,
                          });
                        }}
                        className="p-2 rounded-xl border border-[#DCE3D6] text-[#556353] hover:text-[#2B2D2F] hover:bg-[#F2F6EF]"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 6. CREATE NEW GIFY INTERACTIVE MAKER MODAL */}
      {isMakerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5D8] flex flex-col relative">
            <button
              onClick={() => setIsMakerModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#768574] hover:text-[#2B2D2F] hover:bg-[#F2F6EF]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF5EC] border border-[#CFDAC9] flex items-center justify-center">
                <LilyFlowerIcon size={24} accentColor="#4CAF50" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#2B2D2F]">
                  Create Custom GLÜCK GIFY
                </h3>
                <p className="text-[12px] text-[#637261]">
                  Compose an animated botanical keepsake loop
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomGify} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#2B2D2F] mb-1">
                  Gify Title
                </label>
                <input
                  type="text"
                  required
                  value={newGifyTitle}
                  onChange={(e) => setNewGifyTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-[13px] rounded-xl border border-[#DCE5D8] focus:border-[#4CAF50] focus:outline-none"
                  placeholder="e.g. Ruwini's Blooming Joy"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#2B2D2F] mb-1">
                  Card Caption / Keepsake Wish
                </label>
                <textarea
                  rows={2}
                  value={newGifyCaption}
                  onChange={(e) => setNewGifyCaption(e.target.value)}
                  className="w-full px-3.5 py-2 text-[13px] rounded-xl border border-[#DCE5D8] focus:border-[#4CAF50] focus:outline-none"
                  placeholder="May your day bloom with endless delight..."
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#2B2D2F] mb-1.5">
                  Select Primary Motif
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'lily', label: 'White Lily', emoji: '🌸' },
                    { id: 'bunny', label: 'Meadow Bunny', emoji: '🐰' },
                    { id: 'butterfly', label: 'Butterfly', emoji: '🦋' },
                    { id: 'clover', label: 'Glück Clover', emoji: '🍀' },
                  ].map((motif) => (
                    <button
                      type="button"
                      key={motif.id}
                      onClick={() => setNewGifySelectedMotif(motif.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        newGifySelectedMotif === motif.id
                          ? 'border-[#4CAF50] bg-[#EAF5EC] font-bold text-[#2D6A4F]'
                          : 'border-[#DEE5D9] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="text-[20px]">{motif.emoji}</span>
                      <span className="text-[10px]">{motif.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#2B2D2F] mb-1.5">
                  Aesthetic Color Palette
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'lily-green', label: 'Lily Green (#4CAF50)', bg: '#4CAF50' },
                    { id: 'soft-gold', label: 'Sunlit Gold (#E9C46A)', bg: '#E9C46A' },
                    { id: 'pure-cream', label: 'Ivory Lily (#FAF9F6)', bg: '#FAF9F6' },
                    { id: 'charcoal', label: 'Deep Charcoal (#2B2D2F)', bg: '#2B2D2F' },
                  ].map((pal) => (
                    <button
                      type="button"
                      key={pal.id}
                      onClick={() => setNewGifyColorTheme(pal.id)}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                        newGifyColorTheme === pal.id
                          ? 'ring-2 ring-[#4CAF50] border-transparent font-bold'
                          : 'border-[#DEE5D9]'
                      }`}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1 align-middle border border-black/10"
                        style={{ backgroundColor: pal.bg }}
                      />
                      <span>{pal.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F4EC] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMakerModalOpen(false)}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#667664] hover:text-[#2B2D2F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2B2D2F] hover:bg-[#1F2421] text-white text-[13px] font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4CAF50]">
                    auto_awesome
                  </span>
                  <span>Generate Gify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
