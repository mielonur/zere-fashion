'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Funnel } from '@phosphor-icons/react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
  category_slug: string;
}

const categories = [
  { name: 'Барлығы', slug: '' },
  { name: 'Көйлектер', slug: 'koylekter' },
  { name: 'Блузалар', slug: 'bluzalar' },
  { name: 'Шалбарлар', slug: 'shalbalar' },
  { name: 'Пальтолар', slug: 'paltolar' },
];

const productImageMap: Record<string, string[]> = {
  koylekter: ['/images/dress1.jpg', '/images/dress2.jpg'],
  bluzalar: ['/images/blouse1.jpg', '/images/blouse2.jpg'],
  shalbalar: ['/images/pants1.jpg', '/images/pants2.jpg'],
  paltolar: ['/images/coat1.jpg', '/images/coat2.jpg'],
};

function getProductImage(slug: string, id: number): string {
  const imgs = productImageMap[slug] || ['/images/dress1.jpg'];
  return imgs[id % imgs.length];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('kk-KZ').format(price);
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCat = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const url = selectedCat ? `/api/products?category=${selectedCat}` : '/api/products';
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.data);
        setLoading(false);
      });
  }, [selectedCat]);

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
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 8 }}>
          Zere Fashion
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', marginBottom: 8 }}>
          Каталог
        </h1>
        <div className="gold-line" />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
        <Funnel size={18} color="var(--color-text-muted)" />
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
            className={`badge${selectedCat === cat.slug ? ' badge-gold' : ''}`}
            id={`filter-${cat.slug || 'all'}`}
            style={{
              padding: '8px 18px',
              cursor: 'pointer',
              background: selectedCat === cat.slug ? 'rgba(212,175,122,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedCat === cat.slug ? 'rgba(212,175,122,0.4)' : 'var(--color-border)'}`,
              color: selectedCat === cat.slug ? 'var(--color-gold)' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 500,
              transition: 'var(--transition)',
            }}
          >
            {cat.name}
          </Link>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {products.length} тауар табылды
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      ) : (
        <div className="grid-4">
          {products.map(product => (
            <div key={product.id} className="product-card" style={{ cursor: 'default' }}>
              <div className="product-img-wrap">
                <img
                  src={getProductImage(product.category_slug, product.id)}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="product-actions-overlay">
                  <button
                    className="product-quick-add"
                    id={`add-to-cart-${product.id}`}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag size={14} weight="fill" /> Себетке
                  </button>
                </div>
                <div className="product-category-badge">
                  <span className="badge badge-gold">{product.category_name}</span>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 10px', lineHeight: 1.5 }}>
                  {product.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="product-price">
                    {formatPrice(product.price)}
                    <span className="product-price-currency">₸</span>
                  </div>
                  <button
                    className="btn btn-outline"
                    id={`buy-${product.id}`}
                    onClick={() => addToCart(product)}
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    <ShoppingBag size={13} /> Сатып алу
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Бұл санатта тауарлар жоқ</p>
          <Link href="/products" className="btn btn-outline" style={{ marginTop: 20 }}>
            Барлық тауарлар
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
