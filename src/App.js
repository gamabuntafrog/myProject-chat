import './App.css';
import Messages from './Components/Messages';
import EntryField from './Components/EntryField';

function App() {


  return (
    <div className="App">
      <h1 className='title'>Чат непризнаного гения</h1>
      <EntryField />
      <Messages/>
    </div>
  );
} 

export default App;
