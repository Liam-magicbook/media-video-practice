from cdp import Chrome
import json
c=Chrome()
for url in ['https://personalagentprotocol.org/docs/spec','https://sierra.ai/blog/poppy']:
 c.nav(url)
 print(url,json.dumps(c.js("[...document.querySelectorAll('h1,h2,h3,h4,p,li')].filter(e=>/Introduction|Sharing a draft|participate|signs in and approves|Scopes|Open topics/.test(e.innerText)).filter(e=>e.innerText.length<800).map(e=>({tag:e.tagName,text:e.innerText,x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,parent:e.parentElement.tagName,cls:e.parentElement.className}))"),ensure_ascii=False))
c.close()
