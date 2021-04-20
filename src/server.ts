import express, { response } from "express";

const app = express();


/** 
 * GET = Buscas 
 * POST = Criação
 * PUT = Alteração
 * DELETE = Deletar
 * PATCH = Alterar informação especifica
*/

app.get("/", (request,response) => {
     return response.json({
          message : "Ola nlw 05"
     })
});

app.post("/", (request, response) => {
     return response.json( {
          message : "Usuário salvo com sucesso"
     })

})



app.listen(3333, () => console.log("Server is runnin in port 3333"));