import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = '/' element = {<LoginPage/>}></Route>
      <Route path = '/register' element = {<LoginPage/>}></Route>
      <Route path = '/dashboard' element = {<Dashboard/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
