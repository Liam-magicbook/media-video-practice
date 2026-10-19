from cdp import Chrome,ROOT
import time,json,requests
out=ROOT/'research/recut';out.mkdir(exist_ok=True)
c=Chrome()
for name,url in [('caller','https://poppy-caller.roundtrip.workers.dev'),('receiver','https://poppy-receiver.roundtrip.workers.dev')]:
 try:
  c.nav(url);time.sleep(2);txt=c.js('document.body.innerText');print(name,txt[:9000],flush=True);c.shot(out/(name+'.png'));(out/(name+'.txt')).write_text(txt)
 except Exception as e:print(name,str(e),flush=True)
c.close()
try:
 r=requests.get('https://cdn.syndication.twimg.com/tweet-result',params={'id':'2108245197440307584','lang':'en','token':'0'},timeout=20);print('syndication',r.status_code,r.text[:1500],flush=True);(out/'x-syndication.json').write_text(r.text)
except Exception as e:print(e)
