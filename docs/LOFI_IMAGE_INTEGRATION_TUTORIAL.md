# Tutorial: Integrating Lofi Stable Diffusion Image Generation (Local & API)

This guide will help you add scene-relevant, lofi-style AI images to your CYOA game, using the same model both locally and via a cheap online API (Hugging Face Inference API).

---

## 1. Choose a Model

- Use [`stablediffusionapi/lofi-v5-final`](https://huggingface.co/stablediffusionapi/lofi-v5-final) from Hugging Face.
  - Works with Hugging Face Inference API (hosted) and with local tools (diffusers, Automatic1111, etc).

---

## 2. Local Setup (Python)

### a. Install dependencies

```bash
pip install diffusers transformers torch
```

### b. Download and run the model

```python
from diffusers import StableDiffusionPipeline
import torch

model_id = "stablediffusionapi/lofi-v5-final"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

prompt = "cyberpunk noir city, pixel art"
image = pipe(prompt).images[0]
image.save("scene.png")
```
- For CPU-only, you may need to use `torch_dtype=torch.float32` and expect slower performance.

---

## 3. Hugging Face Inference API Setup

### a. Get an API key

- Sign up at [huggingface.co](https://huggingface.co/) and get a token from your account settings.

### b. Call the API

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/stablediffusionapi/lofi-v5-final"
headers = {"Authorization": f"Bearer YOUR_HF_TOKEN"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

image_bytes = query({"inputs": "cyberpunk noir city, pixel art"})
with open("scene_api.png", "wb") as f:
    f.write(image_bytes)
```
- Cost: Hugging Face offers a free tier, then pay-as-you-go (much cheaper than OpenAI/DALLE).

---

## 4. Backend Integration

- Add an endpoint to your backend (e.g., `/api/scene-image`) that:
  - Accepts a scene description or prompt.
  - Calls either the local model (if running locally) or the Hugging Face API.
  - Returns the image (as a URL or base64).

- Example (Node/Express, using Python script via child process or direct HTTP call):

```js
// Pseudocode for backend route
app.post('/api/scene-image', async (req, res) => {
  const { prompt } = req.body;
  // Option 1: Call local Python script
  // Option 2: Call Hugging Face API as above
  // Return image URL or base64
});
```

---

## 5. Frontend Integration

- On scene change, call `/api/scene-image` with the scene prompt.
- Display the returned image in your UI (left panel).
- Cache images by prompt to avoid repeated calls/cost.

---

## 6. Tips

- Test both local and API generation to ensure outputs match.
- Use low-res outputs for speed and cost savings.
- Consider fallback logic: try local first, then API if unavailable.

---

## 7. Optional: Replicate.com

- You can also upload the same Hugging Face model to Replicate for private hosted inference if you prefer their pricing or features.

---

**You now have a unified workflow for generating lofi AI art for your game, both locally and online, using the same model and prompt format!**

Let me know if you want code samples for a specific backend (Node, Python, etc.) or for frontend display logic.
