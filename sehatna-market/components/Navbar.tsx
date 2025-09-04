import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4">
      <Link href="/" className="font-bold">سحتنا ماركت</Link>
    </nav>
  );
}
