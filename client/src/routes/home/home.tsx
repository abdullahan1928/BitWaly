import './home.scss'
import Hero from '../../components/hero/hero'
import ServicesPreview from '../../components/services-preview/services-preview';

const Home = () => {

  return (
    <div className="home-container">
      <Hero />
      <ServicesPreview />
    </div>
  );
};

export default Home;
