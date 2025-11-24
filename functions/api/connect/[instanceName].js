export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const instanceName = url.pathname.split('/').pop();

  try {
    const response = await fetch(
      `${env.VITE_EVOLUTION_API_URL}/instance/connect/${instanceName}`,
      {
        headers: {
          'apikey': env.VITE_EVOLUTION_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
