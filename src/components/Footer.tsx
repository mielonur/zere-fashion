'use client';

import Link from 'next/link';
import {
  InstagramLogo, TelegramLogo, FacebookLogo, YoutubeLogo,
  MapPin, Phone, EnvelopeSimple, Clock
} from '@phosphor-icons/react';
import '@/styles/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">Z</div>
            <div>
              <div className="footer-brand-name">Zere Fashion</div>
              <div className="footer-brand-tag">Сән мен стиль</div>
            </div>
          </div>
          <p className="footer-desc">
            Зере Fashion — қазақстандық әйелдерге арналған сән-сәнді киім брендi.
            Сіздің стиліңізді жаңа деңгейге көтереміз.
          </p>
          {/* B1/B3: Социальные сети */}
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
              <InstagramLogo size={18} weight="fill" />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link" title="Telegram">
              <TelegramLogo size={18} weight="fill" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
              <FacebookLogo size={18} weight="fill" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
              <YoutubeLogo size={18} weight="fill" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="footer-col-title">Навигация</div>
          <div className="footer-links">
            <Link href="/" className="footer-link">Басты бет</Link>
            <Link href="/products" className="footer-link">Барлық тауарлар</Link>
            <Link href="/products?category=koylekter" className="footer-link">Көйлектер</Link>
            <Link href="/products?category=bluzalar" className="footer-link">Блузалар</Link>
            <Link href="/products?category=shalbalar" className="footer-link">Шалбарлар</Link>
            <Link href="/products?category=paltolar" className="footer-link">Пальтолар</Link>
            <Link href="/reviews" className="footer-link">Пікірлер</Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <div className="footer-col-title">Аккаунт</div>
          <div className="footer-links">
            <Link href="/login" className="footer-link">Жүйеге кіру</Link>
            <Link href="/register" className="footer-link">Тіркелу</Link>
            <Link href="/profile" className="footer-link">Менің профилім</Link>
            <Link href="/profile/orders" className="footer-link">Тапсырыстар</Link>
          </div>
        </div>

        {/* B1: Реквизиты и местоположение */}
        <div>
          <div className="footer-col-title">Байланыс</div>
          <div className="footer-contacts">
            <div className="footer-contact-item">
              <Phone size={16} weight="fill" className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Телефон</span>
                <span className="footer-contact-val">+7 (777) 123-45-67</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <EnvelopeSimple size={16} weight="fill" className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Email</span>
                <span className="footer-contact-val">info@zerefashion.kz</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <MapPin size={16} weight="fill" className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Мекен-жай</span>
                <span className="footer-contact-val">Алматы қ., Абай даңғылы 150</span>
              </div>
            </div>
            <div className="footer-contact-item">
              <Clock size={16} weight="fill" className="footer-contact-icon" />
              <div>
                <span className="footer-contact-label">Жұмыс уақыты</span>
                <span className="footer-contact-val">Дс-Жм: 09:00–19:00</span>
              </div>
            </div>
          </div>
          {/* Местоположение */}
          <a
            href="https://maps.google.com/?q=Almaty,Kazakhstan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map"
          >
            <MapPin size={16} />
            Картада қарау
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © {year} Zere Fashion. Барлық құқықтар қорғалған.
        </p>
        <div className="footer-bottom-links">
          <Link href="/privacy" className="footer-bottom-link">Құпиялылық саясаты</Link>
          <Link href="/terms" className="footer-bottom-link">Пайдалану шарттары</Link>
        </div>
      </div>
    </footer>
  );
}
