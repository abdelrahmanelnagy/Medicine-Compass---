import ProductCard from '../components/ProductCard';

async function getProducts() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const [productsRes, vendorsRes, offersRes] = await Promise.all([
    fetch(`${base}/api/products`, { cache: 'no-store' }),
    fetch(`${base}/api/vendors`, { cache: 'no-store' }),
    fetch(`${base}/api/offers/active`, { cache: 'no-store' })
  ]);

  const [products, vendors, offers] = await Promise.all([
    productsRes.json(),
    vendorsRes.json(),
    offersRes.json()
  ]);

  return products.map((p: any) => ({
    ...p,
    vendor: vendors.find((v: any) => v.id === p.vendorId),
    offer: offers.find((o: any) => o.productId === p.id) || null
  }));
}

export default async function Home() {
  const products = await getProducts();
  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p: any) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}
