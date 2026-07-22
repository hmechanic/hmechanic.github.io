import { createBrowserRouter } from 'react-router';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import CvPage from '@/pages/CvPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '/cv',
    element: (
      <Layout>
        <CvPage />
      </Layout>
    ),
  },
]);
