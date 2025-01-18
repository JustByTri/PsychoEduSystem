import React from 'react';
import Logo from './logo';
import './header.css';

const Header = () => {
  const navLinks = [
    { id: 'about', text: 'About', href: '#about' },
    { id: 'news', text: 'News', href: '#news', subLinks: [
        { id: 'blog', text: 'Blog', href: '/blog' },
        { id: 'event', text: 'Event', href: '/event' },
      ] 
    },
    { id: 'survey', text: 'Survey', href: '#survey' },
    { id: 'contact', text: 'Contact', href: '#contact' },
    { id: 'login', text: 'Login', href: '/login' },
    { id: 'signup', text: 'Sign Up', href: '/signup' },
  ];

  return (
    <header className="header-container">
      <nav>
        <Logo />
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className={link.subLinks ? 'dropdown' : ''}>
              <a href={link.href}>{link.text}</a>
              {link.subLinks && (
                <ul className="dropdown-content">
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.id}>
                      <a href={subLink.href}>{subLink.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;