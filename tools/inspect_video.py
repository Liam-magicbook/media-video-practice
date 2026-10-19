from cdp import Chrome,ROOT
c=Chrome();c.nav((ROOT/'research/inspect.html').as_uri())
for kind in ['muse','cnbc']:
 c.js(f'run("{kind}")');c.shot(ROOT/'research'/f'{kind}-contact.png',{'x':0,'y':0,'width':1500,'height':1520})
c.close()
