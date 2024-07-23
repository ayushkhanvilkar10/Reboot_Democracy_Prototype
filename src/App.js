import './App.css';
import Profile from './pages/profile';
import Post from './pages/post'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogNavbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div>
        <BlogNavbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
      <Footer/>
      </div>
    </Router>  
    );
}

export default App;
