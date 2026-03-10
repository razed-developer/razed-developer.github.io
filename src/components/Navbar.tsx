import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/wiki', label: 'Wiki' },
  { to: '/links', label: 'Links' },
];

export function Navbar() {
  return (
    <header className="site-header">
      <div className="page-container site-header__inner">
        <NavLink to="/" className="site-brand">
          <span className="site-brand__mark">RZ</span>
          <div>
            <strong>Razed Pages</strong>
            <span>Public dev dashboard</span>
          </div>
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'site-nav__link is-active' : 'site-nav__link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
