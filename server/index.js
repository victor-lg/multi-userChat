const express = require('express');
const app = express();
const {Server} = require("socket.io");
const server = require("http").createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let userSocketList = []
let userList = []

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("join_room_username", (data) => {
        let newObj;
        newObj = [data, socket.id];
        userSocketList.push(newObj);
        userList = userSocketList.map(function (user) {
            return user[0];
        });
        console.log(userSocketList);
        console.log(userList);
        io.emit("users", userList);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        let id = socket.id;
        let userName;
        for (let i = 0; i < userSocketList.length; i++) {
            if (userSocketList[i][1] === id) {
                userName = userSocketList[i][0];
                userSocketList.splice(userSocketList.indexOf(userSocketList[i]), 1);
                break;
            }
        }
        console.log(userName);
        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === userName) {
                userList.splice(userList.indexOf(userList[i]), 1);
                break;
            }
        }
        console.log(userSocketList);
        console.log(userList);
        io.emit("users", userList);
    });
});

server.listen(3000, () => console.log('server started'));