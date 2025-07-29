import { treaty } from "@elysiajs/eden";
import type { App } from "@apps/server-api";

const client = treaty<App>("localhost:4000");

// response: Hi Elysia
const { data } = await client.get();

// response: 1895
const { data: id } = await client.id({ id: 1895 }).get();

// response: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
  id: 1895,
  name: "Skadi",
});

console.log(data);
console.log(id);
console.log(nendoroid);
