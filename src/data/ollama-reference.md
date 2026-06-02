# Ollama Quick Reference

## CLI Commands

| Command                             | What it does                                  |
| ----------------------------------- | --------------------------------------------- |
| `ollama list`                       | Show all downloaded models                    |
| `ollama ps`                         | Show running models (loaded in memory)        |
| `ollama show <model>`               | Model details (params, size, quantization)    |
| `ollama pull <model>`               | Download a model                              |
| `ollama rm <model>`                 | Delete a model                                |
| `ollama run <model>`                | Start REPL with model                         |
| `ollama serve`                      | Start the Ollama server (usually LaunchAgent) |
| `ollama cp <src> <dst>`             | Copy/clone a model under a new name           |
| `ollama create <name> -f Modelfile` | Create custom model from Modelfile            |

## REPL Commands (inside `ollama run`)

| Command | What it does |
|---------|-------------|
| `/bye` | Exit the REPL |
| `/clear` | Clear conversation context (fresh start) |
| `/set system "..."` | Set system prompt (temporary, this session only) |
| `/set parameter <name> <value>` | Set a parameter (see below) |
| `/show info` | Show model info (size, quantization, params) |
| `/show system` | Show current system prompt |
| `/show parameters` | Show current parameter values |
| `/load <model>` | Switch to a different model mid-session |
| `/save <name>` | Save current config (system prompt + params) as a new model |
| `"""` | Start/end multi-line input |

## Parameters

### temperature
Controls randomness. Higher = more creative/unpredictable, lower = more deterministic.

```
/set parameter temperature 0.7
```

| Range     | Behavior                       | Use case                             |
| --------- | ------------------------------ | ------------------------------------ |
| 0.0 - 0.3 | Very deterministic, repetitive | Facts, code, math                    |
| 0.4 - 0.7 | Balanced                       | General chat, writing                |
| 0.8 - 1.2 | Creative, varied               | Brainstorming, fiction, persona play |
| 1.3 - 2.0 | Chaotic, may lose coherence    | Experimental only                    |

### top_p (nucleus sampling)
Controls diversity of token selection. Lower = only high-probability words. Works with temperature.

```
/set parameter top_p 0.9
```

| Value | Effect |
|-------|--------|
| 0.1 - 0.3 | Very focused, predictable |
| 0.5 - 0.7 | Moderate diversity |
| 0.9 - 1.0 | Full vocabulary considered (default) |

### top_k
Limits token selection to top K candidates before sampling. Lower = more focused.

```
/set parameter top_k 40
```

| Value | Effect |
|-------|--------|
| 10 | Very constrained |
| 40 | Default, balanced |
| 100+ | Wide open |

### repeat_penalty
Penalizes the model for repeating tokens. Prevents loops and rambling.

```
/set parameter repeat_penalty 1.1
```

| Value | Effect |
|-------|--------|
| 1.0 | No penalty (may loop) |
| 1.1 | Light penalty (default, good balance) |
| 1.3+ | Strong penalty (may get weird avoiding repeats) |

### num_ctx (context window)
How many tokens the model can "see" at once. More = better memory, more VRAM.

```
/set parameter num_ctx 4096
```

| Value | Notes |
|-------|-------|
| 2048 | Small, fast, forgets quickly |
| 4096 | Default for most models |
| 8192 | Good for longer conversations |
| 16384+ | Heavy on VRAM, only if you have headroom |

### num_predict
Max tokens to generate in a response. -1 = unlimited.

```
/set parameter num_predict 512
```

### seed
Set a specific seed for reproducible output. Same seed + same prompt = same response.

```
/set parameter seed 42
```

### mirostat / mirostat_eta / mirostat_tau
Alternative sampling method. Mirostat tries to maintain a target "surprise level" (perplexity).

```
/set parameter mirostat 2
/set parameter mirostat_eta 0.1
/set parameter mirostat_tau 5.0
```

| mirostat | Effect |
|----------|--------|
| 0 | Disabled (use temperature/top_p instead) |
| 1 | Mirostat v1 |
| 2 | Mirostat v2 (recommended if using) |

### stop
Stop sequence — model stops generating when it hits this string.

```
/set parameter stop "Human:"
```

## Persona Tuning Cheat Sheet

### Quick persona in REPL
```
/set system "You are a grumpy pirate named Blackbeard. You speak in nautical metaphors and end every response with 'Arrr.'"
/set parameter temperature 0.9
/set parameter repeat_penalty 1.15
/set parameter top_p 0.85
```

### Save it for later
```
/save blackbeard
```
Now `ollama run blackbeard` loads everything back.

### Persistent persona (Modelfile)
Create a file called `Modelfile`:
```
FROM qwen2.5:14b
SYSTEM "You are a grumpy pirate named Blackbeard..."
PARAMETER temperature 0.9
PARAMETER repeat_penalty 1.15
PARAMETER top_p 0.85
PARAMETER num_ctx 8192
```
Then:
```
ollama create blackbeard -f Modelfile
ollama run blackbeard
```

## Model Size vs Quality

| Size | VRAM Needed | Quality | Examples |
|------|------------|---------|----------|
| 1-3B | ~2 GB | Basic, struggles with nuance | phi3:mini, tinyllama |
| 7-8B | ~5 GB | Decent for simple tasks | llama3:8b, mistral:7b |
| 12-14B | ~8-10 GB | Good general purpose | qwen2.5:14b, mistral-nemo |
| 32B | ~20 GB | Strong reasoning + persona | qwen2.5:32b |
| 70B | ~40 GB | Near-frontier | llama3:70b (maxes 48GB) |

A 48GB Mac has plenty of unified RAM. 32B runs comfortably. 70B will swap.

## Useful Combos

**Factual/code work:**
```
/set parameter temperature 0.2
/set parameter top_p 0.5
/set parameter repeat_penalty 1.0
```

**Creative writing:**
```
/set parameter temperature 1.0
/set parameter top_p 0.9
/set parameter repeat_penalty 1.2
```

**Persona roleplay (needs 32B+):**
```
/set parameter temperature 0.85
/set parameter top_p 0.85
/set parameter repeat_penalty 1.15
/set parameter num_ctx 8192
```

**Terse, focused answers:**
```
/set parameter temperature 0.3
/set parameter top_p 0.4
/set parameter num_predict 256
```
