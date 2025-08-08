
import { Routes, Route } from 'react-router-dom';
import EngagementManager from './EngagementManager';
import EngagementDetails from './EngagementDetails'; // Details page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<EngagementManager />} />
      <Route path="/engagement/:id" element={<EngagementDetails />} />
    </Routes>
  );
};

export default App;



