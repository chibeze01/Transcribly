import "./App.css";
import ChatInterface from "./components/chat/ChatInterface";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <ChatInterface className="ChatInterface" />
    </div>
  );
}

export default App;
