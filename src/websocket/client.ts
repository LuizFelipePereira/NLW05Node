import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

interface IParams {
     text: string;
     email: string;
}

io.on("connect", async (socket) => {
     const connectionsService = new ConnectionsService();
     const usersService = new UsersService();
     const messagesService = new MessagesService();

     socket.on("client_first_access", async (params) => {
          const socket_id = socket.id;
          const { text, email } = params as IParams;
          let user_id = null;

          const userExists = await usersService.findByEmail(email);

          if (!userExists) {
               const user = await usersService.create(email);

               await connectionsService.create({
                    socket_id,
                    user_id: user.id,
               })
          }
          else {
               user_id = userExists.id;
               const connection = await connectionsService.findByUserId(userExists.id);

               if (!connection) {
                    await connectionsService.create({
                         socket_id,
                         user_id: userExists.id,
                    });
               }
               else { // sobrescrever o valor do socket_id
                    connection.socket_id = socket_id;
                    await connectionsService.create(connection);
               }
          }

          await messagesService.create({
               text,
               user_id,
          });

          const allMessages = await messagesService.listByUser(user_id);

          socket.emit("client_list_all_messages", allMessages);
     });

     // gravar a mensagem do client e enviar para o admin responsável
     socket.on("client_send_to_admin", async (params) => {
          const { text, socket_admin_id } = params;

          const socket_id = socket.id;

          // localizar o id do client atraves do id do socket
          const { user_id } = await connectionsService.findBySocketID(socket_id);

          // grava a mensagem enviada pelo client
          const message = await messagesService.create({
               text,
               user_id,
          });
          // emitir um evento para o admin
          io.to(socket_admin_id).emit("admin_receive_message", {
               message,
               socket_id,
          });
     });
});