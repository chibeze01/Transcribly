import "./App.css";
import Header from "./components/Header";
import UploadFile from "./components/UploadFile";

// import Figma from "./components/Figma";

function App() {
  return (
    <div className="App">
      <Header />
      <UploadFile />
      {/* <Figma /> */}
    </div>
  );
}

export default App;