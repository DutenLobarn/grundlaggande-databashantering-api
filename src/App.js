import './App.css';
import NasaMedia from './components/nasa-media/nasa-media.component';
import PostForm from './components/post-form/post-form.component';

function App() {
  return (
    <div className="App">
      <p>------Nasa Media----</p> 
      <NasaMedia/> 
     <p>------Här slutar Nasa Media----</p>
     <br/>
     <p>------PostForm----</p>
     <PostForm/> 
    </div>
  );
}

export default App;
