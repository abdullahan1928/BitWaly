import { useAuth } from '@/context/auth.context';
import Hero from '@/features/Home/Hero'
import ServicesPreview from '@/features/Home/ServicesPreview';
import UrlTable from '@/features/Home/UrlTable';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Hero />
      <ServicesPreview />
      {isAuthenticated && <UrlTable />}
    </div>
  );
};

export default Home;
