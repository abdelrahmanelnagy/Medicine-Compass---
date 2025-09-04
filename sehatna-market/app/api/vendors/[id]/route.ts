import vendors from '../../_data/vendors.json';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const vendor = vendors.find(v => v.id === params.id);
  if (!vendor) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(vendor);
}
