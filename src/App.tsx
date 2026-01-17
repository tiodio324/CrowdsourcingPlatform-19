import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { navigationStore, dataStore } from '@/store';
import { MainLayout, LoginModal, ConfirmModal, Toast } from '@/components';
import { HomePage, IdeasPage, CategoriesPage, RatingPage, AdminPage } from '@/pages';

const PageRouter = observer(() => {
  const { currentPage } = navigationStore;
  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'ideas': return <IdeasPage />;
    case 'categories': return <CategoriesPage />;
    case 'rating': return <RatingPage />;
    case 'admin': case 'admin-ideas': case 'admin-categories': return <AdminPage />;
    default: return <HomePage />;
  }
});

const App = observer(() => {
  useEffect(() => { dataStore.loadAllData(); }, []);
  return (<><MainLayout><PageRouter /></MainLayout><LoginModal /><ConfirmModal /><Toast /></>);
});

export default App;
