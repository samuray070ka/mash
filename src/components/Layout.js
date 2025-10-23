import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { AiOutlineUser } from "react-icons/ai";
import Carousel from './carusel';

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
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
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex animate-nav_logo items-center space-x-3 group"
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
            <div className="hidden lg:flex animate-nav_center items-center space-x-1">
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
                className="px-4 py-2 animate-nav_logo2 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
              >
                {language === 'uz' ? 'RU' : 'UZ'}
              </button>

               <button className='relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 rounded-full text-lg p-2 lg:p-3 group cursor-pointer animate-nav_logo2'>
                <Link to={'/login'}>
                  <AiOutlineUser />

                <div
                  className="absolute hidden group-hover:block bg-white text-black text-sm rounded-lg px-3 py-1 shadow-md transition-all duration-300 ease-out top-10 left-1/2 -translate-x-1/2 sm:top-auto sm:bottom-10 lg:bottom-auto lg:top-10"
                >
                  Profil
                </div>
                </Link>
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
                  className={`block px-4 animate-nav_logo2 py-3 rounded-lg font-medium transition-all duration-300 mb-2 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-white'
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

      <Carousel/>

          {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
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
          {/*  ijtimoiy tarmoqlar */}
          <div className='mt-10'>
            <p className="text-xl font-bold mb-4">
          {t(
            'Bizning ijtimoiy tarmoqlar',
            'Наши социальные сети'
          )}
        </p>

            <div className="flex  items-end space-x-6 mt-10">
              {[
                { nameUz: 'Instagram', nameRu: 'Инстаграм', icon: <Instagram className="w-6 h-6" />, color: 'hover:text-pink-500', bg: 'bg-pink-600' },
                { nameUz: 'Facebook', nameRu: 'Фейсбук', icon: <Facebook className="w-6 h-6" />, color: 'hover:text-blue-500', bg: 'bg-blue-600' },
                { nameUz: 'YouTube', nameRu: 'Ютуб', icon: <Youtube className="w-6 h-6" />, color: 'hover:text-red-500', bg: 'bg-red-600' },
                { nameUz: 'Telegram', nameRu: 'Телеграм', icon: <Send className="w-6 h-6" />, color: 'hover:text-sky-400', bg: 'bg-sky-600' },
              ].map((item) => (
                <div key={item.nameUz} className="relative group">
                  <span
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white px-2 py-1 rounded-md opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1 ${item.bg} transition-all duration-300 pointer-events-none`}
                  >
                    {t(item.nameUz, item.nameRu)}
                  </span>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-all duration-300 ${item.color}`}
                  >
                    {item.icon}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* ✅ /Yangi qo‘shildi */}

            </div>

<div>
  <h4 className="text-lg font-semibold mb-4">
    {t('Tezkor havolalar', 'Быстрые ссылки')}
  </h4>
  <ul className="space-y-3 text-sm">
    {navLinks.map((link) => (
      <li key={link.path} className="relative block transition-all">
        <Link
          to={link.path}
          className="relative inline-block group text-gray-300 group-hover:text-white transition-colors duration-300"
        >
          {link.label}

          {/* Chiziq + doira */}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-0.5 w-0
            bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full
            overflow-hidden transition-all duration-500 group-hover:w-full">

            {/* Harakatlanayotgan doira */}
            <span className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full animate-dot"></span>
          </span>
        </Link>
      </li>
    ))}
  </ul>

  {/* 🔽 Custom animatsiya style */}
  <style>
    {`
      .animate-dot {
          animation: dotMove 2s ease-in-out infinite;
        }
      @keyframes dotMove {
        0% { transform: translateX(0) translateY(-50%); }
        50% { transform: translateX(100%) translateY(-50%); }
        100% { transform: translateX(0) translateY(-50%); }
      }
    `}
  </style>
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