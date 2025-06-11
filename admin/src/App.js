import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css"
function App() {
  return (
      <BrowserRouter>
          <Header/>
          <Routes>
              <Route path ="/"exact={true} element={<Dashboard/>}/>
              <Route path ="/dashboard"exact={true} element={<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
