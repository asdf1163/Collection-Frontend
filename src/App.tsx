import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Index from './pages/Index';
import Navbar from './components/Navbar';
import Profile from './pages/profile/Profile/Profile';
import Item from './pages/profile/item/Item';
import CollectionItems from './pages/profile/item/CollectionItems';
import AdminPage from './pages/Admin/Index'
import Signin from './pages/Authentication/Signin';
import Signup from './pages/Authentication/Signup';
import { ThemeContext, ThemeContextType } from './context/ThemeContext'
import { AuthContext, AuthContextType } from './context/AuthContext';
import Collection from './pages/profile/Profile/options/Collection';
import Main from './pages/profile/Profile/options/Main';
import Liked from './pages/profile/Profile/options/Liked';
import SearchResult from './pages/SearchResult';

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
            <Route path="/:username/collection/:collectionId" element={<CollectionItems />} />
          </Route>
          <Route path="/:username/item/:itemId" element={<Item />} />
          <Route path="/item/:itemId" element={<Item />} />
          <Route path="/collection/:collectionId" element={<CollectionItems />} />
          <Route path="/search/:searchParam" element={<SearchResult />} />
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </Container >
    </BrowserRouter>
  );
}

export default App;
