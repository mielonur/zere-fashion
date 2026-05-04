'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  House, ShoppingBag, User, List, X, SignOut,
  Gear, Tag, ChatText, Moon, Sun
} from '@phosphor-icons/react';
import '@/styles/header.css';

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  // Read saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('zere-theme');
    const isLight = saved === 'light';
    setIsDark(!isLight);
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('zere-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('zere-theme', 'light');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Басты бет', icon: <House size={16} /> },
    { href: '/products', label: 'Каталог', icon: <Tag size={16} /> },
    { href: '/reviews', label: 'Пікірлер', icon: <ChatText size={16} /> },
  ];

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase();

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          {/* Логотип */}
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Zere Fashion" className="logo-img" />
          </Link>

          {/* Меню */}
          <nav className="nav">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${pathname === link.href ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Действия */}
          <div className="header-actions">
            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              className="icon-btn theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Жарық режим' : 'Қараңғы режим'}
              aria-label="Тақырыпты ауыстыру"
            >
              {isDark
                ? <Sun size={20} weight="fill" />
                : <Moon size={20} weight="fill" />
              }
            </button>

            <Link href="/cart" className="icon-btn" title="Себет">
              <ShoppingBag size={20} />
            </Link>

            {user ? (
              <div className={`dropdown${dropdownOpen ? ' open' : ''}`}>
                <div
                  className="user-avatar"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  title={user.username}
                >
                  {initials}
                </div>
                <div className="dropdown-menu">
                  <div style={{ padding: '8px 14px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{user.full_name || user.username}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                  </div>
                  <Link href="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> Профиль
                  </Link>
                  <Link href="/profile/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <ShoppingBag size={16} /> Тапсырыстар
                  </Link>
                  <Link href="/profile/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Gear size={16} /> Баптаулар
                  </Link>
                  <hr className="divider" style={{ margin: '8px 0' }} />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <SignOut size={16} /> Шығу
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost" style={{ padding: '8px 18px' }}>
                  <User size={16} /> Кіру
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                  Тіркелу
                </Link>
              </>
            )}

            <button
              className="hamburger"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Меню"
            >
              {mobileOpen ? <X size={22} color="var(--color-text)" /> : (
                <>
                  <span /><span /><span />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav-link${pathname === link.href ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {/* Mobile theme toggle */}
        <button
          className="mobile-nav-link mobile-theme-btn"
          onClick={() => { toggleTheme(); setMobileOpen(false); }}
        >
          {isDark ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
          {isDark ? 'Жарық режим' : 'Қараңғы режим'}
        </button>
        {!user && (
          <>
            <Link href="/login" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Кіру</Link>
            <Link href="/register" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Тіркелу</Link>
          </>
        )}
        {user && (
          <button
            className="mobile-nav-link"
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--color-error)' }}
          >
            Шығу
          </button>
        )}
      </nav>
    </>
  );
}
