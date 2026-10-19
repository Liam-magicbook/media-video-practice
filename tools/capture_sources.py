from cdp import Chrome,ROOT
import json,time
c=Chrome(); record=[]
# Capture DOM evidence exactly as rendered, without re-typesetting source content.
def cap(name,url,terms,ctx=16):
 c.nav(url)
 r=c.js('''(()=>{ const terms=%s; const root=document.querySelector('article.doc')||document; const all=[...root.querySelectorAll('h1,h2,h3,h4,p,li,table,pre')].filter(e=>!e.closest('nav')); const norm=s=>s.replace(/[\s.]/g,''); let els=terms.map(t=>{let matches=all.filter(e=>norm(e.innerText||'').startsWith(norm(t)));matches.sort((a,b)=>a.innerText.length-b.innerText.length);return matches[0]});if(els.some(e=>!e))return {missing:terms.filter((t,i)=>!els[i])};const rr=els.map(e=>{let r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:e.innerText}});return {rects:rr,title:document.title};})()'''%json.dumps(terms))
 if 'missing'in r:print(name,r);return
 rs=r['rects'];x=min(z['x'] for z in rs)-ctx;y=min(z['y'] for z in rs)-ctx;w=max(z['x']+z['w'] for z in rs)-x+ctx;h=max(z['y']+z['h'] for z in rs)-y+ctx
 rect={'x':max(0,x),'y':max(0,y),'width':w,'height':h}
 c.shot(ROOT/'assets'/f'{name}.png',rect); record.append({'name':name,'url':url,'rect':rect,**r});print(name,round(w),round(h))
 (ROOT/'research'/f'{name}.txt').write_text(c.js('document.body.innerText'))
spec='https://personalagentprotocol.org/docs/spec'
cap('spec-intro',spec,['Personal Agent Protocol','1 Introduction','This is draft version 0.1.'])
cap('spec-discovery',spec,['3 Discovery','A Company MUST publish its'])
cap('spec-scopes',spec,['Scopes','Scopes say what account access','Scope','The scopes are independent:'])
cap('spec-direct',spec,['4.5 Direct Sign-In','2. The User signs in and approves.'])
cap('spec-session',spec,['4 Sessions and authorization','The protocol uses two kinds of token:'])
cap('draft-head','https://sierra.ai/blog/poppy',['Sharing a draft of Personal Agent Protocol','Since announcing','So today'])
cap('path-open','https://personalagentprotocol.org/docs/path-to-1',['Open topics',"These are larger areas",'Payments.','Push notifications.','Attachments.'])
cap('extensions','https://personalagentprotocol.org/docs/extensions',['What extensions are','Extensions add optional features','Supporting an extension','Extension'])
cap('ops-intro','https://personalagentprotocol.org/docs/extensions/operations',['1 Introduction','The operations extension lets','Approval covers the exact terms.','One record across channels.','At most once.','The extension is optional'])
cap('ops-trust','https://personalagentprotocol.org/docs/extensions/operations',['8 What a confirmation proves','A confirmation shows',"It doesn't prove"])
(ROOT/'research/captures.json').write_text(json.dumps(record,ensure_ascii=False,indent=2));c.close()
