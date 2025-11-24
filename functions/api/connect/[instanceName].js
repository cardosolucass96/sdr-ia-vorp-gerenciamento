export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const instanceName = url.pathname.split('/').pop();

  try {
    // Tenta ambos os formatos de variáveis de ambiente
    const apiUrl = env.EVOLUTION_API_URL || env.VITE_EVOLUTION_API_URL;
    const apiKey = env.EVOLUTION_API_KEY || env.VITE_EVOLUTION_API_KEY;
    
    // Verifica se as variáveis de ambiente estão definidas
    if (!apiUrl || !apiKey) {
      return new Response(JSON.stringify({ 
        error: 'Environment variables not configured',
        details: {
          hasUrl: !!apiUrl,
          hasKey: !!apiKey,
          viteUrl: !!env.VITE_EVOLUTION_API_URL,
          viteKey: !!env.VITE_EVOLUTION_API_KEY,
          plainUrl: !!env.EVOLUTION_API_URL,
          plainKey: !!env.EVOLUTION_API_KEY
        }
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const fullApiUrl = `${apiUrl}/instance/connect/${instanceName}`;
    
    const response = await fetch(fullApiUrl, {
      headers: {
        'apikey': apiKey,
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
