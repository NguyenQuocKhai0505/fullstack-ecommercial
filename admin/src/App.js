import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from './components/Sidebar';
function App() {
  return (
      <BrowserRouter>
          <Header/>
          <div className='main d-flex'>
            <div className='sidebarWrapper'>
                <Sidebar/>
            </div>

            <div className='context'>
              <Routes>
                <Route path ="/"exact={true} element={<Dashboard/>}/>
                <Route path ="/dashboard"exact={true} element={<Dashboard/>}/>
             </Routes>
            </div>
          </div>
      </BrowserRouter>
  );
}

export default App;
