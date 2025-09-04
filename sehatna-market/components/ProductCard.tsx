import Link from 'next/link';
import OfferBadge from './OfferBadge';
import { formatCurrency } from '../lib/money';

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded p-4 space-y-2">
      <Link href={`/products/${product.id}`}>
        <h3 className="text-lg font-semibold">{product.name}</h3>
      </Link>
      <p>{formatCurrency(product.price)}</p>
      {product.offer && <OfferBadge offer={product.offer} />}
      {product.vendor && (
        <p className="text-sm text-gray-600">
          <Link href={`/vendors/${product.vendor.id}`}>{product.vendor.name}</Link>
        </p>
      )}
    </div>
  );
}
