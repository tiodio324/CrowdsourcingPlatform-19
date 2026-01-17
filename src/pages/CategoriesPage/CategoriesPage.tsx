import { observer } from 'mobx-react-lite';
import { dataStore, navigationStore } from '@/store';
import { Card, Badge } from '@/components/UI';
import styles from './CategoriesPage.module.scss';

export const CategoriesPage = observer(() => {
  const { activeCategories, ideas, categoriesLoading, setFilter } = dataStore;
  const { navigate } = navigationStore;

  const getIdeaCount = (categoryId: string) => ideas.filter(i => i.isActive && i.categoryId === categoryId).length;

  const handleCategoryClick = (categoryId: string) => { setFilter('categoryId', categoryId); navigate('ideas'); };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Категории</h1>
      {categoriesLoading ? <div className={styles.loading}>Загрузка...</div> : activeCategories.length === 0 ? <div className={styles.empty}>Категории не найдены</div> : (
        <div className={styles.grid}>
          {activeCategories.map(cat => (
            <Card key={cat.id} className={styles.categoryCard} hoverable onClick={() => handleCategoryClick(cat.id)}>
              <h3>{cat.name}</h3>
              {cat.description && <p>{cat.description}</p>}
              <Badge variant="info">{getIdeaCount(cat.id)} идей</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
