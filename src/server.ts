import fastify from "fastify";

const app = fastify();


app.get("/", async (request, reply) => {
  return "Hello World"
});


app.listen({
  port: 3000
}).then(() => {
  console.log("🚀 Server is running on port 3000")
})
