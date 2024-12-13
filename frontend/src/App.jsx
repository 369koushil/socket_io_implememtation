import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState("");
    const [receivedMsg, setReceivedMsg] = useState("");
    const [rId, setRId] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        
        const newSocket = io(`http://localhost:3000`);
        setSocket(newSocket);
        newSocket.on("connect", () => {
            console.log(newSocket.id);
            setId(newSocket.id);
        });

      
        newSocket.on("receive", (msg) => {
            setReceivedMsg(msg);
        });

        return () => newSocket.disconnect();
    }, [])

  
    const messageHandler = (e) => {
        e.preventDefault();
        if (socket) {
            socket.emit("message", { rId, msg });
        }
    }

    const joinRoomHandler = () => {
        if (socket && rId) {
            socket.emit("join-room", rId);
        }
    }

    return (
        <div>
            <form onSubmit={messageHandler}>
                <input readOnly value={id} placeholder="Socket ID" />
                <input
                    type="text"
                    value={rId}
                    onChange={(e) => setRId(e.target.value)}
                    placeholder="Room ID"
                />
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type message"
                />
                <button type="submit">Send</button>
            </form>
            <button onClick={joinRoomHandler}>Join Room</button>
            <div>
                <h3>Received Message:</h3>
                <textarea value={receivedMsg} readOnly />
            </div>
        </div>
    );
}

export default App;
