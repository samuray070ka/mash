import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: t('Bosh sahifa', 'Главная') },
    { path: '/about', label: t('Biz haqimizda', 'О нас') },
    { path: '/products', label: t('Mahsulotlar', 'Продукция') },
    { path: '/news', label: t('Yangiliklar', 'Новости') },
    { path: '/contact', label: t('Aloqa', 'Контакты') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50" id='navbar'>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-500
          ${isScrolled
            ? "bg-white/60 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75 shadow-md shadow-blue-50"
            : "bg-transparent backdrop-blur-0"
          }
          max-sm:bg-white/60 max-sm:backdrop-blur-lg max-sm:backdrop-saturate-150 max-sm:backdrop-brightness-100 max-sm:shadow-md max-sm:shadow-blue-50
           sm:bg-white/60 sm:backdrop-blur-lg sm:backdrop-saturate-150 sm:backdrop-brightness-100 sm:shadow-md sm:shadow-blue-50
        `}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              data-testid="logo-link"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NamanganMash
                </h1>
                <p className="text-xs text-gray-500">{t('Sanoat uskunalari', 'Промышленное оборудование')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.path}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Toggle & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleLanguage}
                data-testid="language-toggle-btn"
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
              >
                {language === 'uz' ? 'RU' : 'UZ'}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className="lg:hidden p-2 rounded-lg bg-white/50 hover:bg-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 animate-slide-down" data-testid="mobile-menu">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.path}`}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 mb-2 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white/50 text-gray-700 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>
      <div className="w-full bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 p-6  shadow-2xl">
  <h3 className="text-white text-xl font-bold mb-4 text-center">📍 TechFactory - Namangan</h3>
  
  <div className="relative w-full h-80 rounded-xl overflow-hidden">
    {/* 100% ISHLAYDI - ZOOM + SURISH */}
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4863.198!2d71.6436!3d41.0058!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzIwLjgiTiA3McKwMzgnMzcuMiJF!5e0!3m2!1suz!2suz!4v1630000000000"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="absolute inset-0 rounded-xl"
    />
  </div>
  
  
</div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TechFactory</h3>
              <p className="text-gray-300 text-sm">
                {t(
                  'Yuqori sifatli sanoat uskunalari ishlab chiqaruvchisi',
                  'Производитель высококачественного промышленного оборудования'
                )}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('Tezkor havolalar', 'Быстрые ссылки')}</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('Aloqa', 'Контакты')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>+998 71 234-56-78</li>
                <li>info@techfactory.uz</li>
                <li>@techfactory_uz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TechFactory. {t('Barcha huquqlar himoyalangan', 'Все права защищены')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;