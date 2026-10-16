'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Pencil,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Upload,
} from 'lucide-react';
import { type Product, MAX_CATALOG_PRODUCTS, buildWhatsAppOrderLink, resolveProductImageUrl } from '@/data/products';
import { updateProduct, createProduct, toggleProductActive, type ProductInput } from '@/actions/products';
import { cn } from '@/lib/utils/cn';

interface ProductsManagerProps {
  initialProducts: Product[];
}

export function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for edit/create
  const [formData, setFormData] = useState<{
    name: string;
    category: Product['category'];
    tag: string;
    price: number;
    sizes: string;
    imageUrl: string;
    description: string;
    isActive: boolean;
  }>({
    name: '',
    category: 'teen',
    tag: 'TEEN',
    price: 599,
    sizes: 'XS, S, M, L',
    imageUrl: '/gear/dance-tee.svg',
    description: '',
    isActive: true,
  });

  const activeCount = products.filter((p) => p.isActive).length;
  const isCatalogFull = products.length >= MAX_CATALOG_PRODUCTS;

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setStatusMessage(null);

    try {
      const { upload } = await import('@vercel/blob/client');
      const blob = await upload(
        `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        file,
        {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        },
      );
      setFormData((prev) => ({ ...prev, imageUrl: blob.url }));
      setStatusMessage({ text: 'Product photo uploaded to Vercel Blob successfully!', type: 'success' });
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : 'Could not upload image to Vercel',
        type: 'error',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreating(false);
    setFormData({
      name: p.name,
      category: p.category,
      tag: p.tag,
      price: p.price,
      sizes: p.sizes.join(', '),
      imageUrl: p.imageUrl,
      description: p.description,
      isActive: p.isActive,
    });
  };

  const handleOpenCreate = () => {
    if (isCatalogFull) {
      setStatusMessage({
        text: `Catalog is at maximum capacity (${MAX_CATALOG_PRODUCTS} products). Please edit or deactivate an existing product.`,
        type: 'error',
      });
      return;
    }
    setEditingProduct(null);
    setIsCreating(true);
    setFormData({
      name: '',
      category: 'teen',
      tag: 'NEW',
      price: 599,
      sizes: 'S, M, L, XL',
      imageUrl: '/gear/dance-tee.svg',
      description: '',
      isActive: true,
    });
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const sizesArray = formData.sizes
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          tag: formData.tag,
          price: formData.price,
          sizes: sizesArray.length > 0 ? sizesArray : ['M'],
          image_url: formData.imageUrl,
          description: formData.description,
          is_active: formData.isActive,
        });

        if (!res.success) {
          setStatusMessage({ text: res.error || 'Failed to update product', type: 'error' });
          setIsLoading(false);
          return;
        }

        setProducts((prev) =>
          prev.map((item) =>
            item.id === editingProduct.id
              ? {
                  ...item,
                  name: formData.name,
                  category: formData.category,
                  tag: formData.tag,
                  price: formData.price,
                  sizes: sizesArray.length > 0 ? sizesArray : ['M'],
                  imageUrl: formData.imageUrl,
                  description: formData.description,
                  isActive: formData.isActive,
                }
              : item
          )
        );
        setStatusMessage({ text: `Updated "${formData.name}" successfully`, type: 'success' });
      } else if (isCreating) {
        const res = await createProduct({
          name: formData.name,
          category: formData.category,
          tag: formData.tag,
          price: formData.price,
          sizes: sizesArray.length > 0 ? sizesArray : ['M'],
          image_url: formData.imageUrl,
          description: formData.description,
          is_active: formData.isActive,
        });

        if (!res.success || !res.id) {
          setStatusMessage({ text: res.error || 'Failed to create product', type: 'error' });
          setIsLoading(false);
          return;
        }

        const newProd: Product = {
          id: res.id,
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: formData.category,
          tag: formData.tag,
          price: formData.price,
          sizes: sizesArray.length > 0 ? sizesArray : ['M'],
          imageUrl: formData.imageUrl,
          description: formData.description,
          isActive: formData.isActive,
          sortOrder: products.length + 1,
        };

        setProducts((prev) => [...prev, newProd]);
        setStatusMessage({ text: `Created "${formData.name}" successfully`, type: 'success' });
      }
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setStatusMessage({ text: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    const nextState = !p.isActive;
    setIsLoading(true);
    try {
      const res = await toggleProductActive(p.id, nextState);
      if (res.success) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: nextState } : item))
        );
        setStatusMessage({
          text: `Product "${p.name}" is now ${nextState ? 'Active' : 'Hidden'}`,
          type: 'success',
        });
      } else {
        setStatusMessage({ text: res.error || 'Failed to toggle visibility', type: 'error' });
      }
    } catch {
      setStatusMessage({ text: 'Error toggling product status', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md border border-line bg-surface">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-bl" />
            <h1 className="text-xl font-bold font-anton uppercase tracking-wide text-ink">
              Rhythmzz Gear Storefront Manager
            </h1>
          </div>
          <p className="text-xs text-ink-3">
            Manage your 10-product merchandise catalog. Updates to images, pricing, and sizes immediately sync with WhatsApp automation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md border border-line bg-canvas text-xs font-mono font-bold">
            <span className="text-ink-3">Catalog Limit: </span>
            <span className={cn(activeCount >= MAX_CATALOG_PRODUCTS ? 'text-amber-500' : 'text-bl')}>
              {products.length} / {MAX_CATALOG_PRODUCTS} Products
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            disabled={isCatalogFull}
            className={cn(
              'h-10 px-4 rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer',
              isCatalogFull
                ? 'bg-line text-ink-3 cursor-not-allowed opacity-60'
                : 'bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950'
            )}
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>

          <Link
            href="/gear"
            target="_blank"
            className="h-10 px-3 rounded-md border border-line bg-canvas hover:bg-canvas-muted text-ink text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={cn(
            'p-3.5 rounded-md text-xs font-mono flex items-center justify-between',
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
          )}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-current hover:opacity-75 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-md border border-line bg-surface overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[640px] text-left text-xs font-body">
            <thead className="bg-canvas-muted border-b border-line text-[10px] font-mono uppercase tracking-wider text-ink-3">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Available Sizes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {products.map((item) => {
                const whatsappPreview = buildWhatsAppOrderLink(item, item.sizes[0] || 'M');

                return (
                  <tr key={item.id} className="hover:bg-canvas-muted/50 transition-colors">
                    {/* Item & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded border border-line bg-canvas p-1 relative overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={resolveProductImageUrl(item.imageUrl, '/gear/dance-tee.svg')}
                            alt={item.name}
                            width={48}
                            height={56}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-ink text-sm">{item.name}</p>
                          <p className="text-[10px] font-mono text-ink-3">{item.tag || item.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded font-mono text-[10px] bg-canvas border border-line text-ink-2">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-anton text-base text-ink">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Sizes */}
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-bl/10 text-bl border border-bl/20"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
                          item.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-500'
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', item.isActive ? 'bg-emerald-500' : 'bg-zinc-400')} />
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* WhatsApp preview */}
                        <a
                          href={whatsappPreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Test WhatsApp Order Link"
                          className="p-1.5 rounded text-ink-3 hover:text-bl hover:bg-canvas transition-colors"
                        >
                          <MessageCircle size={15} />
                        </a>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={isLoading}
                          title={item.isActive ? 'Hide product' : 'Make active'}
                          className="p-1.5 rounded text-ink-3 hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                        >
                          {item.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="h-7 px-2.5 rounded font-mono text-[11px] font-bold border border-line bg-canvas hover:border-bl hover:text-bl flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Edit or Create */}
      {(editingProduct || isCreating) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blk/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl rounded-md border border-line bg-canvas p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-anton text-xl uppercase tracking-tight text-ink">
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Gear Item'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-ink-3 hover:text-ink cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-body">
              {/* Product Name */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rhythmzz Core Hoodie"
                  className="w-full h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                />
              </div>

              {/* Category & Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as Product['category'] })
                    }
                    className="w-full h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                  >
                    <option value="teen">Teen</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                    Tag / Badge (e.g. TEEN, BESTSELLER)
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="TEEN"
                    className="w-full h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                  />
                </div>
              </div>

              {/* Price & Sizes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                    Sizes (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                  />
                </div>
              </div>

              {/* Image URL with live preview */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                  Image URL / Asset Path *
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/gear/dance-tee.svg or https://..."
                    className="flex-1 h-10 px-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl"
                  />
                  <input
                    ref={imageFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleProductImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => imageFileRef.current?.click()}
                    disabled={isUploadingImage}
                    className="h-10 px-3 rounded-md border border-line bg-surface hover:border-bl text-ink text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isUploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload to Vercel'}</span>
                  </button>
                  <div className="w-10 h-10 rounded border border-line bg-surface shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <Image
                      src={resolveProductImageUrl(formData.imageUrl, '/gear/dance-tee.svg')}
                      alt="Preview"
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap text-[10px] font-mono text-ink-3">
                  <span>Presets:</span>
                  {['dance-tee', 'dance-shorts', 'sports-bra', 'dance-jacket', 'active-shorts', 'track-tee', 'track-pants', 'studio-hoodie', 'studio-cap', 'duffle-bag'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: `/gear/${s}.svg` })}
                      className="underline hover:text-bl cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-3 mb-1 font-bold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ultra-soft moisture-wicking fabric..."
                  className="w-full p-3 rounded-md border border-line bg-surface text-ink text-xs focus:outline-none focus:border-bl leading-relaxed"
                />
              </div>

              {/* Visibility checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-line text-bl focus:ring-bl"
                />
                <label htmlFor="isActiveToggle" className="font-mono text-xs text-ink font-semibold">
                  Publish on public storefront
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-10 px-4 rounded-md font-mono text-xs font-bold uppercase tracking-wider border border-line hover:bg-surface text-ink-2 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 px-5 rounded-md font-mono text-xs font-bold uppercase tracking-wider bg-bl text-slate-950 hover:bg-bl-deep hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isLoading && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
