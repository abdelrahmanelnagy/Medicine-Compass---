import products from '../_data/products.json';

export async function GET() {
  return Response.json(products);
}
