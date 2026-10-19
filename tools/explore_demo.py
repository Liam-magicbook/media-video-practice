from cdp import Chrome,ROOT
import json,time
c=Chrome();c.nav('https://poppy-caller.roundtrip.workers.dev')
print(c.js("[...document.querySelectorAll('button,textarea,a,input')].map(e=>({tag:e.tagName,text:e.innerText,title:e.title,placeholder:e.placeholder,href:e.href,type:e.type}))"),flush=True)
c.js("[...document.querySelectorAll('button')].find(e=>e.innerText.includes('Exchange my jacket')).click()")
time.sleep(.5);print('after quick',c.js('document.body.innerText'),flush=True)
print(c.js("[...document.querySelectorAll('button,textarea')].map(e=>({tag:e.tagName,text:e.innerText,title:e.title,placeholder:e.placeholder,value:e.value,aria:e.getAttribute('aria-label')}))"),flush=True)
(ROOT/'research/recut/explore-port.txt').write_text(str(c.port))
for k in range(18):
 time.sleep(2)
 txt=c.js('document.body.innerText')
 if k%3==0:print('step',k,txt[-5000:],flush=True)
 if 'Sign in at Northstar' in txt:break
c.shot(ROOT/'research/recut/demo-after.png');(ROOT/'research/recut/demo-after.txt').write_text(txt)
print('links',c.js("[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.href,target:a.target}))"),flush=True)
# Keep browser alive for follow-up inspection; profile is disposable and has no real account.
for _ in range(120):
 if (ROOT/'research/recut/close-demo').exists():break
 time.sleep(1)
c.close()
