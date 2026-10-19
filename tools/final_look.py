from cdp import Chrome,ROOT
import time
c=Chrome();c.call('Emulation.setDeviceMetricsOverride',{'width':1920,'height':1080,'deviceScaleFactor':1,'mobile':False});c.nav((ROOT/'film.html').as_uri()+'?review')
for _ in range(50):
 if c.js('window.__READY===true'):break
 time.sleep(.2)
c.js("document.getElementById('controls').style.display='none';document.getElementById('seek').style.display='none'")
for t in [85,90]:
 c.js(f'window.seek({t})');time.sleep(.3);c.js(f'window.renderAt({t})');c.shot(ROOT/'research'/f'delivery-{t}.png',{'x':0,'y':0,'width':1920,'height':1080})
c.close()
