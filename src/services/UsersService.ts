import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository"

class UsersService {
     private usersRepository: Repository<User>;

     constructor(){
          this.usersRepository = getCustomRepository(UsersRepository);
     }

     async create(email: string) {
          
          //verificar se o usuário existe
          const usersExists = await this.usersRepository.findOne({
               email,
          });
          // se existir , retornar user
          if (usersExists) {
               return usersExists;
          }
          // se nao existir, salvar no db
          const user = this.usersRepository.create({
               email,
          });

          await this.usersRepository.save(user);

          return user;
     }

     async findByEmail( email: string) {
          const list = await this.usersRepository.findOne({
               where: {email},
          });
          return list;
     }

}

export { UsersService };