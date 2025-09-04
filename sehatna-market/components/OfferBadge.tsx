export default function OfferBadge({ offer }: { offer: any }) {
  return (
    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
      {offer.title}
    </span>
  );
}
