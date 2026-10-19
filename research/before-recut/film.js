/* Original edit for this material package. Every source image is a real capture.
   The renderer works in source coordinates: camera moves and evidence marks share
   the same matrix. rAF drives continuous motion; video elements play natively. */
'use strict';
const cvs=document.getElementById('film'), g=cvs.getContext('2d',{alpha:false});
const W=1920,H=1080,DURATION=120, cues=window.CUES;
window.__DUR=DURATION;
const C={bg:'#101b20',paper:'#f2f0e9',ink:'#131d21',green:'#a9f2bc',coral:'#ff9379',muted:'#9fb3b4',white:'#f7f8f3'};
const F='"Film Sans",sans-serif', Q='"Film Serif",serif', N='"Film Numbers",sans-serif', M='"SFMono-Regular",Consolas,monospace';
const imgs={},assets=['partners.webp','architecture.webp','draft-head.png','spec-intro.png','spec-discovery.png','spec-session.png','session-guest.png','spec-direct.png','spec-scopes.png','ops-intro.png','ops-trust.png','path-open.png','fp_poppy-section-01.png','speaker.png','x-post-2108245197440307584.png','x-post-2109096066746380721.png','x-post-2109280806078165198.png'];
const voice=document.getElementById('voice'),muse=document.getElementById('muse'),cnbc=document.getElementById('cnbc');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,p)=>a+(b-a)*p;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,p)=>a.map((v,i)=>lerp(v,b[i],p));
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
function line(x1,y1,x2,y2,color=C.green,width=3,p=1){g.beginPath();g.moveTo(x1,y1);g.lineTo(lerp(x1,x2,clamp(p)),lerp(y1,y2,clamp(p)));g.strokeStyle=color;g.lineWidth=width;g.stroke()}
// Typography roles: heavy sans for headlines, serif for questions/conclusions,
// condensed figures for data, and a restrained sans for narration and provenance.
function text(s,x,y,size=36,color=C.white,weight=500,align='left',font=F){
 const display=font===F&&size>=60;
 const actualWeight=display?850:(font===N?700:weight);
 g.fillStyle=color;g.font=`${actualWeight} ${size}px ${font}`;
 g.textAlign=align;g.textBaseline='alphabetic';
 g.letterSpacing=display?`${-size*.025}px`:(font===Q&&size>=50?`${-size*.012}px`:'0px');
 g.fillText(s,x,y);g.letterSpacing='0px';
}
function wrap(s,x,y,max,size=34,color=C.ink,lineHeight=1.55,weight=500){let row='',n=0;for(const ch of s){g.font=`${weight} ${size}px ${F}`;if(g.measureText(row+ch).width>max){text(row,x,y+n*size*lineHeight,size,color,weight);row=ch;n++}else row+=ch}if(row)text(row,x,y+n*size*lineHeight,size,color,weight);return(n+1)*size*lineHeight}
function tag(s,x,y,color=C.green,size=25){g.font=`600 ${size}px ${F}`;const w=g.measureText(s).width+32;rect(x,y-size-8,w,size+22,color);text(s,x+16,y,size,C.ink,650);return w}
function title(kicker,main,t,color=C.green,font=F){text(kicker,90,149,26,color,600);const u=smooth(t/.42);g.save();g.globalAlpha=u;text(main,90,244+(1-u)*18,74,C.white,700,'left',font);g.restore()}
function paper(x,y,w,h){g.save();g.shadowColor='#00000045';g.shadowBlur=36;g.shadowOffsetY=14;rect(x,y,w,h,'#fff');g.restore()}
// Crops use normalized SOURCE coordinates, never a re-created page.
function source(name,box,crop=[0,0,1,1],marks=[],shadow=true){
 const im=imgs[name], [x,y,w,h]=box;if(!im)return;
 const iw=im.naturalWidth,ih=im.naturalHeight;let [sx,sy,sw,sh]=crop.map((v,i)=>v*(i%2?ih:iw));
 const s=Math.min(w/sw,h/sh),dw=sw*s,dh=sh*s,dx=x+(w-dw)/2,dy=y+(h-dh)/2;
 if(shadow)paper(dx,dy,dw,dh);
 g.save();g.beginPath();g.rect(dx,dy,dw,dh);g.clip();g.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);
 for(const m of marks){const r=m.r,[rx,ry,rw,rh]=[dx+(r[0]*iw-sx)*s,dy+(r[1]*ih-sy)*s,r[2]*iw*s,r[3]*ih*s];
  const p=clamp(m.p??1);if(p<=0)continue;const col=m.c||'#167448';
  if(m.fill){g.globalAlpha=.13*p;rect(rx,ry,rw,rh,col);g.globalAlpha=1;}
  if(m.underline){line(rx,ry+rh,rx+rw,ry+rh,col,4,p)}else{
   g.strokeStyle=col;g.lineWidth=m.width||3;g.setLineDash([2*(rw+rh)]);g.lineDashOffset=2*(rw+rh)*(1-p);g.strokeRect(rx,ry,rw,rh);g.setLineDash([]);
  }
 }
 g.restore();return {x:dx,y:dy,w:dw,h:dh,map:(nx,ny)=>[dx+(nx*iw-sx)*s,dy+(ny*ih-sy)*s]};
}
function footage(v,box,crop=[0,0,1,1]){if(v.readyState<2)return;const [x,y,w,h]=box,iw=v.videoWidth,ih=v.videoHeight;const [sx,sy,sw,sh]=crop.map((q,i)=>q*(i%2?ih:iw));g.save();g.beginPath();g.rect(x,y,w,h);g.clip();const s=Math.max(w/sw,h/sh);g.drawImage(v,sx,sy,sw,sh,x+(w-sw*s)/2,y+(h-sh*s)/2,sw*s,sh*s);g.restore()}
function arrow(a,b,p=1,color=C.green){line(...a,...b,color,3,p);if(p>.98){const r=Math.atan2(b[1]-a[1],b[0]-a[0]);line(b[0],b[1],b[0]-14*Math.cos(r-.45),b[1]-14*Math.sin(r-.45),color,3);line(b[0],b[1],b[0]-14*Math.cos(r+.45),b[1]-14*Math.sin(r+.45),color,3)}}
function pin(x,y,label,p,color=C.green){if(p<=0)return;g.save();g.globalAlpha=clamp(p);g.beginPath();g.arc(x,y,8,0,Math.PI*2);g.fillStyle=color;g.fill();line(x,y,x+56,y,color,2);tag(label,x+56,y+9,color,24);g.restore()}
const S=(i)=>cues[i].start, E=(i)=>cues[i].end;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
function cueAt(t){let i=0;while(i<cues.length-1&&t>=cues[i+1].start)i++;return i}
function cueP(t,i){return prog(t,S(i),E(i))}
const sceneOf=i=>i<3?0:i===3?1:i===4?2:i===5?3:i<8?4:i<10?5:i<12?6:i<15?7:i<17?8:i<21?9:i<24?10:i<26?11:i===26?12:i===27?13:14;
const sceneFirst=[0,3,4,5,6,8,10,12,15,17,21,24,26,27,28];
const chapters=['01 / 谁在替你操作','01 / 谁在替你操作','01 / 谁在替你操作','01 / 谁在替你操作','02 / 一次授权的路径','02 / 一次授权的路径','02 / 一次授权的路径','02 / 一次授权的路径','02 / 一次授权的路径','03 / 演示与真实边界','03 / 演示与真实边界','03 / 演示与真实边界','03 / 演示与真实边界','03 / 演示与真实边界','03 / 演示与真实边界'];
let sourceLine='';
function draw(t){
 t=clamp(t,0,DURATION);const i=cueAt(t),sc=sceneOf(i),a=S(sceneFirst[sc]),u=t-a,p=cueP(t,i),q=smooth(p),enter=smooth(u/.48);
 rect(0,0,W,H,C.bg);
 // A restrained editorial grid, only to anchor geometry around real material.
 g.globalAlpha=.07;line(90,85,1830,85,'#c9d8d5',1);line(90,946,1830,946,'#c9d8d5',1);g.globalAlpha=1;
 switch(sc){
 case 0:{
  sourceLine='Meta · Muse Shopping 官方产品演示（9 月）；场景背景，非 Poppy 峰会演示';
  footage(muse,[720,90,1110,840],[.28,0,.44,1]);
  const grad=g.createLinearGradient(650,0,1000,0);grad.addColorStop(0,C.bg);grad.addColorStop(1,'#101b2000');rect(650,90,350,840,grad);
  text('当 AI 开始替你办事',90,194,29,C.green,600);
  if(i===0){text('一句话',90,332,108,C.white,650);text('就能下单。',90,465,108,C.white,650);line(95,508,540,508,C.green,6,smooth((u-.5)/1.1));text('真实产品演示 / MUSE',95,585,26,C.muted,500);}
  else if(i===1){text('交出去的',90,330,89,C.white,650);text('还有权限。',90,455,100,C.green,650);text('看订单？',95,595,39,C.white,500);arrow([285,583],[390,583],smooth(p*2));text('改订单？',420,595,39,C.coral,500);}
  else{ text('能看',90,330,106,C.white,650);text('就能改？',90,465,106,C.coral,750,'left',Q);line(95,515,635,515,C.coral,5,smooth(p*2));text('网站需要认出这个“代表”',95,600,30,C.muted);}
  tag('官方演示',1490,141,C.paper,23);
  break;}
 case 1:{
  sourceLine='CNBC · 2026.10.06 报道画面；中文为本片解说';
  footage(cnbc,[75,160,1320,743]);
  text('给代理',1460,326,65,C.white,650);text('写规则',1460,410,65,C.green,650);
  text('Meta',1460,550,51,C.white,600);line(1460,584,1800,584,C.green,4,smooth(u));text('Sierra',1460,665,51,C.white,600);text('Personal Agent',1460,791,25,C.muted);text('Protocol',1460,830,25,C.muted);break;}
 case 2:{
  sourceLine='Sierra · Sharing a draft of Personal Agent Protocol · 2026.10.09';
  text('Poppy',90,242,130,C.green,700,'left',N);text('Personal Agent Protocol',620,232,49,C.white,550);tag('2026.10.09 / 草案公开',90,315,C.paper,27);
  source('draft-head.png',[75,370-18*q,1770+35*q,535],[0,0,1,1],[{r:[.318,.48,.65,.16],p:smooth((p-.2)*2),fill:true,c:'#167448'}]);
  break;}
 case 3:{
  sourceLine='Sierra · 10 月 9 日公布新增设计伙伴；身份为 design partners';
  text('35',80,424,235,C.green,700,'left',N);text('新增设计伙伴',90,515,52,C.white,600);
  text('参与草案设计',95,620,34,C.green);line(95,660,470,660,C.green,4,smooth(p*2));text('接入情况仍需逐家确认',95,731,26,C.muted);
  source('partners.webp',[525-18*q,155,1330+28*q,748],[.08,.03,.84,.94],[],false);break;}
 case 4:{
  sourceLine='personalagentprotocol.org · Draft 0.1 · §3 Discovery';
  title('DISCOVERY / 01','先找到入口',u);
  source('spec-discovery.png',[90-10*q,340,1740+20*q,438],[0,0,1,1],i===7?[{r:[.015,.41,.97,.5],p:smooth(p*2.3),fill:true}]:[]);
  if(i===6){text('代理从哪儿知道：',100,847,36,C.muted);text('该登录哪里、能用哪些能力？',485,847,36,C.white,600);}
  else{const w=smooth(p*2);g.save();g.beginPath();g.rect(100,803,1730*w,90);g.clip();text('/.well-known/poppy.json',100,865,48,C.green,550,'left',M);g.restore();}
  break;}
 case 5:{
  sourceLine=i===8?'personalagentprotocol.org · Draft 0.1 · §4 Sessions and authorization':'Sierra · Sharing a draft / Sessions：可先以访客询问，再按任务需要登录';
  title('SESSION / 02',i===8?'先说明：我是谁的代理':'还没登录，也能先问',u);
  if(i===8)source('spec-session.png',[90,300,1740,510],[0,.045,1,.78],[{r:[.015,.285,.975,.20],p:smooth(p*2),fill:true}]);
  else source('session-guest.png',[90,360-12*q,1740,390],[0,.06,1,.87],[{r:[.014,.14,.97,.70],p:smooth(p*2),fill:true}]);
  rect(100,805,1720,94,'#1c3034');tag(i===8?'代理身份 + 会话':'访客会话',120,864,C.green,30);
  text(i===8?'企业知道请求来自代理':'查库存   /   问退货政策',510,864,37,C.white,550);break;}
 case 6:{
  sourceLine='personalagentprotocol.org · Draft 0.1 · §4.5 Direct Sign-In（直接登录示例）';
  title('SIGN-IN / 03',i===10?'要用账户，先取得授权':'在商家页面，选择访问范围',u);
  if(i===10){
   source('spec-direct.png',[875,300,940,600],[0,.65,1,.35],[{r:[.016,.805,.966,.17],p:smooth(p*2),fill:true}]);
   text('你',160,441,72,C.white,650);arrow([270,417],[620,417],smooth(p*1.6));text('商家',635,441,60,C.green,650);
   text('登录 → 审阅 → 同意或拒绝',130,590,37,C.white,550);text('此处展示 direct 登录方式',130,670,27,C.muted);
  }else{
   const k=smooth((t-S(11))/.65);
   source('spec-direct.png',mix([875,300,940,600],[90,345,1740,420],k),[0,.79,1,.21],[{r:[.016,.805,.966,.17],p:smooth(p*2),fill:true}]);
   if(k>.7){text('选择哪些权限',100,846,41,C.green,600);text('也可以拒绝',1215,846,41,C.white,600);line(435,832,1150,832,C.green,3,smooth((k-.7)/.3));}
  }break;}
 case 7:{
  sourceLine='personalagentprotocol.org · Draft 0.1 · §4.4 Scopes：read 与 write 相互独立';
  title('SCOPES / 04',i===12?'读取、修改，是两种权限':i===13?'能看，不自动等于能改':'每一种操作，都要检查权限',u);
  let crop=i===14?mix([0,0,1,1],[0,.55,1,.44],smooth(p*1.5)):[0,0,1,1];
  let marks=i===12?[{r:[.015,.408,.97,.117],p:smooth(p*3),fill:true},{r:[.015,.526,.97,.117],p:smooth((p-.4)*3),fill:true,c:'#b85c39'}]:i===13?[{r:[.015,.408,.97,.117],p:1,fill:true},{r:[.015,.526,.97,.117],p:smooth(p*2),c:'#b85c39'}]:[{r:[.015,.711,.97,.245],p:smooth(p*2),fill:true}];
  source('spec-scopes.png',[90,310,1740,590],crop,marks);
  if(i===13){tag('读取',185,880,C.green,29);text('≠',920,888,61,C.coral,650);tag('修改',1600,880,C.coral,29);}
  break;}
 case 8:{
  sourceLine='Sierra · Poppy 官方架构图；动画追踪为本片解释性标注';
  text('同一次会话',90,180,69,C.white,650);text('跨越三个通道',90,267,53,C.green,600);
  const k=smooth(prog(t,S(15),E(16)));
  const z=source('architecture.webp',[520-55*k,110,1250+70*k,820],[.226,.15,.545,.704],[],false);
  // Marks stay registered to the actual diagram as the source camera moves.
  if(z){const paths=[[.332,.641],[.5,.641],[.667,.641]], hub=z.map(.5,.525);let progress=prog(t,S(15)+.4,E(15)-.4)*3;
   for(let n=0;n<3;n++){const b=z.map(...paths[n]);const c=z.map(paths[n][0],.57);const r=clamp(progress-n);line(...hub,...c,C.green,4,r);line(...c,...b,C.green,4,r);if(r>.95){g.beginPath();g.arc(...b,9,0,7);g.fillStyle=C.green;g.fill();}}
   if(i===16){const r=smooth(p*1.8);const tl=z.map(.247,.408),br=z.map(.753,.702);g.strokeStyle=C.coral;g.lineWidth=4;g.strokeRect(tl[0],tl[1],(br[0]-tl[0])*r,br[1]-tl[1]);}
  }
  const labels=['网页','API 接口','企业代理'];labels.forEach((s,n)=>{const r=smooth((u-n*.9)/.5);g.globalAlpha=r;text(String(n+1).padStart(2,'0'),95,445+n*100,29,C.green,600,'left',M);text(s,160,445+n*100,40,C.white,600);g.globalAlpha=1});
  if(i===16)text('换通道，权限仍有效',95,820,29,C.coral,600);break;}
 case 9:{
  sourceLine='Sierra 官方演示帖 / 官方文章；静态原帖与演示描述，非独立验证或实际放贷证明';
  text('它演示过什么？',90,189,71,C.white,650);tag('官方自述 / 峰会演示',1375,174,C.paper,24);
  if(i<=18){
   source('x-post-2108245197440307584.png',[90,250,670,670],[0,0,1,1],i===18?[{r:[.02,.11,.96,.15],p:smooth(p*2),fill:true}]:[]);
   source('speaker.png',[1500,287,294,368],[0,0,1,1],[],false);text('Alex McGillis',1480,705,27,C.white,600);text('Rocket / 产品负责人',1480,747,23,C.muted);
   const labels=i===17?['Muse','Rocket','用户授权']:['Muse 找到企业代理','用户登录并授权'];
   labels.forEach((s,n)=>{text(s,850,395+n*170,38,n===labels.length-1?C.green:C.white,600);if(n<labels.length-1)arrow([900,430+n*170],[900,500+n*170],smooth((u-n*.6)/.7));});
  }else{
   source('fp_poppy-section-01.png',[90,320-12*q,1740,455],[0,.067,1,.87],[{r:[.014,.671,.97,.15],p:smooth(p*2),fill:true,c:i===20?'#b85c39':'#167448'}]);
   if(i===19){text('Muse × Rocket',100,845,45,C.white,600);text('房贷预批信',1380,845,45,C.green,700,'left',Q);arrow([530,825],[1320,825],smooth(p*1.7));}
   else{tag('演示',110,865,C.coral,36);text('预批信 ≠ 贷款已发放',700,865,58,C.white,700,'left',Q);line(700,890,1800,890,C.coral,4,smooth(p*2));}
  }break;}
 case 10:{
  sourceLine='Dino A. Dai Zovi 原帖（10.11） / Meta Muse 购物演示背景（慢放，非 Poppy 演示）；观点不代表漏洞证据';
  title('THE HARD PART / 真实边界',i===21?'谁来证明，人真的同意？':i===22?'人的确认，应该怎样证明？':'担忧，仍需具体证据',u,C.coral,Q);
  // Return to the real checkout flow: an image of approval versus proof of approval.
  footage(muse,[90,312,700,605],[.31,.46,.38,.48]);
  tag('Muse 产品演示 / 慢放',110,350,C.paper,22);
  if(i<=22){
   source('x-post-2109096066746380721.png',[855,312,975,610],[0,0,1,1],[{r:[.017,.174,.958,.14],p:i===21?smooth(p*2):1,fill:true,c:'#b85c39'}]);
   if(i===22)tag('人的确认如何证明？',870,907,C.coral,26);
  }else{
   source('x-post-2109280806078165198.png',[855,350,975,485],[0,0,1,1],[{r:[.025,.235,.94,.092],p:smooth(p*2),fill:true,c:'#b85c39'}]);
   tag('作者：不了解具体系统',870,329,C.coral,25);
   text('假设性担忧，尚未验证为漏洞',865,897,32,C.muted,550);
  }
  break;}
 case 11:{
  sourceLine='personalagentprotocol.org · operations v1（可选扩展）· 确认覆盖条款版本，按 operation ID 防重复';
  title('OPERATIONS / 可选扩展',i===24?'把确认，绑定到具体条款':'同一个动作，只执行一次',u);
  tag('可选 / 非所有动作默认启用',1340,149,C.green,24);
  source('ops-intro.png',[95,330,1730,490],[0,.374,1,.355],[{r:i===24?[.012,.397,.972,.112]:[.012,.643,.972,.079],p:smooth(p*2.2),fill:true}]);
  if(i===24){text('具体条款',105,895,39,C.green,600);arrow([330,880],[1510,880],smooth(p*1.7));text('确认',1580,895,39,C.white,600);}
  else{tag('同一 operation ID',110,880,C.paper,30);const n=clamp(p*3);text('重试',730,884,37,C.muted);arrow([840,868],[1230,868],smooth(n));tag('至多执行 1 次',1280,880,C.green,33);text('新版本条款须有覆盖该版本的批准',110,934,24,C.muted);}
  break;}
 case 12:{
  sourceLine='personalagentprotocol.org · operations §8 What a confirmation proves；需要更强证明时可回到商家页面批准';
  title('TRUST / 文档明确写出的边界','代理的确认记录 ≠ 人已同意',u,C.coral,Q);
  source('ops-trust.png',[90,340-14*q,1740,500],[0,.50,1,.5],[{r:[.012,.545,.965,.062],p:smooth(p*2.5),fill:true,c:'#b85c39'}]);
  text('“代理说获准”',115,900,39,C.white,650,'left',Q);arrow([490,884],[1320,884],smooth(p*2),C.coral);text('仍依赖信任',1430,900,39,C.coral,600);break;}
 case 13:{
  sourceLine='personalagentprotocol.org · Path to 1.0 / Open topics · 当前草案仍可发生不兼容变化';
  text('草案还有边界',90,181,72,C.white,650);
  const d=source('path-open.png',[90,240,1455,682],[0,0,1,1],[{r:[.015,.495,.97,.465],p:smooth(p*2),fill:true}]);
  const labs=['支付','主动通知','附件'];labs.forEach((s,n)=>{const f=smooth((p-n*.2)*3);g.globalAlpha=f;text(String(n+1).padStart(2,'0'),1600,405+n*180,26,C.green,600,'left',M);text(s,1600,465+n*180,38,C.white,600);g.globalAlpha=1});break;}
 case 14:{
  sourceLine='事实依据：Sierra 10.09 公告 / Poppy Draft 0.1 / operations 扩展；原始链接随片保存在 SOURCES.md';
  if(i===28){
   text('接下来，看什么？',90,195,75,C.white,650);
   source('partners.webp',[90,300,840,500],[.08,.16,.84,.65],[],false);
   source('spec-scopes.png',[990,300,840,500],[0,.20,1,.78],[]);
   text('企业真正接入',90,886,45,C.green,600);text('权限真正执行',990,886,45,C.green,600);line(90,915,930,915,C.green,3,smooth(p*2));line(990,915,1830,915,C.green,3,smooth((p-.2)*2));
  }else{
   // The last shot links the source permission table to the source action terms.
   source('spec-scopes.png',[90,150,850,450],[0,.24,1,.37],[]);
   source('ops-intro.png',[1000,150,830,450],[0,.382,1,.15],[]);
   text('一次授权',110,765,113,C.white,750,'left',Q);text('一个动作',1335,765,113,C.green,750,'left',Q);
   arrow([665,728],[1260,728],smooth(p*1.7));text('能否真正约束？',960,891,45,C.muted,550,'center');
   if(t>118.1){const f=smooth((t-118.1)/.7);g.globalAlpha=f;text('AI 替你办事，权限谁说了算？',960,127,31,C.green,600,'center');g.globalAlpha=1;}
  }break;}
 }
 // Source credit and editorial chrome do not move with the evidence plate.
 rect(0,0,1920,86,'#101b20');rect(90,40,20,20,C.green);text('科技观察',129,61,25,C.white,650);text('PERSONAL AGENT PROTOCOL',310,60,22,C.muted,500,'left',M);text(chapters[sc],1830,61,24,C.muted,550,'right');
 rect(0,951,1920,129,'#0c1519');text(sourceLine,90,981,21,C.muted,500);
 const c=cues[i],cp=smooth((t-c.start)/.13);g.save();g.globalAlpha=t<c.start?0:cp;text(c.text,960,1040,38,C.white,550,'center');g.restore();
 rect(90,1069,1740,3,'#304144');rect(90,1069,1740*t/DURATION,3,C.green);
 // A short directional cut on selected joins, never a slideshow crossfade.
 if([4,8,11,12].includes(sc)&&u<.2){const r=1-u/.2;rect(0,86,24+100*r,865,C.green);}
}
let playing=true,current=0,origin=0,audioDriven=false,started=false,activeVideo=null,lastSync=0;
function mediaFor(t){const i=cueAt(t),sc=sceneOf(i);if(sc===0)return {v:muse,time:6+t*1.48,rate:1.48};if(sc===1)return {v:cnbc,time:31+(t-S(3)),rate:1};if(sc===10)return {v:muse,time:16.2+(t-S(21))*.55,rate:.55};return null}
function syncMedia(t,force=false){const m=mediaFor(t);if(activeVideo&&(!m||activeVideo!==m.v)){activeVideo.pause();activeVideo=null}if(!m)return;
 const v=m.v,desired=Math.min(m.time,v.duration-.05);if(force||activeVideo!==v||Math.abs(v.currentTime-desired)>.32){if(v.readyState>=1)v.currentTime=Math.max(0,desired)}
 v.playbackRate=m.rate;if(playing){v.play().catch(()=>{})}else v.pause();activeVideo=v;
}
function stamp(){return audioDriven&&!voice.paused?voice.currentTime:current+(playing?(performance.now()-origin)/1000:0)}
function setTime(t){current=clamp(t,0,120);origin=performance.now();if(audioDriven)voice.currentTime=current;syncMedia(current,true);draw(current)}
window.seek=(t)=>{playing=false;voice.pause();audioDriven=false;setTime(t);document.getElementById('pause').textContent='播放';return t};
window.renderAt=(t)=>{draw(t);return cueAt(t)};
async function enableSound(){const t=clamp(stamp(),0,119.99);voice.currentTime=t;voice.muted=false;try{await voice.play();audioDriven=true;playing=true;document.getElementById('sound').textContent='旁白已开启';document.getElementById('sound').classList.remove('blocked');document.getElementById('pause').textContent='暂停'}catch(e){document.getElementById('sound').classList.add('blocked');document.getElementById('sound').textContent='点击开启旁白'}}
function tick(now){if(started){let t=clamp(stamp(),0,120);if(t>=120){current=120;playing=false;voice.pause();muse.pause();cnbc.pause();document.getElementById('pause').textContent='播放'}draw(t);if(now-lastSync>250){syncMedia(t);lastSync=now;document.getElementById('seek').value=t}}requestAnimationFrame(tick)}
requestAnimationFrame(tick);
document.getElementById('sound').onclick=()=>{if(audioDriven&&!voice.muted){voice.muted=true;document.getElementById('sound').textContent='开启旁白'}else enableSound()};
document.getElementById('pause').onclick=()=>{if(playing){current=clamp(stamp(),0,120);playing=false;voice.pause();muse.pause();cnbc.pause()}else{if(current>=120)current=0;origin=performance.now();playing=true;if(audioDriven){voice.currentTime=current;voice.play().catch(()=>{audioDriven=false})}}document.getElementById('pause').textContent=playing?'暂停':'播放'};
document.getElementById('replay').onclick=()=>{setTime(0);playing=true;if(audioDriven)voice.play().catch(()=>{audioDriven=false});document.getElementById('pause').textContent='暂停'};
document.getElementById('full').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()};
document.getElementById('seek').oninput=e=>setTime(+e.target.value);
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();document.getElementById('pause').click()}if(e.code==='ArrowRight')setTime(stamp()+5);if(e.code==='ArrowLeft')setTime(stamp()-5)});
async function ready(){
 try{
  await Promise.all(assets.map(n=>new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{imgs[n]=im;resolve()};im.onerror=()=>reject(new Error('素材无法载入：'+n));im.src='assets/'+n})));
  await Promise.all([muse,cnbc,voice].map(el=>el.readyState>=2?Promise.resolve():new Promise((r,j)=>{el.addEventListener('loadeddata',r,{once:true});el.addEventListener('error',()=>j(new Error('音视频无法载入')),{once:true})})));
  await Promise.all([document.fonts.load('850 80px "Film Sans"','权限'),document.fonts.load('750 80px "Film Serif"','授权'),document.fonts.load('700 80px "Film Numbers"','35')]);
  await document.fonts.ready;document.getElementById('status').remove();origin=performance.now();started=true;syncMedia(0,true);draw(0);
  if(new URLSearchParams(location.search).has('review')){window.seek(0)}else{
   try{await voice.play();audioDriven=true;document.getElementById('sound').textContent='旁白已开启'}catch(e){audioDriven=false;document.getElementById('sound').textContent='点击开启旁白';document.getElementById('sound').classList.add('blocked')}
  }
  window.__READY=true;
 }catch(e){document.getElementById('status').textContent=e.message+'。请保持 film.html、JS 与 assets 在同一目录。';console.error(e)}
}
ready();
