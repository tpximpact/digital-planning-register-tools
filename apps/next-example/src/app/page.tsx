import { ExampleComponent } from "@ui/components";
import { serverApi } from "@libs";

export default async function Home() {
  const { data } = await serverApi.get();
  return (
    <main>
      <h1>Example next.js app</h1>
      <code>{data}</code>
      <ExampleComponent
        name={"from the ui package to the next-example package"}
      />
    </main>
  );
}
