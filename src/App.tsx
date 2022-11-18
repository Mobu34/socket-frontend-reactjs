import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(socket.connected);
    });

    socket.on("disconnect", () => {
      setIsConnected(true);
    });

    socket.on("getChat", (res) => {
      setResponses([...responses, res]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getChat");
    };
  }, [socket, responses]);

  const onSubmit = (event: any) => {
    event.preventDefault();
    socket.emit("events", event.target.message.value);
  };

  return (
    <div className="App">
      <>
        <form onSubmit={onSubmit}>
          <input
            title="Ecris moi ton message"
            placeholder="ICI"
            onChange={() => {}}
            name="message"
            type="text"
          />
          <button type="submit">Envoyer</button>
        </form>
        <p>SOCKET connected = {isConnected ? "YES" : "NO"}</p>
        <p>ID = {socket?.id ? socket.id : undefined}</p>
        <h1>My Chat</h1>
        {responses.map((response, index) => {
          const isFromSender = response.socketId !== socket.id;
          return (
            <p key={index}>
              {isFromSender ? "SENDER" : "You"} : {response.message}
            </p>
          );
        })}
      </>
    </div>
  );
}

export default App;
