import logo from './logo.svg';
import './App.css';
import HomeScreen from './Components/HomeScreen'
import TextRecognition from './Components/TextRecognition';
import React, {useState} from 'react';
import AddBuyers from './Components/AddBuyers';
import { Routes, Route, HashRouter } from "react-router-dom";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buyers, setBuyers] = useState([]);

  return (
    <div className="App">
      <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen 
                                    setSelectedFile={setSelectedFile}
                                  />} 
        />
        <Route path="/buyers" element={<AddBuyers 
                                        buyers={buyers}
                                        setBuyers={setBuyers}
                                        />} 
        />
        <Route path="/result" element={<TextRecognition 
                                          selectedFile={selectedFile}
                                        />} 
        />

      </Routes>
      {/* <Footer /> */}
      </HashRouter>
      {/* <HomeScreen 
        setSelectedFile={setSelectedFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
      <AddBuyers />
      <TextRecognition 
        selectedFile={selectedFile}
      /> */}
    </div>
    
  );
}
export default App;
