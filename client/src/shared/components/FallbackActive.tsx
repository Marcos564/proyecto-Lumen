// Una promesa que nunca se resuelve (queda en estado pending eternamente)
const promesaEterna = new Promise(() => {});

export function ComponenteInfinito() {
  // Al lanzar una promesa en el render, React la captura y activa el Suspense más cercano
  throw promesaEterna;

  return <div>Esto nunca se va a mostrar</div>;
}
