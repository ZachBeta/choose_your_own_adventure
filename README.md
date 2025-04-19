# choose_your_own_adventure
cyber elysium, disco punk

## Watch Luigi win by doing nothing

```bash
cd backend
npm install
npm run play -- --mario-party-luigi
```

## Play (CLI)

```bash
cd backend
npm install
npm run play
```

## Full Stack Web UI (Development)

> **Note:** Running both servers from the project root with a single command is not supported at this time. Please use the manual method below.

### Manual (in separate terminals)

Backend:
```bash
cd backend
npm install
npm start
```
Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Visit http://localhost:5173 in your browser to play.

### API Health Checks

Test backend endpoints directly:
```bash
curl -i -X POST http://localhost:3000/api/dialog -H "Content-Type: application/json" -d '{"playerId":"player1","sceneId":"scene_intro"}'
```

## Running Tests

### Backend
```bash
cd backend
npm install
npm test
```

---

## Backend LLM Setup

### Option 1: Ollama (Local)

Ollama lets you run language models locally on your machine.

1. **Install Ollama:**  
   Follow the instructions at [ollama.com/download](https://ollama.com/download) for your platform.

2. **Run Ollama:**  
   Start Ollama by running:
   ```bash
   ollama serve
   ```
   or, to run the recommended/tested model for this project (`gemma3:12b`):
   ```bash
   ollama run gemma3:12b
   ```
   > **Note:** This project has been tested with `gemma3:12b` and it is the recommended model.

3. The backend will connect to Ollama automatically if it’s running.

### Option 2: OpenRouter (Cloud)

OpenRouter lets you access a variety of LLMs through a cloud API.

1. **Sign up and get your API key:**  
   Go to [openrouter.ai](https://openrouter.ai/) and sign up.  
   After signing in, visit your [API Keys page](https://openrouter.ai/keys) to create a key.

2. **Set your API key as an environment variable:**  
   In your terminal, run:
   ```bash
   export OPENROUTER_API_KEY=sk-...yourkey...
   ```
   Or add this line to your `.bashrc`, `.zshrc`, or equivalent shell profile.

3. The backend will use OpenRouter if the API key is set.

### Fallback: Lean Vault

If neither Ollama nor OpenRouter is configured, the backend will attempt to use Lean Vault.  
Most users will not have Lean Vault installed, so it’s recommended to use one of the above options.
