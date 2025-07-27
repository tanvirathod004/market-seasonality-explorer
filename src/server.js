app.use(cors());

app.get("/api/klines", async (req, res) => {
  try {
    const response = await axios.get("https://api.binance.com/api/v3/klines", {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Binance" });
  }
});

app.listen(5000, () => {
  console.log("Proxy server running on http://localhost:5000");
});