import { observer } from 'mobx-react-lite';
import { dataStore } from '@/store';
import { Card, Badge } from '@/components/UI';
import { getIdeaStatusLabel, getIdeaStatusColor } from '@/types';
import styles from './RatingPage.module.scss';

export const RatingPage = observer(() => {
  const { topIdeas, ideasLoading, getCategoryById } = dataStore;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Рейтинг идей</h1>
      {ideasLoading ? <div className={styles.loading}>Загрузка...</div> : topIdeas.length === 0 ? <div className={styles.empty}>Идеи не найдены</div> : (
        <div className={styles.list}>
          {topIdeas.map((idea, index) => (
            <Card key={idea.id} className={styles.ratingCard}>
              <span className={styles.rank}>#{index + 1}</span>
              <div className={styles.content}>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <div className={styles.meta}><span>{getCategoryById(idea.categoryId)?.name}</span><Badge variant={getIdeaStatusColor(idea.status) as 'success'|'warning'|'info'|'error'}>{getIdeaStatusLabel(idea.status)}</Badge></div>
              </div>
              <div className={styles.votes}><span className={styles.voteCount}>{idea.votes}</span><span className={styles.voteLabel}>голосов</span></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
