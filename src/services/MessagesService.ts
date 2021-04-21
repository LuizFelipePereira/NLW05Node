import { getCustomRepository, Repository } from "typeorm";
import { MessagesRepository } from "../repositories/MessagesRepository";
import {Message} from "../entities/Message";

interface IMessageCreate {
     admin_id?: string;
     text: string;
     user_id: string;
}

class MessagesService {
     private massagesRepository: Repository<Message>;

     constructor(){
          this.massagesRepository = getCustomRepository(MessagesRepository);
     }


     async create({admin_id, text, user_id}) {
          
          const message = this.massagesRepository.create({
               admin_id,
               text,
               user_id
          });
          await this.massagesRepository.save(message);
          return message;
     }

     async listByUser( user_id: string) {
          const list = await this.massagesRepository.find({
               where: {user_id},
               relations: ["user"],
          });
          return list;
     }

}

export { MessagesService }