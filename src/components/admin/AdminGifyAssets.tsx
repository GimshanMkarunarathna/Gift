import React, { useState } from 'react';
import { api } from '../../services/api';
import { LilyFlowerIcon, SparkleStarIcon } from '../brand/BrandIcons';

interface AdminGifyAssetsProps {
  assets: any[];
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminGifyAssets: React.FC<AdminGifyAssetsProps> = ({
  assets,
  onRefresh,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Botanical' | 'Kawaii' | 'Sparkles' | 'Whimsical' | 'Accessories'>('Botanical');
  const [formAnimationPreset, setFormAnimationPreset] = useState<'bloom' | 'gentle-sway' | 'sparkle-pulse' | 'breeze' | 'bounce'>('bloom');
  const [formPreviewEmoji, setFormPreviewEmoji] = useState('🌸');
  const [formSvgIcon, setFormSvgIcon] = useState('local_florist');
  const [formTag, setFormTag] = useState('Signature');
  const [formColor, setFormColor] = useState('#4CAF50');
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setFormTitle('');
    setFormCategory('Botanical');
    setFormAnimationPreset('bloom');
    setFormPreviewEmoji('🌸');
    setFormSvgIcon('local_florist');
    setFormTag('Signature');
    setFormColor('#4CAF50');
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: any) => {
    setEditingAsset(asset);
    setFormTitle(asset.title || asset.name);
    setFormCategory(asset.category || 'Botanical');
    setFormAnimationPreset(asset.animationPreset || 'bloom');
    setFormPreviewEmoji(asset.previewEmoji || '🌸');
    setFormSvgIcon(asset.svgIcon || 'local_florist');
    setFormTag(asset.tag || 'Cute');
    setFormColor(asset.color || '#4CAF50');
    setFormStatus(asset.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Please provide an asset title');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        name: formTitle.trim(),
        category: formCategory,
        animationPreset: formAnimationPreset,
        previewEmoji: formPreviewEmoji,
        svgIcon: formSvgIcon,
        tag: formTag,
        color: formColor,
        status: formStatus,
      };

      if (editingAsset) {
        await api.studio.updateAsset(editingAsset.id, payload);
        onShowToast(`Updated Gify asset "${formTitle}"`);
      } else {
        await api.studio.createAsset(payload);
        onShowToast(`Created Gify asset "${formTitle}"`);
      }

      setIsModalOpen(false);
      setEditingAsset(null);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to save asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (asset: any) => {
    if (!confirm(`Are you sure you want to delete Gify asset "${asset.title || asset.name}"?`)) return;
    try {
      await api.studio.deleteAsset(asset.id);
      onShowToast(`Asset "${asset.title || asset.name}" deleted`);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete asset');
    }
  };

  const filtered = assets.filter((item) => {
    const titleMatch = (item.title || item.name || '').toLowerCase().includes(search.toLowerCase());
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    return titleMatch && categoryMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8D8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <LilyFlowerIcon size={20} color="#4CAF50" />
            <h3 className="text-lg font-bold text-[#2B2D2F]">GLÜCK GIFY Studio Assets</h3>
          </div>
          <p className="text-xs text-[#7A8276] mt-1">
            Manage interactive animated Gify elements, emoji presets, motion speeds, and studio canvas stickers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#3d9140] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add New Gify Asset</span>
        </button>
      </div>

      {/* Filter and search toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#FAF9F6] p-4 rounded-xl border border-[#E2E8D8]">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7A8276] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search assets by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8D8] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none text-[#2B2D2F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Botanical', 'Kawaii', 'Sparkles', 'Whimsical'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#4CAF50] text-white shadow-2xs'
                  : 'bg-white text-[#7A8276] border border-[#E2E8D8] hover:bg-[#FAFBF9]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F2] text-[#688457] font-bold uppercase tracking-wider border-b border-[#E2E8D8]">
              <tr>
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Asset Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Animation Preset</th>
                <th className="py-3.5 px-4">Badge / Tag</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFE5]">
              {filtered.length > 0 ? (
                filtered.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#FAFBF9] transition-colors">
                    <td className="py-3 px-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-2xs border border-[#E2E8D8] transition-transform hover:scale-110"
                        style={{ backgroundColor: `${asset.color}15` }}
                      >
                        <span className={asset.animationPreset === 'bloom' ? 'animate-pulse' : asset.animationPreset === 'bounce' ? 'animate-bounce' : ''}>
                          {asset.previewEmoji || '✨'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2B2D2F]">{asset.title || asset.name}</div>
                      <div className="text-[11px] text-[#7A8276] font-mono mt-0.5">{asset.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-[#EAF5EC] text-[#2D6A4F]">
                        {asset.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#F4F6F2] text-[#4A5568]">
                        <span className="material-symbols-outlined text-[13px]">animation</span>
                        <span>{asset.animationPreset}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: asset.color || '#4CAF50' }}
                      >
                        {asset.tag || 'Cute'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          asset.status === 'active'
                            ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                            : 'bg-[#FFF3E0] text-[#E65100]'
                        }`}
                      >
                        {asset.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(asset)}
                          className="p-1.5 rounded-lg text-[#2D6A4F] hover:bg-[#EAF5EC] transition-colors cursor-pointer"
                          title="Edit Asset"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(asset)}
                          className="p-1.5 rounded-lg text-[#C62828] hover:bg-[#FFEBEE] transition-colors cursor-pointer"
                          title="Delete Asset"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A8276]">
                    No Gify assets found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT ASSET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8D8] shadow-xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8D8] bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <SparkleStarIcon size={18} color="#4CAF50" />
                <h3 className="font-bold text-base text-[#2B2D2F]">
                  {editingAsset ? 'Edit Gify Studio Asset' : 'Add New Gify Studio Asset'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A8276] hover:bg-[#E2E8D8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1">
                  Asset Title <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unfurling Lily, Dancing Meadow Bunny"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none text-[#2B2D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none text-[#2B2D2F] bg-white"
                  >
                    <option value="Botanical">Botanical</option>
                    <option value="Kawaii">Kawaii</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Whimsical">Whimsical</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Animation Preset</label>
                  <select
                    value={formAnimationPreset}
                    onChange={(e: any) => setFormAnimationPreset(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none text-[#2B2D2F] bg-white"
                  >
                    <option value="bloom">Bloom (Unfurling)</option>
                    <option value="gentle-sway">Gentle Sway</option>
                    <option value="sparkle-pulse">Sparkle Pulse</option>
                    <option value="breeze">Breeze Drift</option>
                    <option value="bounce">Bounce (Playful)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Preview Emoji</label>
                  <input
                    type="text"
                    value={formPreviewEmoji}
                    onChange={(e) => setFormPreviewEmoji(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-center rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none"
                    placeholder="🌸"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg border border-[#E2E8D8] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-full px-2 py-2 text-xs font-mono rounded-lg border border-[#E2E8D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Tag Label</label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none"
                    placeholder="Signature"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Publication Status</label>
                <div className="flex items-center gap-4">
                  {(['active', 'draft', 'archived'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 text-xs text-[#2B2D2F] cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === st}
                        onChange={() => setFormStatus(st)}
                        className="accent-[#4CAF50]"
                      />
                      <span className="capitalize">{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6] flex items-center justify-between">
                <span className="text-xs font-medium text-[#7A8276]">Interactive Preview:</span>
                <div
                  className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: formColor }}
                >
                  <span className={formAnimationPreset === 'bloom' ? 'animate-pulse' : formAnimationPreset === 'bounce' ? 'animate-bounce' : ''}>
                    {formPreviewEmoji}
                  </span>
                  <span>{formTitle || 'Gify Asset'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A8276] hover:bg-[#F4F6F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#4CAF50] hover:bg-[#3d9140] text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingAsset ? 'Update Asset' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
