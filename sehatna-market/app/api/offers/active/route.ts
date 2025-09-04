import offers from '../../_data/offers.json';

export async function GET() {
  return Response.json(offers);
}
