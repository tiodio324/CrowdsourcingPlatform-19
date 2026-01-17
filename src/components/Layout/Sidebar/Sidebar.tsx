import { observer } from 'mobx-react-lite';
import { navigationStore } from '@/store';
import { PageId } from '@/types';
import styles from './Sidebar.module.scss';

const NavIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'home': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
    case 'lightbulb': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></svg>;
    case 'folder': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;
    case 'star': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>;
    case 'settings': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    default: return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
  }
};

export const Sidebar = observer(() => {
  const { navigationItems, currentPage, navigate, sidebarOpen, mobileMenuOpen, closeMobileMenu } = navigationStore;
  const handleNavClick = (pageId: PageId) => { navigate(pageId); closeMobileMenu(); };
  const sidebarClasses = [styles.sidebar, sidebarOpen ? styles.open : styles.collapsed, mobileMenuOpen ? styles.mobileOpen : ''].filter(Boolean).join(' ');
  return (<>{mobileMenuOpen && <div className={styles.overlay} onClick={closeMobileMenu} />}<aside className={sidebarClasses}><nav className={styles.nav}><ul className={styles.navList}>{navigationItems.map(item => (<li key={item.id}><button className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`} onClick={() => handleNavClick(item.id)} title={item.title}><span className={styles.icon}><NavIcon icon={item.icon} /></span><span className={styles.label}>{item.title}</span></button></li>))}</ul></nav><div className={styles.footer}><p className={styles.copyright}>© 2026</p></div></aside></>);
});
