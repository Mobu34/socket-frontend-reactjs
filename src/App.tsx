import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

function App() {
  console.log({ socket });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [responses, setResponses] = useState([]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("CONNECTED");
      setIsConnected(socket.connected);
    });

    socket.on("disconnect", () => {
      console.log("DISCO");
      setIsConnected(true);
    });

    socket.on("getChat", (res) => {
      const newResponses = [...responses];
      console.log(newResponses);
      newResponses.push(res as never);
      setResponses(newResponses);
    });

    return () => {
      console.log("RETURN");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const onSubmit = (event: any) => {
    event.preventDefault();
    socket.emit("events", event.target.message.value, (res: any) => {
      const newResponses = [...responses];
      newResponses.push(res as never);
      setResponses(newResponses);
    });
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
          return <p key={index}>FROM server : {response}</p>;
        })}
      </>
    </div>
  );
}

export default App;
