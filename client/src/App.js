import "./App.css";
import Header from "./components/Header";
import UploadFile from "./components/UploadFile";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <UploadFile />
      <Footer />
      {/* <Figma /> */}
    </div>
  );
}

export default App;
