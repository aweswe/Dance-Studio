import type { Metadata } from 'next';
import { getAdminProducts } from '@/actions/products';
import { ProductsManager } from '@/components/admin/products-manager';
import { DEFAULT_PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Gear & Merch Manager | Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AdminGearPage() {
  const res = await getAdminProducts();
  const products = res.products && res.products.length > 0 ? res.products : DEFAULT_PRODUCTS;

  return (
    <div className="space-y-6">
      <ProductsManager initialProducts={products} />
    </div>
  );
}
