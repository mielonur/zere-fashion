'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, Sparkle, Play } from '@phosphor-icons/react';
import '@/styles/home.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
  category_slug: string;
}

interface Review {
  id: number;
  content: string;
  rating: number;
  username: string;
  full_name: string;
  created_at: string;
}

const categories = [
  { name: 'Көйлектер', slug: 'koylekter', emoji: '👗', count: '24+ үлгі' },
  { name: 'Блузалар', slug: 'bluzalar', emoji: '👚', count: '18+ үлгі' },
  { name: 'Шалбарлар', slug: 'shalbalar', emoji: '👖', count: '15+ үлгі' },
  { name: 'Пальтолар', slug: 'paltolar', emoji: '🧥', count: '12+ үлгі' },
];

const categoryColors = [
  'linear-gradient(135deg, #2a1a0a 0%, #1a0e05 100%)',
  'linear-gradient(135deg, #0a1a2a 0%, #051015 100%)',
  'linear-gradient(135deg, #1a0a2a 0%, #0e0515 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #051005 100%)',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} weight={i <= rating ? 'fill' : 'regular'} />
      ))}
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('kk-KZ').format(price);
}

function getInitials(name: string, username: string) {
  if (name && name.trim()) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return username.slice(0, 2).toUpperCase();
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data.slice(0, 4));
      });
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.data.slice(0, 3));
      });
  }, []);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i: { id: number }) => i.id === product.id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <Sparkle size={14} weight="fill" />
              Жаңа коллекция 2024
            </div>
            <h1 className="hero-title">
              Сіздің <span>стиліңіз</span> —<br />
              біздің мақтанышымыз
            </h1>
            <p className="hero-subtitle">
              Zere Fashion-да сізге арналған ең заманауи және сапалы
              әйелдер киімдерін таба аласыз. Мода — бұл өнер.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary" id="hero-catalog-btn">
                <ShoppingBag size={18} weight="fill" />
                Каталогты қарау
              </Link>
              <Link href="/register" className="btn btn-outline" id="hero-register-btn">
                Тіркелу
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <span className="hero-stat-num">500+</span>
                <span className="hero-stat-label">Тауарлар</span>
              </div>
              <div>
                <span className="hero-stat-num">2,400+</span>
                <span className="hero-stat-label">Тұтынушылар</span>
              </div>
              <div>
                <span className="hero-stat-num">4.9★</span>
                <span className="hero-stat-label">Рейтинг</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-badge">Жаңа ★</div>
            <div className="hero-image-wrap">
              {/* Fashion illustration placeholder */}
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(160deg, #1c1712 0%, #0a0806 40%, #13100d 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 16, color: 'var(--color-text-muted)',
                fontSize: '5rem', letterSpacing: '-4px'
              }}>
                <span style={{ fontSize: '6rem' }}>👗</span>
                <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
                  Zere Collection
                </span>
              </div>
            </div>
            <div className="hero-tag-card">
              <div>
                <div className="hero-tag-name">Жазғы коллекция</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>2024 жылдың тренді</div>
              </div>
              <div className="hero-tag-price">бастап 9 800 ₸</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="categories-section">
        <div className="container">
          <div className="section-title">Санаттар</div>
          <div className="gold-line" />
          <p className="section-subtitle">Сіздің стиліңізге сай киімді таңдаңыз</p>

          <div className="category-grid">
            {categories.map((cat, i) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="category-card">
                <div style={{
                  width: '100%', height: '100%',
                  background: categoryColors[i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '5rem'
                }}>
                  {cat.emoji}
                </div>
                <div className="category-overlay">
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.count}</div>
                </div>
                <div className="category-arrow">
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-title">Танымал тауарлар</div>
              <div className="gold-line" />
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Ең сатылатын коллекциялар</p>
            </div>
            <Link href="/products" className="btn btn-outline">
              Барлығын қарау <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {products.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="product-img-wrap" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem', background: 'var(--color-surface-2)'
                  }}>
                    {['👗','👚','👖','🧥'][i]}
                  </div>
                  <div className="product-info">
                    <div className="product-name" style={{ background: 'var(--color-surface-2)', height: 20, borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ background: 'var(--color-surface-2)', height: 16, width: '60%', borderRadius: 4 }} />
                  </div>
                </div>
              ))
            ) : (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrap">
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '5rem', background: 'var(--color-surface-2)',
                      flexDirection: 'column', gap: 8
                    }}>
                      {product.category_slug === 'koylekter' ? '👗'
                        : product.category_slug === 'bluzalar' ? '👚'
                        : product.category_slug === 'shalbalar' ? '👖' : '🧥'}
                    </div>
                    <div className="product-actions-overlay">
                      <button className="product-quick-add" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                        <ShoppingBag size={14} weight="fill" /> Себетке
                      </button>
                    </div>
                    <div className="product-category-badge">
                      <span className="badge badge-gold">{product.category_name}</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      {formatPrice(product.price)}
                      <span className="product-price-currency">₸</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== VIDEO SECTION (B3) ===== */}
      <section className="video-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-title">Бренд туралы</div>
            <div className="gold-line" style={{ margin: '16px auto 20px' }} />
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>
              Zere Fashion брендінің артындағы тарих пен құндылықтарды тануға шақырамыз
            </p>
          </div>
          <div className="video-wrapper">
            {!videoPlaying ? (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #13100d, #0a0806)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 24, cursor: 'pointer'
              }} onClick={() => setVideoPlaying(true)}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(212, 175, 122, 0.3)',
                  transition: 'transform 0.3s'
                }}>
                  <Play size={32} weight="fill" color="#0a0806" />
                </div>
                <p style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  Видеоны ойнату
                </p>
              </div>
            ) : (
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Zere Fashion Brand Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-title">Тұтынушы пікірлері</div>
              <div className="gold-line" />
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Клиенттеріміздің пайымдаулары</p>
            </div>
            <Link href="/reviews" className="btn btn-outline">
              Барлық пікірлер <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {reviews.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0' }}>
                Пікірлер жоқ. Бірінші болыңыз!
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <StarRating rating={review.rating} />
                  <p className="review-content">"{review.content}"</p>
                  <div className="review-author">
                    <div className="review-avatar">
                      {getInitials(review.full_name, review.username)}
                    </div>
                    <div>
                      <div className="review-name">{review.full_name || review.username}</div>
                      <div className="review-date">
                        {new Date(review.created_at).toLocaleDateString('kk-KZ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="newsletter-card">
          <h2 className="section-title">Жаңалықтарды алу</h2>
          <div className="gold-line" style={{ margin: '16px auto 20px' }} />
          <p>Жаңа коллекциялар мен арнайы ұсыныстар туралы бірінші болып хабар алыңыз</p>
          <div className="newsletter-form">
            <input
              id="newsletter-email"
              type="email"
              className="input-field"
              placeholder="Email мекен-жайыңыз"
            />
            <button className="btn btn-primary">Жазылу</button>
          </div>
        </div>
      </section>
    </div>
  );
}
