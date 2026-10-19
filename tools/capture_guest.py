from cdp import Chrome,ROOT
import json
c=Chrome();url='https://sierra.ai/blog/poppy';c.nav(url)
r=c.js("""(()=>{const e=[...document.querySelectorAll('li')].find(e=>e.innerText.startsWith('Sessions.'));if(!e)throw Error('Missing Sessions');const r=e.getBoundingClientRect();return {x:r.x+scrollX-14,y:r.y+scrollY-14,width:r.width+28,height:r.height+28,text:e.innerText}})()""")
c.shot(ROOT/'assets/session-guest.png',{k:r[k] for k in ['x','y','width','height']});(ROOT/'research/session-guest.json').write_text(json.dumps({'url':url,**r},indent=2));c.close();print('guest captured')
