export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = {};

  return {
    props: {
      app: res,
      id: id,
    },
  };
}

export default function AppDetails({ app, id }: { app: any; id: string }) {
  console.log(id);
  return (
    <div>
      <h1>{app.title}</h1>
      <p>{app.description}</p>
    </div>
  );
}
