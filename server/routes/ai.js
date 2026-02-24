import express from "express";


const router = express.Router();

const MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

router.post("/categorize", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text required" });
  }

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: [
            "Food",
            "Transport",
            "Shopping",
            "Bills",
            "Entertainment",
          ],
        },
      }),
    });

    const bodyText = await response.text();

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (err) {
      console.log("HF returned non-JSON:", bodyText);
      return res.json("Misc");
    }


    if (Array.isArray(data) && data.length > 0) {
      const topLabel = data[0].label;
      return res.json(topLabel);
    }

    return res.json("Misc");

  } catch (err) {
    console.error("AI categorization failed:", err);
    return res.json("Misc");
  }
});

export default router;