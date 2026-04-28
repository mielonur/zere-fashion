import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Баптаулар</h1>
      <div className="gold-line" />
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Профиль баптауларын өзгерту үшін профиль бетіне өтіңіз</p>
      <Link href="/profile" className="btn btn-outline">← Профильге оралу</Link>
    </div>
  );
}
