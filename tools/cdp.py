import base64,json,os,subprocess,time,urllib.request,tempfile,shutil
from pathlib import Path
import websocket
ROOT=Path(__file__).resolve().parents[1]
class Chrome:
 def __init__(self):
  self.profile=Path(tempfile.mkdtemp(prefix='video-media-chrome-'))
  self.proc=subprocess.Popen(['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','--headless=new','--no-first-run','--no-default-browser-check','--hide-scrollbars','--remote-allow-origins=*','--remote-debugging-port=0',f'--user-data-dir={self.profile}','--window-size=1600,1000'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  for _ in range(150):
   try:
    self.port=int((self.profile/'DevToolsActivePort').read_text().splitlines()[0]);break
   except:time.sleep(.1)
  tabs=json.load(urllib.request.urlopen(f'http://127.0.0.1:{self.port}/json'))
  self.ws=websocket.create_connection(next(x['webSocketDebuggerUrl'] for x in tabs if x['type']=='page'),timeout=30,suppress_origin=True)
  self.seq=0; self.call('Page.enable');self.call('Runtime.enable')
  self.call('Emulation.setDeviceMetricsOverride',{'width':1600,'height':1000,'deviceScaleFactor':1.5,'mobile':False})
 def call(self,method,params={}):
  self.seq+=1;i=self.seq;self.ws.send(json.dumps({'id':i,'method':method,'params':params}))
  while True:
   r=json.loads(self.ws.recv())
   if r.get('id')==i:
    if 'error'in r:raise RuntimeError(r['error'])
    return r.get('result',{})
 def js(self,s):
  r=self.call('Runtime.evaluate',{'expression':s,'returnByValue':True,'awaitPromise':True})
  if 'exceptionDetails'in r:raise RuntimeError(r['exceptionDetails'])
  return r.get('result',{}).get('value')
 def nav(self,url):
  self.call('Page.navigate',{'url':url});time.sleep(1)
  for _ in range(100):
   if self.js('document.readyState')=='complete':break
   time.sleep(.15)
  self.js('document.fonts.ready.then(()=>true)');time.sleep(1)
 def shot(self,path,rect=None):
  p={'format':'png','captureBeyondViewport':True,'clip':{'x':0,'y':0,'width':1600,'height':1000,'scale':1}}
  if rect:p['clip']={**rect,'scale':1}
  Path(path).write_bytes(base64.b64decode(self.call('Page.captureScreenshot',p)['data']))
 def close(self):
  try:self.call('Browser.close')
  except:pass
  self.proc.wait(timeout=10)
  shutil.rmtree(self.profile,ignore_errors=True)
if __name__=='__main__':
 c=Chrome();c.nav('https://personalagentprotocol.org/docs/spec');print(c.js('document.title'));c.shot(ROOT/'research/spec-initial.png');c.close()
