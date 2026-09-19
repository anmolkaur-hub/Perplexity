import "dotenv/config";

export async function searchInternet({ query }) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return [];
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily search failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return (data.results || []).map((item) => ({
    title: item.title || "Source",
    url: item.url || "",
    snippet: item.content || "",
  }));
}
