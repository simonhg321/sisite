# See It Think: the cheat sheet

Written the night before the ACI all-hands talk, 2026-09-28. Plain English, no math.

## The one sentence

> The weights make the list of guesses. The dials only change how we pick from the list.

The dials never make the model smarter or dumber. They change how it chooses.

## What the model actually does

It writes one token at a time. At every step it produces a list of guesses with odds for the next token:

| Next token | Odds |
|---|---|
| "switch" | 62% |
| "stay" | 30% |
| "it" | 5% |
| everything else | 3% |

Then something has to pick one. That "something" is what the dials control.

The wall shows the top 5. The real list is about 150,000 long. The rest are nearly zero.

## The two big numbers

Two numbers, two different jobs.

| Number | What it is | On our wall |
|---|---|---|
| **8 billion** | The size of the machine: its weights | The "8B" in Qwen3 8B. The 14B has 14 billion. |
| **150,000** | The size of the menu it picks from: its vocabulary | About 151,000 for the Qwen3 models |

**The whole story in one sentence:**

> A model is trained on a mountain of text. That training sets its 8 billion weights. Then, for every single token it writes, it uses all 8 billion weights to score all 150,000 options and picks one.

**Three things people mix up**

- **Parameters and weights are the same thing.** Two names, one thing. There is no separate "weighting" step.
- **A model is trained on text, not on parameters.** Training is the process of nudging the weights until the model gets good at guessing the next token.
- **150,000 is per token, not per answer.** The model never picks an answer. It picks one token, then starts over. A 300-token answer is 300 rounds, each one scoring the whole menu.

**The mixing board**

Picture a mixing board with 8 billion knobs.

| Stage | What happens | When |
|---|---|---|
| Training | Someone spends months turning the knobs until the sound is right | Once, before you ever see it |
| Frozen | The knobs are glued in place | From then on |
| Answering | Your question goes in one side. Out the other comes a score for each of 150,000 tokens | Every token, every time |

**The menu is a different size for each model family**

| Family | Vocabulary (roughly) |
|---|---|
| Qwen3 | 151,000 |
| Llama 3 | 128,000 |
| Gemma | 262,000 |
| Granite | 49,000 |

The Qwen number is solid. Say "roughly" for the others.

**Rounds matter more than size**

Measured on our wall, 2026-09-29, same question (every US president):

| Model | Tokens written | Time |
|---|---|---|
| Qwen3 8B | 1,512 | 43 s |
| Qwen3 14B | 309 | 11 s |

The bigger model is slower per token, but it followed "keep it short" and wrote a fifth as much. How long you wait is mostly about how many tokens get written.

**The line for the room**

> Every word you see was picked from 150,000 options. Then it did that again for the next word.

## Pocket glossary

| Term | Plain English |
|---|---|
| **Token** | A chunk of text, often a word or part of a word. The model reads and writes in tokens. |
| **Weights** | The model's memory of everything it read, frozen as billions of numbers. They never change while you chat. On our box they are the 17.5 GB parked on the graphics card. Also called parameters. |
| **Vocabulary** | The complete list of tokens a model knows. Its dictionary. About 151,000 entries for Qwen3. Fixed before training, never changes. |
| **Context window** | How much the model can see at once: your question, its answers, and the notes. When it fills up, something has to go. |
| **Greedy** | Always take the top guess. No dice. |
| **Sampling** | Roll weighted dice instead of taking the top guess. |
| **Temperature** | How adventurous the dice are. |
| **Top-k** | Only the best *k* guesses get into the roll. |
| **Top-p** | Only enough guesses to cover *p* of the odds get into the roll. |
| **Repeat penalty** | A tax on words it already used, so it doesn't go in circles. |

## Greedy

Always take the top guess. "Switch" wins every time. Called greedy because it grabs the best-looking option right now and never looks ahead.

**What you get**
- Same question, same answer, every time. Good for a repeatable demo.
- The safest-sounding, most familiar answer.

**What it costs**
- Flat writing. Ask for a haiku ten times, get the same haiku ten times.
- It can loop. If the most likely next thing is to repeat itself, greedy repeats forever. DeepSeek R1 did exactly that, which is why it is on a leash.
- The best step is not always the best sentence. Like always taking the fastest-looking street and ending in a dead end.

The wall runs greedy by default.

## Temperature

How adventurous the dice are.

- **0** is greedy. No dice at all.
- **Low (about 0.3)** mostly picks the favorite, with small surprises.
- **1.0** rolls the dice exactly at the odds the model gave.
- **High (1.5 and up)** flattens the odds, so long shots win more often. Answers get creative, then strange.

