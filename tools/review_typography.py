from cdp import Chrome,ROOT
import time,json
from PIL import Image,ImageDraw
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri()+'?review')
for _ in range(80):
 if c.js('window.__READY===true'):break
 time.sleep(.15)
print('fonts',c.js("[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))"),flush=True)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none'")
for t in [2,9,16,20,46,85,104,117]:
 c.js(f'window.seek({t})');time.sleep(.2);c.js(f'window.renderAt({t})');c.shot(ROOT/'research'/f'type-{t}.png',{'x':0,'y':0,'width':1920,'height':1080})
print('ready',c.js('window.__READY'),flush=True);c.close()
