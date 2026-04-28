'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LockKey, Eye, EyeSlash, Warning, CheckCircle } from '@phosphor-icons/react';
import '@/styles/auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // B2, A2: POST запрос авторизации
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Жүйеге кіру сәтті! Бағытталуда...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      } else {
        setError(data.message || 'Кіру сәтсіз аяқталды');
      }
    } catch {
      setError('Желі қатесі. Қайта байланысыңыз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <div className="auth-logo-icon">Z</div>
          <span className="auth-logo-name">Zere Fashion</span>
        </Link>

        <h1 className="auth-title">Қош келдіңіз!</h1>
        <p className="auth-subtitle">Жүйеге кіру үшін тіркелген деректерді енгізіңіз</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <Warning size={18} weight="fill" /> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <CheckCircle size={18} weight="fill" /> {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <div className="input-group">
            <label htmlFor="login-username">Пайдаланушы аты немесе Email</label>
            <div className="input-icon-wrap">
              <User className="input-icon" size={18} />
              <input
                id="login-username"
                name="username"
                type="text"
                className="input-field"
                placeholder="username немесе email"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Құпия сөз</label>
            <div className="input-icon-wrap">
              <LockKey className="input-icon" size={18} />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Құпия сөзіңіз"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Жасыру' : 'Көрсету'}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? <><div className="spinner" /> Жүктелуде...</> : 'Жүйеге кіру'}
          </button>
        </form>

        <p className="auth-footer-text">
          Тіркелмедіңіз бе?{' '}
          <Link href="/register">Тіркелу</Link>
        </p>
      </div>
    </div>
  );
}
