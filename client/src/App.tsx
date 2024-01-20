import { Route, Routes } from 'react-router-dom';
import routes from '@/routes/routes';
import RedirectComponent from '@/pages/RedirectComponent';

const App = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.children &&
            route.children.map((child, childIndex) => (
              <Route
                key={childIndex}
                index={child.index}
                path={child.path}
                element={child.element}
              />
            ))}
        </Route>
      ))}
      <Route path=":shortUrl" element={<RedirectComponent />} />
    </Routes>
  );
};

export default App;
