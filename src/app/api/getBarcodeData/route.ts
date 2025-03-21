export async function GET(req:any) {
    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get("barcode");
  
    if (!barcode) {
      return new Response(JSON.stringify({ error: "Barcode is required" }), { status: 400 });
    }
  
    const API_KEY = "8snpk15qbl42tom4mo1lbnd016wq4c"; // Replace with your actual API key
    const apiUrl = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${API_KEY}`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" }, // Fix CORS issue
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
  }
  