import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kiosk from './Kiosk';
import Display from './Display';
import Admin from './Admin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/display" element={<Display />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;