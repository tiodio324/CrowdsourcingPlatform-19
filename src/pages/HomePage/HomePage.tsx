import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore, navigationStore } from '@/store';
import { Card, Button, Badge } from '@/components/UI';
import styles from './HomePage.module.scss';

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: 'primary' | 'success' | 'warning' | 'info' }) => (
  <Card className={`${styles.statCard} ${styles[color]}`}><div className={styles.statIcon}>{icon}</div><div className={styles.statContent}><span className={styles.statValue}>{value}</span><span className={styles.statTitle}>{title}</span></div></Card>
);

export const HomePage = observer(() => {
  const { ideas, categories, loadAllData, ideasLoading, approvedIdeas } = dataStore;
  const { isContributor, isAdmin } = authStore;
  const { navigate } = navigationStore;

  useEffect(() => { loadAllData(); }, [loadAllData]);

  const activeIdeas = ideas.filter(i => i.isActive);
  const activeCategories = categories.filter(c => c.isActive);
  const totalVotes = activeIdeas.reduce((s, i) => s + i.votes, 0);

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Платформа коллективных идей</h1>
          <p className={styles.welcomeText}>Делитесь идеями, голосуйте за лучшие, обсуждайте и воплощайте в жизнь!{!isContributor && ' Войдите для участия в обсуждении.'}</p>
          {!authStore.isAuthenticated && <Button variant="primary" size="lg" onClick={() => authStore.openLoginModal()}>Присоединиться</Button>}
        </div>
      </section>
      <section className={styles.stats}>
        <StatCard title="Всего идей" value={ideasLoading ? '...' : activeIdeas.length} color="primary" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>} />
        <StatCard title="Одобрено" value={approvedIdeas.length} color="success" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>} />
        <StatCard title="Голосов" value={totalVotes} color="warning" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>} />
        <StatCard title="Категорий" value={activeCategories.length} color="info" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>} />
      </section>
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Начать работу</h2>
        <div className={styles.actionCards}>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('ideas')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div><h3>Идеи</h3><p>Просмотр и создание идей</p><Badge variant="info">{activeIdeas.length} идей</Badge></Card>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('rating')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg></div><h3>Рейтинг</h3><p>Топ лучших идей</p></Card>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('categories')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div><h3>Категории</h3><p>Темы обсуждений</p></Card>
          {isAdmin && <Card className={styles.actionCard} hoverable onClick={() => navigate('admin')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></div><h3>Админка</h3><p>Управление платформой</p></Card>}
        </div>
      </section>
    </div>
  );
});
