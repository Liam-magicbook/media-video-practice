#!/usr/bin/env python3
"""Generate macOS Tingting narration + timeline.js from edit-script.json."""
import json, os, subprocess, wave, struct, math

BASE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(BASE, "audio")
os.makedirs(AUD, exist_ok=True)

script = json.load(open(os.path.join(BASE, "edit-script.json"), encoding="utf-8"))

def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def dur(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()

clips = []
for c in script:
    aiff = os.path.join(AUD, f"cue-{c['id']:02d}.aiff")
    raw = os.path.join(AUD, f"cue-{c['id']:02d}.raw")
    run(["say", "-v", "Tingting", "-r", str(c["rate"]), "-o", aiff, c["text"]])
    run(["ffmpeg", "-y", "-v", "error", "-i", aiff, "-f", "s16le", "-ac", "1", "-ar", "24000", raw])
    data = open(raw, "rb").read()
    clips.append((c, data, len(data) / 2 / 24000))

# Build a single 24k mono PCM wav with pauses.
cursor = 0.0
timeline = []
SIL = lambda s: b"\x00\x00" * int(round(s * 24000))
parts = [SIL(0.25)]
cursor = 0.25
for c, data, d in clips:
    start = cursor
    parts.append(data)
    cursor += d
    voice_end = cursor
    parts.append(SIL(c["pause"]))
    cursor += c["pause"]
    timeline.append({
        "id": c["id"], "start": round(start, 4), "voiceEnd": round(voice_end, 4),
        "end": round(cursor, 4), "text": c["text"],
    })

wav = os.path.join(BASE, "narration.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000)
    w.writeframes(b"".join(parts))

total = cursor
js = "window.CUES = " + json.dumps(timeline, ensure_ascii=False, indent=2) + ";\nwindow.__DUR = " + f"{total:.3f}" + ";\n"
open(os.path.join(BASE, "timeline.js"), "w", encoding="utf-8").write(js)

print(f"total: {total:.2f}s  cues: {len(timeline)}")
for t in timeline:
    print(f"{t['id']:2d}  {t['start']:7.2f} -> {t['voiceEnd']:7.2f}  ({t['voiceEnd']-t['start']:4.2f}s)  {t['text'][:22]}")
