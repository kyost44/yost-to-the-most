import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/layout/Layout';

import Home            from './pages/Home';
import NeedToKnow      from './pages/NeedToKnow';
import PreTripTodo     from './pages/PreTripTodo';
import MyYosties       from './pages/MyYosties';
import Transportation  from './pages/Transportation';
import CalendarPorts   from './pages/CalendarPorts';
import TShirtStudio    from './pages/TShirtStudio';
import CruiseHighlights from './pages/CruiseHighlights';
import PhotoGallery    from './pages/PhotoGallery';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-7xl mb-6 float">🌊</div>
      <h1 className="font-playfair font-black text-5xl mb-3" style={{ color: 'var(--navy)' }}>
        Lost at Sea!
      </h1>
      <p className="text-gray-500 font-nunito mb-6">This page doesn't exist — but your cruise does.</p>
      <a href="/" className="font-nunito font-bold px-6 py-3 rounded-xl transition-colors text-white"
         style={{ background: 'var(--navy)' }}>
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <DataProvider>
          <Layout>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/need-to-know"   element={<NeedToKnow />} />
              <Route path="/todo"           element={<PreTripTodo />} />
              <Route path="/my-yosties"     element={<MyYosties />} />
              <Route path="/transportation" element={<Transportation />} />
              <Route path="/calendar"       element={<CalendarPorts />} />
              <Route path="/tshirt"         element={<TShirtStudio />} />
              <Route path="/highlights"     element={<CruiseHighlights />} />
              <Route path="/gallery"        element={<PhotoGallery />} />
              <Route path="*"               element={<NotFound />} />
            </Routes>
          </Layout>
        </DataProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
