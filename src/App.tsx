import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { InstanceConnection } from '@/pages/InstanceConnection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conexao/:instanceName" element={<InstanceConnection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
