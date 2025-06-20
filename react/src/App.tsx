import ChatBot from "../components/ChatBot";

const Home = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <h1 className="text-center text-3xl font-semibold pt-6">
        📘 Chatbot Luật Pháp
      </h1>
      <ChatBot />
    </main>
  );
};

export default Home;