Wall range: 0 to 2. Default 0.

## Top-k

**A guest list with a fixed number of seats.**

Top-k 3 means only the three best guesses are allowed into the roll. Everything else is thrown out before the dice are rolled.

| Guess | Odds | Top-k 3? |
|---|---|---|
| "switch" | 62% | in |
| "stay" | 30% | in |
| "it" | 5% | in |
| "maybe" | 2% | out |
| "banana" | 1% | out |

- **Top-k 1** is greedy again. One seat, the favorite takes it.
- **Bigger k** lets more long shots in.
- **The weakness:** the number of seats never changes. When the model is very sure, 3 seats lets in junk. When it is truly torn between 20 good options, 3 seats cuts off good ones.

Wall range: 1 to 200. Default is off (no limit).

## Top-p

**A guest list that grows and shrinks with how sure the model is.**

Go down the list from the top and keep adding guesses until their odds add up to *p*. Then close the door.

Top-p 0.90 on the list above: "switch" (62%) plus "stay" (30%) makes 92%. That covers 90%, so the door closes. Two guesses get in.

- **When the model is sure**, one guess might cover 90% alone. The list is tiny.
- **When the model is torn**, it might take 30 guesses to reach 90%. The list is long.
- **Top-p 1.0** lets everything in. That is "off."

That is why top-p is usually the better dial: it adapts. Top-k is a fixed rule, top-p reads the room.

Wall range: 0.01 to 1. Default 1 (off).

## Repeat penalty

A tax on tokens the model already used. Each time a word shows up, its odds get marked down for next time.

- **1.0** is no tax.
- **Above 1** discourages repeats. Good for breaking loops.
- **Too high** and the model starts avoiding words it needs, like "the" or the name of the thing you asked about.
- **Below 1** rewards repeats. Mostly useful for showing what a loop looks like.

Wall range: 0.5 to 2. Default 1 (off).

## How the dials work together

They run in this order:

1. The weights make the list of guesses.
2. Repeat penalty marks down anything already used.
3. Top-k and top-p cut the list.
4. Temperature sets how wild the dice are.
5. The dice roll. One token is picked.

**The gotcha:** at temperature 0 there are no dice, so top-k and top-p do nothing. To see them work, turn temperature up first.

## Try it on the wall

1. Ask the same question twice on greedy. Same answer both times.
2. Turn temperature to 1.0 and ask twice. Different answers.
3. Keep temperature at 1.0, set top-k to 1. Back to the same answer. One seat, no choice.
4. Temperature 1.5 with top-p 1.0, then the same with top-p 0.5. Watch the second one stay saner.

## The lesson for the room

Greedy shows what the model thinks is **most familiar**, not what is **most correct**. Same lesson as the changed Monty Hall question: confidence measures familiarity.

## What happens when you hit Ask

One question is **two** trips to the model, not one:

1. **Count.** The wall asks how many tokens your message is, to check it fits.
2. **Answer.** First trip. This is the big GPU spike.
3. **Take notes.** Second trip. The model pulls the key facts out of the exchange for the whiteboard.
4. **Count again**, so the tiles show exact numbers.

That is why "tokens sent" is bigger than your question plus the answer.

## The first pancake

The first answer with the dials moved is slower than the rest. The engine has to build its dice-rolling code on the spot, because greedy never needed it. On our box that cost about 2 seconds (seen 2026-09-28 21:40).

It stays built until the model restarts. **Switching models from the tile is a restart.**

**Before going on stage:** after the last model switch, ask one throwaway question with the dials moved. Then the pause happens in private.

## Watching the box

Two terminal windows:

```
ssh -t root@172.234.249.16 top
ssh -t root@172.234.249.16 nvidia-smi -l 1
```

`-t` lets a live-updating screen work over ssh. `-l 1` means loop every 1 second. `q` quits top, Ctrl-C quits nvidia-smi.

**Who's who in top**

| Name | What it is |
|---|---|
| `VLLM::E+` | The model engine. The thinking happens here. |
| `vllm` | The front desk. Takes requests, hands them to the engine. |
| `uvicorn` | The wall itself. |
| `caddy` | The front door: HTTPS and the gate. |
| `netdata` | Feeds the `/monitor/` page. |

**Keys in top:** `1` shows each core, `M` sorts by memory, `P` sorts by CPU, `c` shows full commands.

**The big lesson:** top cannot see the graphics card. 100% in top means one core of four is busy feeding the GPU. The real work shows in `nvidia-smi`: utilization jumps when you ask, memory barely moves. The model is loaded once and stays put. Only the effort changes.

## When someone asks something past this

"Good question. Let's ask the wall."
