from cdp import Chrome,ROOT
import json,time
from PIL import Image,ImageDraw
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False})
c.nav((ROOT/'film.html').as_uri()+'?review')
for _ in range(60):
 if c.js('window.__READY===true'):break
 time.sleep(.2)
print('ready',c.js('window.__READY'),flush=True)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none'")
times=[2,6,9,12.5,16,20,24,27,30,34,38,42,46,50,53,57,62,65,69,74,78,81,85,90,94,99,104,108,113,117]
files=[]
for t in times:
 c.js(f'window.seek({t})');time.sleep(.22);c.js(f'window.renderAt({t})');f=ROOT/'research'/f'edit-{t:g}.jpg'
 p=ROOT/'research'/f'edit-{t:g}.png';c.shot(p,{'x':0,'y':0,'width':1920,'height':1080});im=Image.open(p);im.save(f,quality=86);p.unlink();files.append(f)
print('captured',len(files),flush=True)
for batch in range(3):
 out=Image.new('RGB',(1920,1800),'#253039');d=ImageDraw.Draw(out)
 for j,f in enumerate(files[batch*10:(batch+1)*10]):
  im=Image.open(f);im.thumbnail((640,360));x=j%3*640;y=j//3*450;out.paste(im,(x,y));d.text((x+12,y+375),f.stem,fill='white')
 out.save(ROOT/'research'/f'review-{batch+1}.jpg',quality=89)
c.close()
