import { NextResponse } from "next/server";

export async function GET() {
  try {
    const aiProvider = process.env.AI_PROVIDER || "openai";

    let sessionUrl;
    let sessionHeaders;
    let wsUrl;
    let wsHeaders;

    if (aiProvider === "azure") {
      const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
      const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const azureDeploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;
      const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION;

      if (!azureApiKey || !azureEndpoint || !azureDeploymentId || !azureApiVersion) {
        return NextResponse.json({ error: "Azure environment variables are not fully set." }, { status: 500 });
      }

      const formattedEndpoint = azureEndpoint.endsWith('/') ? azureEndpoint.slice(0, -1) : azureEndpoint;
      sessionUrl = `${formattedEndpoint}/openai/deployments/${azureDeploymentId}/realtime/sessions?api-version=${azureApiVersion}`;
      sessionHeaders = { "api-key": azureApiKey, "Content-Type": "application/json" };
      wsUrl = `${formattedEndpoint}/openai/realtime?api-version=${azureApiVersion}&deployment=${azureDeploymentId}`.replace('https', 'wss');
      wsHeaders = { "api-key": azureApiKey };

    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "OPENAI_API_KEY is not set." }, { status: 500 });
      }
      sessionUrl = "https://api.openai.com/v1/realtime/sessions";
      sessionHeaders = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      wsUrl = "wss://api.openai.com/v1/realtime";
      wsHeaders = { Authorization: `Bearer ${apiKey}` };
    }

    const response = await fetch(sessionUrl, {
      method: "POST",
      headers: sessionHeaders,
      body: JSON.stringify({ model: "gpt-4o-realtime-preview-2025-06-03" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to create session.", details: data }, { status: response.status });
    }

    if (!data.client_secret?.value) {
      return NextResponse.json({ error: "Unexpected response structure from API." }, { status: 500 });
    }

    return NextResponse.json({
      client_secret: data.client_secret.value,
      wsUrl,
      headers: wsHeaders,
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
