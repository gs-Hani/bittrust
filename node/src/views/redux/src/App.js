import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { Auth } from './features/auth/Auth';
import { TransRecord } from './features/transRecords/TransRecords';
import './App.css'

function App() {
  return (
    <div className="App"> 
      <Router className='Router'>
        {/* <Header id='Header'/> */}
        <main>
          <Routes>
            <Route exact path="/auth"       element={<Auth/>}       />
            <Route       path="/"           element={<TransRecord/>}/>
            {/* <Route       path="/:productId" element={<RefCode/>}    />
            <Route       path="/profile"    element={<Profile/>}    />
            <Route       path="/checkout"   element={<Checkout/>}   /> */}
          </Routes>
        </main> 
          
      </Router>
    </div>
  )
}

export default App
