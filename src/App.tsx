import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import CvViewer from './components/CvViewer';

const HashScroll = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });
  }, [hash, pathname]);

  return null;
};

const Page = ({ children }: { children: ReactNode }) => (
  <Layout>
    <HashScroll />
    {children}
  </Layout>
);

const HomePage = () => (
  <Page>
    <Hero />
    <About />
    <Projects />
    <Experience />
    <Skills />
    <Contact />
  </Page>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/cv',
    element: (
      <Page>
        <CvViewer />
      </Page>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
