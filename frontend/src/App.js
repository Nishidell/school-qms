import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kiosk from './Kiosk';
import Display from './Display';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </Router>
  );
}

export default App;