from cdp import Chrome,ROOT
import time
from PIL import Image
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri())
for _ in range(100):
 if c.js('window.__READY===true'):break
 time.sleep(.15)
print('autoplay ready',c.js('window.__READY'),flush=True)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none';window.__frames=[];window.__last=performance.now();function meter(n){window.__frames.push(n-window.__last);window.__last=n;if(window.__frames.length<9000)requestAnimationFrame(meter)}requestAnimationFrame(meter)")
start=time.monotonic();shots=[7,11,28,32,44,57,61,65,75,79,83,87,91,96,100,116];k=0
while time.monotonic()-start<121:
 time.sleep(.5);t=c.js('+document.getElementById("seek").value')
 if k<len(shots) and t>=shots[k]:
  p=ROOT/'research/recut'/f'play-{shots[k]}.png';c.shot(p,{'x':0,'y':0,'width':1920,'height':1080});k+=1
 if int(time.monotonic()-start)%30==0 and int(time.monotonic()-start)>0:print('playing',round(t,2),flush=True);time.sleep(.6)
print(c.js("(()=>{const a=window.__frames.filter(x=>x>0);return {end:document.getElementById('seek').value,meanFrameMs:a.reduce((s,x)=>s+x,0)/a.length,frames:a.length}})()"),flush=True);c.close()
