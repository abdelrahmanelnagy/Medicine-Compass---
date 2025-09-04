import products from '../../_data/products.json';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find(p => p.id === params.id);
  if (!product) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(product);
}
