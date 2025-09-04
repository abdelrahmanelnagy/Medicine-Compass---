import { formatCurrency } from '../../../../lib/money';
import OfferBadge from '../../../../components/OfferBadge';

async function getProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const [productRes, vendorsRes, offersRes] = await Promise.all([
    fetch(`${base}/api/products/${id}`, { cache: 'no-store' }),
    fetch(`${base}/api/vendors`, { cache: 'no-store' }),
    fetch(`${base}/api/offers/active`, { cache: 'no-store' })
  ]);

  if (productRes.status !== 200) return null;
  const product = await productRes.json();
  const vendors = await vendorsRes.json();
  const offers = await offersRes.json();

  return {
    ...product,
    vendor: vendors.find((v: any) => v.id === product.vendorId),
    offer: offers.find((o: any) => o.productId === product.id) || null
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return <div>المنتج غير موجود</div>;
  return (
    <div className="space-y-2">
      <h1 className="text-2xl">{product.name}</h1>
      <p>{formatCurrency(product.price)}</p>
      {product.offer && <OfferBadge offer={product.offer} />}
      <p className="text-sm text-gray-600">البائع: {product.vendor?.name}</p>
    </div>
  );
}
