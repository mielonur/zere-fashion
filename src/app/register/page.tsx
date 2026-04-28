'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LockKey, EnvelopeSimple, Eye, EyeSlash, Warning, CheckCircle, IdentificationCard } from '@phosphor-icons/react';
import '@/styles/auth.css';

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ['', 'Өте нашар', 'Нашар', 'Орташа', 'Күшті'];
const strengthColors = ['', '#e05b5b', '#e8a030', '#b8d050', '#6bb87f'];

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  // B2: Валидация на стороне клиента
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Толық атыңызды енгізіңіз';
    if (!form.username.trim() || form.username.length < 3) newErrors.username = 'Пайдаланушы аты кемінде 3 символ болуы керек';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) newErrors.username = 'Тек латын әріптері, сандар және _ белгісі';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Жарамды email енгізіңіз';
    if (!form.password || form.password.length < 6) newErrors.password = 'Құпия сөз кемінде 6 символдан тұруы керек';
    if (form.password !== form.confirm_password) newErrors.confirm_password = 'Құпия сөздер сәйкес келмейді';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      // A2, A3: POST запрос регистрации
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          full_name: form.full_name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Тіркелу сәтті! Бас бетке бағытталуда...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);
      } else {
        setServerError(data.message || 'Тіркелу сәтсіз аяқталды');
      }
    } catch {
      setServerError('Желі қатесі. Қайта байланысыңыз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <Link href="/" className="auth-logo">
          <div className="auth-logo-icon">Z</div>
          <span className="auth-logo-name">Zere Fashion</span>
        </Link>

        <h1 className="auth-title">Тіркелу</h1>
        <p className="auth-subtitle">Жаңа коллекцияларды бірінші болып алыңыз</p>

        {serverError && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <Warning size={18} weight="fill" /> {serverError}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <CheckCircle size={18} weight="fill" /> {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} id="register-form" noValidate>
          {/* Full name */}
          <div className="input-group">
            <label htmlFor="reg-fullname">Толық аты-жөніңіз</label>
            <div className="input-icon-wrap">
              <IdentificationCard className="input-icon" size={18} />
              <input
                id="reg-fullname"
                name="full_name"
                type="text"
                className={`input-field${errors.full_name ? ' error' : ''}`}
                placeholder="Аты Жөні"
                value={form.full_name}
                onChange={handleChange}
              />
            </div>
            {errors.full_name && <span className="field-error"><Warning size={12} />{errors.full_name}</span>}
          </div>

          {/* Username */}
          <div className="input-group">
            <label htmlFor="reg-username">Пайдаланушы аты</label>
            <div className="input-icon-wrap">
              <User className="input-icon" size={18} />
              <input
                id="reg-username"
                name="username"
                type="text"
                className={`input-field${errors.username ? ' error' : ''}`}
                placeholder="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className="field-error"><Warning size={12} />{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="reg-email">Email</label>
            <div className="input-icon-wrap">
              <EnvelopeSimple className="input-icon" size={18} />
              <input
                id="reg-email"
                name="email"
                type="email"
                className={`input-field${errors.email ? ' error' : ''}`}
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="field-error"><Warning size={12} />{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="reg-password">Құпия сөз</label>
            <div className="input-icon-wrap">
              <LockKey className="input-icon" size={18} />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`input-field${errors.password ? ' error' : ''}`}
                placeholder="Кемінде 6 символ"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className={`strength-fill strength-${passwordStrength}`}
                    style={{ background: strengthColors[passwordStrength] }}
                  />
                </div>
                <span className="strength-label" style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
            {errors.password && <span className="field-error"><Warning size={12} />{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="input-group">
            <label htmlFor="reg-confirm">Құпия сөзді қайталаңыз</label>
            <div className="input-icon-wrap">
              <LockKey className="input-icon" size={18} />
              <input
                id="reg-confirm"
                name="confirm_password"
                type={showPassword ? 'text' : 'password'}
                className={`input-field${errors.confirm_password ? ' error' : ''}`}
                placeholder="Құпия сөзді қайталаңыз"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirm_password && <span className="field-error"><Warning size={12} />{errors.confirm_password}</span>}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? <><div className="spinner" /> Жүктелуде...</> : 'Тіркелу'}
          </button>
        </form>

        <p className="auth-footer-text">
          Тіркелген болсаңыз?{' '}
          <Link href="/login">Жүйеге кіру</Link>
        </p>
      </div>
    </div>
  );
}
