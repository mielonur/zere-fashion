'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash, ArrowRight } from '@phosphor-icons/react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  category_name: string;
  category_slug: string;
  quantity: number;
}

const emojiMap: Record<string, string> = {
  koylekter: '👗', bluzalar: '👚', shalbalar: '👖', paltolar: '🧥',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('kk-KZ').format(price);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(cart);
    };
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const removeItem = (id: number) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return;
    const updated = items.map(i => i.id === id ? { ...i, quantity: qty } : i);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', marginBottom: 8 }}>Себет</h1>
      <div className="gold-line" />

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <ShoppingBag size={64} style={{ margin: '0 auto 20px', color: 'var(--color-text-muted)', opacity: 0.3, display: 'block' }} />
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: '1.05rem' }}>Себет бос</p>
          <Link href="/products" className="btn btn-primary">
            <ShoppingBag size={16} /> Тауарлар қарау
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginTop: 32, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 16, padding: 20,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 12,
                  background: 'var(--color-surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem', flexShrink: 0,
                }}>
                  {emojiMap[item.category_slug] || '👗'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.category_name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="icon-btn" style={{ width: 32, height: 32 }}>−</button>
                  <span style={{ width: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="icon-btn" style={{ width: 32, height: 32 }}>+</button>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--color-gold)', minWidth: 100, textAlign: 'right' }}>
                  {formatPrice(item.price * item.quantity)} ₸
                </div>
                <button onClick={() => removeItem(item.id)} className="icon-btn" title="Жою" style={{ color: 'var(--color-error)' }}>
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 20, padding: 28, position: 'sticky', top: 100,
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 20 }}>Тапсырыс</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <span>Тауарлар ({items.length})</span>
              <span>{formatPrice(total)} ₸</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <span>Жеткізу</span>
              <span style={{ color: 'var(--color-success)' }}>Тегін</span>
            </div>
            <hr style={{ border: 'none', height: 1, background: 'var(--color-border)', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontWeight: 600, fontSize: '1.05rem' }}>
              <span>Жиыны</span>
              <span style={{ color: 'var(--color-gold)' }}>{formatPrice(total)} ₸</span>
            </div>
            <button id="checkout-btn" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
              Тапсырыс беру <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
