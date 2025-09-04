import ProductCard from '../../../../components/ProductCard';

async function getVendorData(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const [vendorRes, productsRes, offersRes] = await Promise.all([
    fetch(`${base}/api/vendors/${id}`, { cache: 'no-store' }),
    fetch(`${base}/api/products`, { cache: 'no-store' }),
    fetch(`${base}/api/offers/active`, { cache: 'no-store' })
  ]);

  if (vendorRes.status !== 200) return null;
  const vendor = await vendorRes.json();
  const products = await productsRes.json();
  const offers = await offersRes.json();

  const vendorProducts = products
    .filter((p: any) => p.vendorId === id)
    .map((p: any) => ({
      ...p,
      vendor,
      offer: offers.find((o: any) => o.productId === p.id) || null
    }));

  return { vendor, products: vendorProducts };
}

export default async function VendorPage({ params }: { params: { id: string } }) {
  const data = await getVendorData(params.id);
  if (!data) return <div>المورد غير موجود</div>;
  return (
    <div>
      <h1 className="text-2xl mb-4">{data.vendor.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
