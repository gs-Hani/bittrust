import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { Header }       from './components/header/Header';
import { Auth }         from './features/auth/Auth';
import { TransRecords } from './features/transRecords/TransRecords';
import { Profile }      from './features/profile/Profile';
import './App.css'

function App() {
  return (
    <div className="App"> 
      <Router>
        <Header/>
        <main>
          <Routes>
            <Route       path="/"    element={<Auth/>}        />
            <Route       path="/profile"      element={<Profile/>}     />
            <Route       path="/transRecords" element={<TransRecords/>}/>
            {/* <Route       path="/:productId" element={<RefCode/>}    />*/}
            {/* <Route       path="/checkout"   element={<Checkout/>}   />  */}
          </Routes>
        </main> 
          
      </Router>
    </div>
  )
}

export default App
