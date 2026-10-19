import websocket,urllib.request,json,time
from pathlib import Path
port=int(Path('video_media/research/recut/explore-port.txt').read_text());tabs=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json'));ws=websocket.create_connection(tabs[0]['webSocketDebuggerUrl'],suppress_origin=True);seq=0
def js(s):
 global seq
 seq+=1;ws.send(json.dumps({'id':seq,'method':'Runtime.evaluate','params':{'expression':s,'returnByValue':True}}))
 while True:
  r=json.loads(ws.recv())
  if r.get('id')==seq:return r.get('result',{}).get('result',{}).get('value')
print(js("[...document.querySelectorAll('button')].find(e=>e.innerText.includes('Exchange my jacket')).click();document.querySelector('textarea').value"),flush=True)
time.sleep(1);print(js('document.body.innerText'),flush=True)
print(js("[...document.querySelectorAll('button')].map(e=>({text:e.innerText,aria:e.getAttribute('aria-label'),disabled:e.disabled}))"),flush=True)
for i in range(15):
 time.sleep(2);t=js('document.body.innerText')
 if i%3==0:print(t[-4500:],flush=True)
 if 'Sign in at Northstar' in t:break
print('links',js("[...document.querySelectorAll('a')].map(e=>({text:e.innerText,href:e.href}))"),flush=True)
Path('video_media/research/recut/demo-interaction.txt').write_text(t)
