from pathlib import Path
import json,subprocess,wave,array
ROOT=Path(__file__).resolve().parents[1]
lines=[
'一句话，让 AI 帮你挑商品、点购买。',
'省下的是操作，交出去的却是账户权限。',
'它能查订单，就也能改订单吗？',
'Meta 和 Sierra 正在给这条边界写规则。',
'这套协议叫 Poppy，十月九日公开草案。',
'新增三十五家设计伙伴，也不等于已经上线。',
'代理进了网站，该从哪儿开始？',
'企业在固定网址，公开入口和支持的能力。',
'代理先说明身份，建立一次会话。',
'查库存、问退货政策，可以先以访客进行。',
'需要你的账户，才进入登录与授权流程。',
'以直接登录为例，你在商家页面选择访问范围。',
'草案把读取和修改，分成两种基础权限。',
'能看订单，不自动意味着能修改订单。',
'操作需要哪种权限，由企业决定并执行。',
'同一次会话，还能跨越网页、接口和企业代理。',
'换一条办事通道，也要遵守相同的权限边界。',
'Sierra 还公布过一次峰会演示。',
'按官方描述，Muse 找到 Rocket 的代理，请用户授权。',
'用户登录后，两个代理协作，生成了房贷预批信。',
'但这是演示，也不代表贷款已经发放。',
'谁能证明，用户真的同意了这次操作？',
'安全从业者的原帖，就在追问人的确认该如何证明。',
'这是讨论中的担忧，不是已经验证的协议漏洞。',
'当前文档已有可选扩展，让确认对应到具体条款。',
'条款改了，重新确认；同一动作重试，也只执行一次。',
'可代理声称获准，不证明用户真的看过并同意。',
'支付、主动通知和附件，仍列在待解决的问题里。',
'判断它走到哪一步，要看企业接入和权限执行。',
'哪一次授权，能约束住哪一个动作？这才是关键。'
]
# Display retains product names, speech uses pronunciations for consistent Mandarin delivery.
spoken=[s.replace('Meta','麦塔').replace('Sierra','西耶拉').replace('Poppy','帕皮').replace('Muse','缪斯').replace('Rocket','若克特').replace('AI','人工智能') for s in lines]
raw=ROOT/'research/voice';raw.mkdir(exist_ok=True,parents=True)
def render(rate):
 chunks=[]
 for i,s in enumerate(spoken):
  a=raw/f'{i:02}.aiff';w=raw/f'{i:02}.wav'
  subprocess.run(['say','-v','Tingting','-r',str(rate),'-o',str(a),s],check=True)
  subprocess.run(['afconvert','-f','WAVE','-d','LEI16@22050',str(a),str(w)],check=True)
  with wave.open(str(w)) as f:chunks.append(f.readframes(f.getnframes()))
 return chunks
chunks=render(220)
durations=[len(b)/44100 for b in chunks];speech=sum(durations)
print('characters',sum(len(s) for s in lines),'speech at 220',speech,flush=True)
if speech>110:
 rate=round(220*speech/109);chunks=render(rate);durations=[len(b)/44100 for b in chunks];speech=sum(durations);print('rate',rate,'speech',speech,flush=True)
# Fixed 120-second master; generous tail and a small breath between complete thoughts.
gap=(120-speech-1.2)/len(lines)
if gap<.06:raise RuntimeError('Voice requires faster rendering')
pcm=bytearray(b'\x00\x00'*int(.35*22050));cues=[]
for i,b in enumerate(chunks):
 start=len(pcm)/44100;pcm.extend(b);end=len(pcm)/44100
 pcm.extend(b'\x00\x00'*round(gap*22050))
 cues.append({'id':i,'start':round(start,4),'voiceEnd':round(end,4),'end':round(len(pcm)/44100,4),'text':lines[i]})
pcm.extend(b'\x00'*(120*44100-len(pcm)))
with wave.open(str(ROOT/'assets/narration.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(22050);f.writeframes(pcm)
(ROOT/'timeline.js').write_text('window.CUES = '+json.dumps(cues,ensure_ascii=False,indent=2)+';\n')
(ROOT/'research/narration.txt').write_text('\n'.join(lines))
print('master 120s, breath',gap,flush=True)
