'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, EnvelopeSimple, Phone, LockKey, CheckCircle,
  Warning, Pencil, ShoppingBag, ChatText, Calendar
} from '@phosphor-icons/react';

interface UserData {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', new_password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setForm({
            full_name: data.user.full_name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            new_password: '',
          });
        } else {
          router.push('/login');
        }
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setEditMode(false);
        // Refresh user data
        const refreshRes = await fetch('/api/user/profile');
        const refreshData = await refreshRes.json();
        if (refreshData.success) setUser(refreshData.user);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Желі қатесі' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
      {/* Profile Header */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 24,
        padding: '40px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        flexWrap: 'wrap',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(212,175,122,0.03) 100%)',
      } as React.CSSProperties}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-bg)',
          border: '3px solid rgba(212,175,122,0.3)',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 6 }}>
            {user.role === 'admin' ? 'Әкімші' : 'Тіркелген пайдаланушы'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 4 }}>
            {user.full_name || user.username}
          </h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <EnvelopeSimple size={14} /> {user.email}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} /> {new Date(user.created_at).toLocaleDateString('kk-KZ')} тіркелген
            </span>
          </div>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => setEditMode(prev => !prev)}
          id="edit-profile-btn"
        >
          <Pencil size={16} /> {editMode ? 'Бас тарту' : 'Өзгерту'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* Edit Form */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          padding: '32px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 24 }}>
            {editMode ? 'Профильді өзгерту' : 'Профиль ақпараты'}
          </h2>

          {message.text && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: 20 }}>
              {message.type === 'success' ? <CheckCircle size={18} weight="fill" /> : <Warning size={18} weight="fill" />}
              {message.text}
            </div>
          )}

          {editMode ? (
            <form onSubmit={handleSave} id="profile-form" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="input-group">
                <label>Толық аты-жөні</label>
                <div className="input-icon-wrap">
                  <User className="input-icon" size={18} />
                  <input
                    id="profile-fullname"
                    className="input-field"
                    placeholder="Аты Жөні"
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Email</label>
                <div className="input-icon-wrap">
                  <EnvelopeSimple className="input-icon" size={18} />
                  <input
                    id="profile-email"
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Телефон нөмері</label>
                <div className="input-icon-wrap">
                  <Phone className="input-icon" size={18} />
                  <input
                    id="profile-phone"
                    className="input-field"
                    placeholder="+7 (777) 000-00-00"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Жаңа құпия сөз (міндетті емес)</label>
                <div className="input-icon-wrap">
                  <LockKey className="input-icon" size={18} />
                  <input
                    id="profile-newpass"
                    type="password"
                    className="input-field"
                    placeholder="Бос қалдырсаңыз өзгермейді"
                    value={form.new_password}
                    onChange={e => setForm(p => ({ ...p, new_password: e.target.value }))}
                  />
                </div>
              </div>
              <button
                id="save-profile-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ alignSelf: 'flex-start' }}
              >
                {loading ? <><div className="spinner" /> Сақталуда...</> : <><CheckCircle size={16} /> Сақтау</>}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: <User size={16} />, label: 'Пайдаланушы аты', value: user.username },
                { icon: <User size={16} />, label: 'Толық аты-жөні', value: user.full_name || '—' },
                { icon: <EnvelopeSimple size={16} />, label: 'Email', value: user.email },
                { icon: <Phone size={16} />, label: 'Телефон', value: user.phone || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: 'var(--color-text)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { href: '/profile/orders', icon: <ShoppingBag size={18} />, label: 'Менің тапсырыстарым', desc: 'Барлық тапсырыстарды қарау' },
            { href: '/reviews', icon: <ChatText size={18} />, label: 'Пікір қалдыру', desc: 'Тауарлар жайлы пікір беру' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 16, padding: '18px 20px', transition: 'var(--transition)',
              textDecoration: 'none',
            }}
              className="card"
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'rgba(212,175,122,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-gold)', flexShrink: 0,
              }}>{link.icon}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: 2 }}>{link.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{link.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
