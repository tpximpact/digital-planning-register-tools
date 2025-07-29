export interface ExampleComponentProps {
  name?: string;
}

export function ExampleComponent({ name = "world" }: ExampleComponentProps) {
  return <p>hello {name}!</p>;
}
