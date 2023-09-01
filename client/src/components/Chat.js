import React, {useState, useEffect} from "react";
import socket from "./Socket";
import "../App.css";
import ScrollToBottom from "react-scroll-to-bottom";
import {IoIosSend} from "react-icons/io";
import Navbar from "./Navbar";

const Chat = ({username, room}) => {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const [accX, setAccX] = useState(0);

    const sendMessage = () => {
        setCurrentMessage("");
        if (currentMessage !== "") {

            let prevEvent, currentEvent;
            document.documentElement.onmousemove = function (event) {
                currentEvent = event;
            };

            let maxSpeed = 0;
            setInterval(function () {
                if (prevEvent && currentEvent) {
                    let movementX = Math.abs(currentEvent.screenX - prevEvent.screenX);
                    let movementY = Math.abs(currentEvent.screenY - prevEvent.screenY);
                    let movement = Math.sqrt(movementX * movementX + movementY * movementY);
                    let speed = 10 * movement;
                    maxSpeed = Math.round(speed > maxSpeed ? (maxSpeed = speed) : maxSpeed);

                    const acc = new window.Accelerometer({frequency: 60});
                    acc.onreading = () => {
                        setAccX(acc.x);
                    };
                    acc.start();

                }
                prevEvent = currentEvent;
            }, 100);

            setTimeout(async () => {
                if (maxSpeed < 10000 || accX > 0) {
                    console.log(accX);
                    const messageData = {
                        room: room,
                        author: username,
                        message: currentMessage,
                    };
                    await socket.emit("send_message", messageData);
                    setMessageList((list) => [...list, messageData]);
                }
            }, 2000);
        }
    };


    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className="chat-window">
            <div>
                <Navbar/>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div className="message" id={username === messageContent.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" value={currentMessage} placeholder="Mensaje" onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }} onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                }}/>
                <button onClick={sendMessage}><IoIosSend/></button>
            </div>
        </div>
    );
};

export default Chat;