'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChatText, Warning, CheckCircle, LockKey } from '@phosphor-icons/react';

interface Review {
  id: number;
  content: string;
  rating: number;
  username: string;
  full_name: string;
  created_at: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          id={`star-${i}`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: i <= (hover || value) ? 'var(--color-gold)' : 'var(--color-border)',
            fontSize: '1.8rem', transition: 'color 0.15s, transform 0.15s',
            transform: i <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
            padding: '0 2px',
          }}
          aria-label={`${i} жұлдыз`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function getInitials(name: string, username: string) {
  if (name?.trim()) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return username.slice(0, 2).toUpperCase();
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ content: '', rating: 5 });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetchReviews();
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setIsLoggedIn(d.success));
  }, []);

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    if (data.success) setReviews(data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim() || form.content.length < 5) {
      setMessage({ type: 'error', text: 'Пікір кемінде 5 символдан тұруы керек' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setForm({ content: '', rating: 5 });
        await fetchReviews();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Желі қатесі' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 8 }}>
          Тұтынушылар
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', marginBottom: 8 }}>Пікірлер мен ұсыныстар</h1>
        <div className="gold-line" />
        <p style={{ color: 'var(--color-text-muted)' }}>Клиенттеріміздің тауарларымыз туралы пікірлері</p>
      </div>

      {/* Add review form */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '32px',
        marginBottom: 40,
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChatText size={22} color="var(--color-gold)" />
          Пікір қалдыру
        </h2>

        {isLoggedIn === false && (
          <div style={{
            padding: '24px', background: 'rgba(212,175,122,0.05)',
            border: '1px solid rgba(212,175,122,0.15)', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <LockKey size={24} color="var(--color-gold)" />
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Пікір қалдыру үшін жүйеге кіріңіз</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Тіркелген пайдаланушылар ғана пікір қалдыра алады</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <Link href="/login" className="btn btn-outline" style={{ padding: '8px 20px' }}>Кіру</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>Тіркелу</Link>
            </div>
          </div>
        )}

        {isLoggedIn === true && (
          <>
            {message.text && (
              <div className={`alert alert-${message.type}`} style={{ marginBottom: 20 }}>
                {message.type === 'success' ? <CheckCircle size={18} weight="fill" /> : <Warning size={18} weight="fill" />}
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} id="review-form" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="input-group">
                <label>Рейтинг</label>
                <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              <div className="input-group">
                <label htmlFor="review-content">Пікіріңіз</label>
                <textarea
                  id="review-content"
                  className="input-field"
                  placeholder="Тауарлар мен қызмет туралы пікіріңізді жазыңыз..."
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  {form.content.length} символ
                </div>
              </div>
              <button
                id="review-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ alignSelf: 'flex-start' }}
              >
                {loading ? <><div className="spinner" /> Жіберілуде...</> : <><ChatText size={16} /> Пікір жіберу</>}
              </button>
            </form>
          </>
        )}

        {isLoggedIn === null && <div style={{ color: 'var(--color-text-muted)' }}>Жүктелуде...</div>}
      </div>

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <ChatText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Пікірлер жоқ. Бірінші болыңыз!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div className="review-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>
                  {getInitials(review.full_name, review.username)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                      {review.full_name || review.username}
                    </span>
                    <div className="review-stars">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={13} weight={i <= review.rating ? 'fill' : 'regular'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                      {new Date(review.created_at).toLocaleDateString('kk-KZ')}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
