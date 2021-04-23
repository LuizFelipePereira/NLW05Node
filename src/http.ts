import express from "express";
import {createServer} from "http";
import {Server,Socket} from "socket.io";
import path from "path"; // construir o caminho para passar para a aplicacao

import "./database";
import { routes} from "./routes";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname,"..","public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (request,response) => {
     return response.render("html/client.html");
});

const http = createServer(app); // Criação do protocolo HTTP
const io = new Server(http); // Criação do protocolo websocket(ws)

io.on("connection", (socket: Socket) => {
 //    console.log("Se conectou", socket.id);
});

app.use(express.json());

app.use(routes);

export {http, io};