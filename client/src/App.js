import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatInterface from "./components/chat/ChatInterface";
import Header from "./components/Header";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={
            <div className="App">
              <Header />
              <ChatInterface className="ChatInterface" />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
