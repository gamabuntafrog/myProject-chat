import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRouter from './Components/AppRouter';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from './Components/Loader';
import { useContext } from 'react';
import { Context } from '.';



function App() {


  const { auth } = useContext(Context)
  
  const [user, isLoading, error] = useAuthState(auth)
  
  if (isLoading) {
   return <Loader/>
  }

  return (
    <div className="App">

      <BrowserRouter>
        <Navbar />
        <AppRouter/>
      </BrowserRouter>

    </div>
  );
} 

export default App;
