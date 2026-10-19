"""Build a local, sentence-aligned Mandarin narration master from edit-script.json."""
from pathlib import Path
import json,subprocess,wave,argparse
P=argparse.ArgumentParser();P.add_argument('--project',type=Path,default=Path(__file__).resolve().parents[1]);P.add_argument('--duration',type=float,default=120);args=P.parse_args();R=args.project
rows=json.loads((R/'edit-script.json').read_text());raw=R/'research/recut/voice';raw.mkdir(parents=True,exist_ok=True)
chunks=[]
for x in rows:
 spoken=x.get('spoken',x['text']).replace('Meta','麦塔').replace('Sierra','西耶拉').replace('Poppy','帕皮').replace('Rocket','若克特').replace('operations','操作').replace('AI','人工智能')
 a=raw/f"{x['id']:02}.aiff";w=raw/f"{x['id']:02}.wav"
 subprocess.run(['say','-v','Tingting','-r',str(x.get('rate',225)),'-o',str(a),spoken],check=True)
 subprocess.run(['afconvert','-f','WAVE','-d','LEI16@22050',str(a),str(w)],check=True)
 with wave.open(str(w)) as f:chunks.append(f.readframes(f.getnframes()))
speech=sum(len(b)/44100 for b in chunks);available=args.duration-speech-.8
if available<2:raise RuntimeError(f'Narration is too long: {speech:.1f}s. Shorten script or adjust delivery before editing.')
weights=sum(x.get('pause',.3) for x in rows);pcm=bytearray(b'\x00\x00'*round(.2*22050));cues=[]
for x,b in zip(rows,chunks):
 start=len(pcm)/44100;pcm.extend(b);voiceEnd=len(pcm)/44100;gap=available*x.get('pause',.3)/weights;pcm.extend(b'\x00\x00'*round(gap*22050))
 cues.append({'id':x['id'],'start':round(start,4),'voiceEnd':round(voiceEnd,4),'end':round(len(pcm)/44100,4),'text':x['text']})
pcm.extend(b'\x00'*max(0,round(args.duration*44100)-len(pcm)))
with wave.open(str(R/'assets/narration.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(22050);f.writeframes(pcm)
(R/'timeline.js').write_text('window.CUES = '+json.dumps(cues,ensure_ascii=False,indent=2)+';\n')
print('Speech',round(speech,2),'master',args.duration,flush=True)
for c in cues:print(c['id'],round(c['start'],2),round(c['end'],2),c['text'],flush=True)
