import React, {useState} from "react";
import Chat from "./components/Chat";
import "./App.css";
import socket from "./components/Socket";


function App() {
    const [username, setUsername] = useState(randomUsername());
    const [room, setRoom] = useState('lobby');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        setRoom("lobby");
        socket.emit("join_room", room);
        socket.emit("join_room_username", username);
        setShowChat(true);
    }

    function randomUsername() {
        const {uniqueNamesGenerator, adjectives, colors} = require('unique-names-generator');
        return uniqueNamesGenerator({dictionaries: [adjectives, colors]});
    }

    return (
        <div className="App">
            {!showChat ? (
                <div className="joinChatContainer">
                    <h3>viChat</h3>
                    <h1>Your username is: {username}</h1>
                    <br/>
                    <button onClick={joinRoom}>Join a room</button>
                </div>
            ) : (
                <Chat username={username} room={room}/>
            )}
        </div>
    );
}

export default App;