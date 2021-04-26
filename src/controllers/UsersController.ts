import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";


class UsersController {
     async create(request: Request, response: Response): Promise<Response> {
          const { email } = request.body;
          const usersService = new UsersService();
          const user = await usersService.create(email);

          return response.json(user);

     }

     async findByEmail(request: Request, response: Response) {
          const { email } = request.params;
          const usersService = new UsersService();

          const list = await usersService.findByEmail(email);

          return response.json(list);
     }
}

export { UsersController };