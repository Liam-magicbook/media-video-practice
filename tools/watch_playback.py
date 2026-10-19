from cdp import Chrome,ROOT
import time,json
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri())
for _ in range(120):
 if c.js('window.__READY===true'):break
 time.sleep(.1)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none';window.__frames=[];window.__last=performance.now();function meter(n){if(window.__frames.length<8000){window.__frames.push(n-window.__last);window.__last=n;requestAnimationFrame(meter)}}requestAnimationFrame(meter)")
print('Continuous autoplay started',flush=True)
started=time.monotonic();nextshot=0
while time.monotonic()-started<121:
 time.sleep(5)
 r=c.js("({t:+document.getElementById('seek').value,audio:!document.getElementById('voice').paused,video:document.getElementById('muse').currentTime,ready:window.__READY})")
 if nextshot<len([6,34,49,76,104,118]) and r['t']>=[6,34,49,76,104,118][nextshot]:
  c.shot(ROOT/'research'/f'playback-{nextshot}.png',{'x':0,'y':0,'width':1920,'height':1080});nextshot+=1
 if int(time.monotonic()-started)//20>int(time.monotonic()-started-5)//20:print(r,flush=True)
print(c.js("(()=>{const a=window.__frames.filter(x=>x>0);return {time:document.getElementById('seek').value,frameIntervals:a.length,meanMs:a.reduce((a,b)=>a+b,0)/a.length}})()"),flush=True)
c.close()
