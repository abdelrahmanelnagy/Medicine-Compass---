import vendors from '../_data/vendors.json';

export async function GET() {
  return Response.json(vendors);
}
