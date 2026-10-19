from cdp import Chrome,ROOT
import time,json
from PIL import Image,ImageDraw
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri()+'?review')
for _ in range(100):
 if c.js('window.__READY===true'):break
 time.sleep(.15)
print('ready',c.js("({ready:window.__READY,status:document.getElementById('status')?.innerText})"),flush=True)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none'")
cs=c.js('window.CUES');files=[]
for x in cs:
 t=(x['start']+x['end'])/2;c.js(f'window.seek({t})');c.shot(ROOT/'research/recut'/f"look-{x['id']:02}.png",{'x':0,'y':0,'width':1920,'height':1080});files.append(ROOT/'research/recut'/f"look-{x['id']:02}.png")
print('captured',len(files),flush=True)
for b in range(3):
 out=Image.new('RGB',(1920,4*390),'#263238');d=ImageDraw.Draw(out)
 for j,p in enumerate(files[b*10:(b+1)*10]):
  im=Image.open(p);im.thumbnail((640,360));x=j%3*640;y=j//3*390;out.paste(im,(x,y));d.text((x+10,y+365),p.stem,fill='white')
 out.save(ROOT/'research/recut'/f'look-contact-{b+1}.jpg',quality=92)
c.close()
