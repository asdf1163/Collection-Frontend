import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Index from './pages/Index';
import Navbar from './components/Navbar';
import Profile from './pages/profile/Profile';
import Item from './pages/profile/item/Item';
import ItemList from './pages/profile/item/ItemList';
import AdminPage from './pages/Admin/Index'
import Signin from './pages/Authentication/Signin';
import Signup from './pages/Authentication/Signup';
import { ThemeContext, ThemeContextType } from './context/ThemeContext'
import { AuthContext, AuthContextType } from './context/AuthContext';
import Collection from './pages/profile/options/Collection';
import Main from './pages/profile/options/Main';
import Liked from './pages/profile/options/Liked';

function App() {

  const { auth } = useContext(AuthContext) as AuthContextType
  const { theme } = useContext(ThemeContext) as ThemeContextType

  return (
    <BrowserRouter>
      <Navbar />
      <Container className={`bg-${theme.variant} min-vh-100 text-${theme.fontColor}`} fluid>
        <Routes>
          {(auth.privilage === 'admin' || auth.privilage === 'owner') &&
            <Route path="/_admin" element={<AdminPage />} />
          }
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={auth._id ? <Navigate to={'/'} /> : <Signin />} />
          <Route path="/signup" element={auth._id ? <Navigate to={'/'} /> : <Signup />} />
          <Route path="/:username" element={<Profile />} >
            <Route index element={<Main />} />
            <Route path='collection' element={<Collection />} />
            <Route path='liked' element={<Liked />} />
            <Route path="/:username/collection/:collectionId" element={<ItemList />} />
          </Route>
          <Route path="/:username/item/:itemId" element={<Item />} />
          <Route path="/item/:itemId" element={<Item />} />
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </Container >
    </BrowserRouter>
  );
}

export default App;
