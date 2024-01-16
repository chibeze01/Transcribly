import "./App.css";
import ChatInterface from "./components/chat/ChatInterface";
import Header from "./components/Header";
// import UploadFile from "./components/UploadFile";
import Footer from "./components/Footer";

function App() {
	return (
		<div className="App">
			<Header />
			<ChatInterface className="ChatInterface" />
		</div>
	);
}

export default App;
