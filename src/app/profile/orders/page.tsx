import Link from 'next/link';
import { Package } from '@phosphor-icons/react/dist/ssr';

export default function OrdersPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <Package size={80} style={{ margin: '0 auto 24px', color: 'var(--color-text-muted)', opacity: 0.3, display: 'block' }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Тапсырыстар</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Тапсырыстарыңыз осы жерде көрсетіледі</p>
      <Link href="/products" className="btn btn-primary">
        Тауарларды қарау
      </Link>
    </div>
  );
}
