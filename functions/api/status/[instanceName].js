export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const instanceName = url.pathname.split('/').pop();

  try {
    // Verifica se as variáveis de ambiente estão definidas
    if (!env.VITE_EVOLUTION_API_URL || !env.VITE_EVOLUTION_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Environment variables not configured',
        details: {
          hasUrl: !!env.VITE_EVOLUTION_API_URL,
          hasKey: !!env.VITE_EVOLUTION_API_KEY
        }
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const apiUrl = `${env.VITE_EVOLUTION_API_URL}/instance/connectionState/${instanceName}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'apikey': env.VITE_EVOLUTION_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `Evolution API error: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}
