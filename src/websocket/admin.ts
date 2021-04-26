import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
     const connectionsService = new ConnectionsService();
     const messageService = new MessagesService();

     const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

     io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

     // listar as mensagens do client atendido
     socket.on("admin_list_messages_by_user", async (params, callback) => {
          const { user_id } = params;

          const allMessages = await messageService.listByUser(user_id);

          callback(allMessages);
     });

     // gravar a mensagem do admin no banco e retornar a mensagem para o client 
     socket.on("admin_send_message", async (params) => {
          const { user_id, text } = params; // desestruturar a mensagem

          // gravar a mensagem digitada pelo admin no BD
          await messageService.create({
               text,
               user_id,
               admin_id: socket.id,
          });

          // buscar o id do socket para comunicar a mensagem ao client
          const { socket_id } = await connectionsService.findByUserId(user_id);

          // enviar a mensagem para o client pelo socket id
          io.to(socket_id).emit("admin_send_to_client", {
               text,
               socket_id: socket.id,
          });
     });

     // retirar o client em atendimento da lista de pendentes
     socket.on("admin_user_in_support", async (params) => {
          const { user_id } = params; // desestruturar a mensagem

          // alterar a conexão para não aparecer mais na lista de atendimentos pendentes
          const connection = await connectionsService.updateAdminID(user_id, socket.id);

          const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

          io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
     });





});