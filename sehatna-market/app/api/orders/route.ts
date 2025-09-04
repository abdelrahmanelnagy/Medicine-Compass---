export async function POST(req: Request) {
  const order = await req.json();
  return Response.json(
    { message: 'تم استلام الطلب', order },
    { status: 201 }
  );
}
