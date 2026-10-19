from cdp import Chrome,ROOT
import time
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri()+'?review')
for _ in range(60):
 if c.js('window.__READY===true'):break
 time.sleep(.2)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none'")
for t in [34,46,50,74,85,90,108]:
 c.js(f'window.seek({t})');time.sleep(.3);c.js(f'window.renderAt({t})');c.shot(ROOT/'research'/f'final-{t}.png',{'x':0,'y':0,'width':1920,'height':1080})
# Play the newly edited real-video return continuously through its three sentences.
c.js("window.seek(79.95);document.getElementById('pause').click()")
time.sleep(4)
print('return-video',c.js("({film:+document.getElementById('seek').value,source:document.getElementById('muse').currentTime,paused:document.getElementById('muse').paused,rate:document.getElementById('muse').playbackRate})"),flush=True)
time.sleep(4)
c.shot(ROOT/'research/final-return-playing.png',{'x':0,'y':0,'width':1920,'height':1080});c.close()
