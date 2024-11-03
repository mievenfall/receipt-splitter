import logo from './logo.svg';
import './App.css';
import HomeScreen from './Components/HomeScreen'
import TextRecognition from './Components/TextRecognition';
import React, {useState} from 'react';
import AddBuyers from './Components/AddBuyers';
import PickItems from './Components/PickItems';
import { Routes, Route, HashRouter } from "react-router-dom";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [items, setItems] = useState([]);

  return (
    <div className="App">
      <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen 
                                    setSelectedFile={setSelectedFile}
                                  />} 
        />
      
        <Route path="/process" element={<TextRecognition 
                                          selectedFile={selectedFile}
                                          setItems={setItems}
                                        />} 
        />
        <Route path="/buyers" element={<AddBuyers 
                                        buyers={buyers}
                                        setBuyers={setBuyers}
                                        />} 
        />
        <Route path="/result" element={<PickItems 
                                        items={items}
                                        buyers={buyers}
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
