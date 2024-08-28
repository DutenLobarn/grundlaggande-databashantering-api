import './App.css';
// import NasaMedia from './components/nasa-media/nasa-media.component';
// import PostForm from './components/post-form/post-form.component';

// import BookManagerWithJSON from './components/book-manager-with-json/book-manager-with-json.component';
import PostFormAllCRUD from './components/post-form-all-crud/post-form.component-all-crud.component';

// import BookManager from './components/book-manager/book-manager.component';
// import LocalStorageBookManager from './components/local-storage-book-manager/local-storage-book-manager.component';

function App() {
  return (
    <div className="App">
      {/* <p>------Nasa Media----</p> 
      <NasaMedia/> 
     <p>------Här slutar Nasa Media----</p>
     <br/>
     <p>------PostForm----</p>
     <PostForm/>  */}
     <PostFormAllCRUD/>  
     {/* <BookManager/> */}
     {/* <BookManagerWithJSON/> */}
     {/* <LocalStorageBookManager/> */}
    </div>
  );
}

export default App;
