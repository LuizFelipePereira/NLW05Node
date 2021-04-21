import { Router } from "express";
import { CustomRepositoryCannotInheritRepositoryError, getCustomRepository } from "typeorm";
import { SettingsRepository } from "./repositories/SettingsRepository";

const routes = Router();

/**
 * Tipos de parametros
 * Routes Params => parametros de rotas
 * http://localhost:3333/settings/1
 * Query Params => Filtros e Buscas
 * http://localhost:333/settings/1?search=algumacoisa
 * 
 * Body params => {
 *   
 * }
 */

routes.post("/settings", async (request, response) => {
     const { chat, username } = request.body;

     const settingsRepository = getCustomRepository(SettingsRepository);
     const settings = settingsRepository.create({
          chat,
          username
     });

     await settingsRepository.save(settings);

     return response.json(settings);

});

export { routes };