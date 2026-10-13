import React, { useState } from 'react';
import { api } from '../../services/api';
import { CuteBackpackIcon, SparkleStarIcon } from '../brand/BrandIcons';

interface AdminCuteAccessoriesProps {
  accessories: any[];
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminCuteAccessories: React.FC<AdminCuteAccessoriesProps> = ({
  accessories,
  onRefresh,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<any | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(1850);
  const [formStock, setFormStock] = useState(25);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Jewelry & Pins');
  const [formBadge, setFormBadge] = useState('Bestseller');
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingAccessory(null);
    setFormTitle('');
    setFormSku(`GK-${Math.floor(100 + Math.random() * 900)}`);
    setFormPrice(2200);
    setFormStock(20);
    setFormImageUrl('https://images.unsplash.com/photo-1611591475878-83141dfd16a5?auto=format&fit=crop&w=500&q=80');
    setFormDescription('Handcrafted botanical accessory sculpted with delicate lily motifs.');
    setFormCategory('Jewelry & Pins');
    setFormBadge('New');
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingAccessory(item);
    setFormTitle(item.title || item.name);
    setFormSku(item.sku || '');
    setFormPrice(item.price || 0);
    setFormStock(item.stock || 0);
    setFormImageUrl(item.imageUrl || item.image || '');
    setFormDescription(item.description || '');
    setFormCategory(item.category || 'Jewelry & Pins');
    setFormBadge(item.badge || '');
    setFormStatus(item.status || 'active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Please enter an accessory title');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        name: formTitle.trim(),
        sku: formSku.trim(),
        price: Number(formPrice),
        stock: Number(formStock),
        imageUrl: formImageUrl.trim(),
        description: formDescription.trim(),
        category: formCategory,
        badge: formBadge || undefined,
        status: formStatus,
      };

      if (editingAccessory) {
        await api.studio.updateAccessory(editingAccessory.id, payload);
        onShowToast(`Updated accessory "${formTitle}"`);
      } else {
        await api.studio.createAccessory(payload);
        onShowToast(`Created accessory "${formTitle}"`);
      }

      setIsModalOpen(false);
      setEditingAccessory(null);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to save accessory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete accessory "${item.title || item.name}"?`)) return;
    try {
      await api.studio.deleteAccessory(item.id);
      onShowToast(`Accessory "${item.title || item.name}" removed`);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete accessory');
    }
  };

  const handleStockQuickUpdate = async (item: any, delta: number) => {
    const newStock = Math.max(0, (item.stock || 0) + delta);
    try {
      await api.studio.updateAccessory(item.id, { stock: newStock });
      onShowToast(`Updated stock for ${item.title || item.name}: ${newStock} units`);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update stock');
    }
  };

  const filtered = accessories.filter((item) => {
    const titleMatch = (item.title || item.name || '').toLowerCase().includes(search.toLowerCase());
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    return titleMatch && categoryMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8D8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CuteBackpackIcon size={20} color="#4CAF50" />
            <h3 className="text-lg font-bold text-[#2B2D2F]">Cute Accessories Management</h3>
          </div>
          <p className="text-xs text-[#7A8276] mt-1">
            Curate physical botanical keepsakes, enamel pins, silk scarves, journals, and luxury packaging.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#3d9140] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          <span>Add Cute Accessory</span>
        </button>
      </div>

      {/* Search & filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#FAF9F6] p-4 rounded-xl border border-[#E2E8D8]">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7A8276] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search accessories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8D8] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none text-[#2B2D2F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Jewelry & Pins', 'Wearables', 'Stationery', 'Organizers', 'Drinkware'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#4CAF50] text-white shadow-2xs'
                  : 'bg-white text-[#7A8276] border border-[#E2E8D8] hover:bg-[#FAFBF9]'
              }`}
            >
              {cat === 'all' ? 'All Accessories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accessories Grid / Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F2] text-[#688457] font-bold uppercase tracking-wider border-b border-[#E2E8D8]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category &amp; SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFE5]">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFBF9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || item.image}
                          alt={item.title || item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E2E8D8] shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-[#2B2D2F] line-clamp-1">
                            {item.title || item.name}
                          </div>
                          <div className="text-[11px] text-[#7A8276] line-clamp-1 max-w-xs mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#2B2D2F]">{item.category}</div>
                      <div className="text-[10px] text-[#7A8276] font-mono">{item.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2D6A4F]">
                      LKR {Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            item.stock <= 5
                              ? 'text-[#C62828]'
                              : item.stock <= 15
                              ? 'text-[#F57F17]'
                              : 'text-[#2D6A4F]'
                          }`}
                        >
                          {item.stock} in stock
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleStockQuickUpdate(item, -1)}
                            className="w-5 h-5 rounded bg-[#F4F6F2] hover:bg-[#E2E8D8] text-[11px] flex items-center justify-center font-bold text-[#7A8276]"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleStockQuickUpdate(item, 5)}
                            className="w-5 h-5 rounded bg-[#EAF5EC] hover:bg-[#D4EDDA] text-[11px] flex items-center justify-center font-bold text-[#2D6A4F]"
                            title="Restock +5"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF0D7] text-[#B58517]">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-[#A0A69D] text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'active'
                            ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                            : 'bg-[#FFF3E0] text-[#E65100]'
                        }`}
                      >
                        {item.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-[#2D6A4F] hover:bg-[#EAF5EC] transition-colors cursor-pointer"
                          title="Edit Accessory"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-[#C62828] hover:bg-[#FFEBEE] transition-colors cursor-pointer"
                          title="Delete Accessory"
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
                    No cute accessories found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT ACCESSORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8D8] shadow-xl overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8D8] bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <SparkleStarIcon size={18} color="#4CAF50" />
                <h3 className="font-bold text-base text-[#2B2D2F]">
                  {editingAccessory ? 'Edit Cute Accessory' : 'Add New Cute Accessory'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A8276] hover:bg-[#E2E8D8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1">
                  Accessory Title <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lily Blossom Enamel Pin"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none text-[#2B2D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] font-mono outline-none"
                    placeholder="GK-PIN-01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none bg-white text-[#2B2D2F]"
                  >
                    <option value="Jewelry & Pins">Jewelry &amp; Pins</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Organizers">Organizers</option>
                    <option value="Drinkware">Drinkware</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Price (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Image URL / Upload Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none"
                />
                {formImageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-[#FAF9F6] border border-[#E2E8D8]">
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-[#E2E8D8]"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                    <span className="text-[11px] text-[#7A8276]">Image Preview Loaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Crafted with pure organic materials and signature botanical detailing..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] focus:border-[#4CAF50] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Bestseller, Limited, Artisan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2D2F] mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8D8] outline-none bg-white"
                  >
                    <option value="active">Active (Visible in boutique)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

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
                  {isSubmitting ? 'Saving...' : editingAccessory ? 'Update Accessory' : 'Create Accessory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
