/* Recut around the verified Summit recording. No generated or reconstructed UI. */
'use strict';
const {clamp,lerp,ease,mix,C}=FilmCraft, K=FilmCraft.make(document.getElementById('film'));
const {g,rect,text,wrap,line,arrow,tag,image,strokeRect,veil,footer}=K;
const cues=window.CUES,S=i=>i===0?0:cues[i].start,E=i=>cues[i].end,P=(t,a,b)=>clamp((t-a)/(b-a));
const imgs={},imageNames=['draft-head.png','partners.webp','architecture.webp','spec-scopes.png','ops-intro.png','ops-trust.png','x-post-2109096066746380721.png','summit-link.jpg','summit-login.jpg','summit-result.jpg'];
const videos=[document.getElementById('summit-a'),document.getElementById('summit-b')],voice=document.getElementById('voice');
window.__DUR=120;
const segments=[
 {cue:0,last:0,in:0,out:4.5}, {cue:1,last:1,in:91.8,out:95.1}, {cue:2,last:2,in:132.6,out:135.2},
 {cue:3,last:3,in:68,out:73}, {cue:6,last:6,in:54.5,out:62}, {cue:7,last:7,in:132.1,out:135.4},
 {cue:17,last:17,in:92,out:95.1}, {cue:22,last:23,in:178.1,out:182.5},
 {cue:24,last:25,in:166,out:172}, {cue:26,last:27,in:188.5,out:194.1}
];
function which(t){return segments.findIndex(z=>t>=S(z.cue)&&t<E(z.last))}
function shotFor(t){const index=which(t);if(index<0)return null;const z=segments[index],d=E(z.last)-S(z.cue);return {index,v:videos[index%2],time:lerp(z.in,z.out,P(t,S(z.cue),E(z.last))),rate:(z.out-z.in)/d};}
const media=t=>shotFor(t)?.v;
const focus={linkCard:[.556,.468,.218,.158],linkButton:[.564,.603,.031,.021],loginCard:[.551,.505,.323,.142],loginButton:[.555,.602,.044,.031],pdf:[.557,.453,.119,.166],read:[.02,.409,.96,.116],write:[.02,.527,.96,.116],scopeRule:[.018,.72,.96,.22],approval:[.018,.398,.96,.108],once:[.018,.65,.96,.065],trust:[.018,.552,.96,.075]};
const keywords=['公开演示','允许连接','登录账户','多大的权限','Poppy','草案','任务本身','账户访问','同一次会话','授权边界','不自动允许','每种操作','什么动作','具体条款版本','哪个版本','最多执行一次','分别看','谁能证明','人的确认','声称获准','不能证明','自己的网站','预批信','不能当作','按授权办事','权限实际执行','三处','实际做了什么'];
function indexAt(t){let i=0;while(i<cues.length-1&&t>=S(i+1))i++;return i;}
function meta(label){const z=g.createLinearGradient(0,0,0,125);z.addColorStop(0,'#080e10bb');z.addColorStop(1,'#080e1000');rect(0,0,1920,125,z);rect(80,42,15,15,C.green);text('科技观察',112,61,24,{weight:700});text('POPPY / 代理的权限',285,61,21,{color:C.muted});text(label,1840,61,23,{align:'right',color:C.paper});}
function full(t,opts={}){return image(media(t),[0,0,1920,1080],{cover:true,...opts})}
function heading(a,b,y=260,color=C.white,face='sans'){text(a,85,y,76,{face,color});if(b)text(b,85,y+110,86,{face,color});}
function evidence(name,box,crop,opts={}){return image(imgs[name],box,{crop,...opts});}
function labelOver(s,x,y,p=1,color=C.red){g.save();g.globalAlpha=clamp(p);text(s,x,y,40,{color,weight:750});g.restore();}
function draw(t){
 t=clamp(t,0,120);const i=indexAt(t),q=ease(P(t,S(i),E(i))),u=t-S(i);rect(0,0,1920,1080,C.bg);let credit='Sierra / Personal Agent Protocol 官方材料',label='AI 替你办事，权限由谁决定？';
 if(i===0){
  full(t);veil('right',.92);text('SIERRA SUMMIT / 官方演示',1020,290,26,{color:C.green});text('让 AI',1020,430,105);text('申请房贷预批',1020,558,94);text('先看它问了什么',1020,682,38,{face:'serif',color:C.paper});
  credit='Sierra Summit 官方公开视频 · Alex McGillis / Rocket · 中文解说为本片编排';
 }else if(i===1){
  full(t,{focus:[focus.linkCard],dim:.77});veil('left',.85);
  text('第一道请求',85,275,29,{color:C.green});heading('先连接','企业代理',395);
  const crop=mix([.43,.365,.46,.295],[.548,.458,.235,.18],ease(P(t,S(1),S(1)+1.15)));
  image(media(t),[640,255,1200,555],{crop,focus:[[.562,.471,.207,.025],focus.linkButton],dim:.62,marks:[{r:focus.linkButton,p:ease((u-.75)/.8),color:'#aa3c27',width:4}]});
  labelOver('允许连接 Rocket 的代理？',705,855,ease((u-.7)/.7),C.paper);
  credit='Sierra Summit 演示原片 01:32–01:35 · 连接请求局部放大';
 }else if(i===2){
  full(t,{shade:.7});
  evidence('summit-link.jpg',[80,300,825,370],[.55,.463,.226,.17],{shade:.35});
  image(media(t),[1000,300,840,370],{crop:[.548,.502,.33,.148],marks:[{r:focus.loginButton,p:ease(u/.9),color:'#a63321',width:4}]});
  text('连接代理',90,243,57,{color:C.muted});text('登录账户',1015,243,66,{color:C.green});arrow([913,492],[986,492],ease(u/.7));
  text('看清每一次“允许”对应什么',90,847,68,{face:'serif'});
  credit='Sierra Summit 演示原片 · 左：连接请求定格；右：账户登录请求';
 }else if(i===3){
  full(t);veil('right',.95);text('替你办事的 AI',1000,330,65);text('该拿到',1000,455,100,{face:'serif'});text('多大的权限？',1000,585,100,{face:'serif',color:C.green});line([1005,640],[1770,640],ease(u/1.1),C.green,5);
  credit='Sierra Summit 官方演示 · 本片围绕身份、授权与动作边界展开';
 }else if(i===4||i===5){
  const p=ease(P(t,S(4),E(5)));evidence('partners.webp',[0,0,1920,1080],[0,0,1,1],{cover:true,shade:.85});
  if(i===4){
   text('Meta × Sierra',85,235,53,{color:C.green});text('Poppy',80,440,180,{face:'number'});text('为代理办事写规则',85,570,64,{face:'serif'});
   evidence('draft-head.png',[790,215,1050,600],[.3,.27,.7,.73],{focus:[[.32,.47,.66,.15]],dim:.52});
  }else{
   text('DRAFT',85,215,58,{face:'number',color:C.muted});text('0.1',80,425,210,{face:'number',color:C.green});text('2026.10.09 / 公开草案',90,525,33);
   evidence('partners.webp',[695,190,1150,650],[0,0,1,1]);text('设计伙伴',95,695,49);line([95,730],[510,730],ease(u/.8),C.red,4);text('已部署',95,808,48,{color:C.muted});text('≠',570,766,88,{face:'serif',color:C.red});
  }
  label='Poppy / Personal Agent Protocol';credit='Sierra 10 月 9 日草案公告与伙伴图 · 设计合作不代表生产部署';
 }else if(i===6){
  full(t,{crop:mix([0,0,1,1],[.32,.235,.68,.48],ease(u/1.3)),cover:true});
  const z=g.createLinearGradient(0,0,900,0);z.addColorStop(0,'#070d10dd');z.addColorStop(1,'#070d1000');rect(0,0,1100,1080,z);
  text('回到同一个任务',85,225,31,{color:C.green});heading('找房','接入房贷服务',370);arrow([125,410],[125,455],ease((u-.4)/.5));
  credit='Sierra Summit 原片 00:54–01:02 · Muse 展示房源并继续任务';
 }else if(i===7){
  full(t,{shade:.83});
  evidence('summit-link.jpg',[80,270,835,420],[.55,.463,.226,.17],{marks:[{r:focus.linkCard,p:1,color:'#a33e28',width:3}]});
  image(media(t),[1005,270,835,420],{crop:[.548,.502,.33,.148],marks:[{r:focus.loginButton,p:ease(u/.9),color:'#a33e28',width:4}]});
  text('01',85,210,65,{face:'number',color:C.green});text('连接企业代理',180,210,47);text('02',1005,210,65,{face:'number',color:C.green});text('取得账户访问',1100,210,47);
  arrow([920,480],[988,480],ease(u/.75));text('连接',90,836,53,{face:'serif'});arrow([260,817],[1270,817],ease((u-.6)/1.2));text('账户授权',1390,836,53,{face:'serif',color:C.green});
  credit='Sierra Summit 演示画面 · 两次请求分别对应连接与账户访问';
 }else if(i===8||i===9){
  const k=ease(P(t,S(8),E(9)));label='同一任务，跨越不同通道';
  const box=evidence('architecture.webp',[460-30*k,115,1390+30*k,815],[.23,.15,.54,.704]);
  heading('同一次会话','三个通道',315);text('授权随任务延续',90,805,36,{color:C.green});
  if(box){const nodes=[[.333,.64],[.5,.64],[.666,.64]],hub=box.map(.5,.526);const step=P(t,S(8)+.3,E(8)-.15)*3;
   for(let n=0;n<3;n++){const b=box.map(...nodes[n]),m=box.map(nodes[n][0],.58),v=clamp(step-n);line(hub,m,v,C.green,5);arrow(m,b,v,C.green,5);if(v>.8){text(['网页','API 接口','企业代理'][n],85,570+n*65,32,{color:C.paper});}}
   if(i===9){const r=box.mapRect([.245,.413,.51,.28]);strokeRect(r,ease(u/1.4),C.red,4);text('换通道，也要执行授权边界',90,875,35,{color:C.red});}
  }
  credit='Sierra 官方机制图 · 线条为解释性标注；企业可选择提供的通道';
 }else if(i===10||i===11){
  label='权限到底限制什么？';
  const read=focus.read,write=focus.write;const plate=[660,205,1180,660];
  evidence('spec-scopes.png',plate,[0,.235,1,.735],{focus:i===10?[read]:[read,write],dim:i===10?.66:.34,marks:[{r:read,p:1,color:'#286f42'},{r:write,p:i===11?ease(u/.85):0,color:'#b34c2d'}]});
  text('READ',90,260,47,{face:'number',color:C.green});text('查看订单',90,359,76);line([90,404],[520,404],ease(P(t,S(10),S(10)+.8)),C.green,5);
  const reveal=i===11?1:ease((u-1.7)/.55);g.save();g.globalAlpha=reveal;text('WRITE',90,550,47,{face:'number',color:C.red});text('修改订单',90,648,76);g.restore();
  if(i===10){text('≠',280,500,83,{face:'serif',color:C.red});}
  else{arrow([300,740],[1370,740],ease(u/1),C.green);text('企业按操作检查权限',90,856,58,{face:'serif'});}
  credit='Poppy Draft 0.1 / Scopes 原文 · read 与 write 相互独立，由企业执行';
 }else if(i===12){
  evidence('summit-login.jpg',[0,0,1920,1080],[0,0,1,1],{cover:true,shade:.82});
  evidence('summit-login.jpg',[85,250,770,405],[.548,.502,.33,.148]);
  text('获准访问账户',90,192,57);text('这次具体做什么？',985,388,78,{face:'serif',color:C.green});arrow([875,465],[960,465],ease(u/.9));
  text('权限范围',90,820,49,{color:C.muted});text('动作条款',1320,820,49,{color:C.green});
  credit='账户登录画面来自 Sierra Summit；右侧提出动作确认的下一层问题';
 }else if(i===13||i===14||i===15){
  label='可选扩展 / operations';const start=S(13);
  text('每次确认，对准具体条款',85,190,70,{face:'serif'});tag('可选扩展',1580,186,{bg:C.green,size:24});
  const focusRect=i===15?focus.once:focus.approval;
  evidence('ops-intro.png',[995,270,845,300],[0,.375,1,.355],{focus:[focusRect],dim:.70,marks:[{r:focusRect,p:ease(u/.8),color:'#a34229'}]});
  const zoom=i===15?[.046,.649,.159,.055]:[.046,.397,.358,.059];
  evidence('ops-intro.png',[995,610,845,155],zoom);
  text(i===15?'同一动作，至多执行一次':'批准覆盖具体条款',1000,845,38,{face:'serif',color:C.paper});
  if(i<=14){
   text('批准',90,350,46,{color:C.muted});text('v1',265,405,135,{face:'number',color:C.green});text('执行',650,350,46,{color:C.muted});text('v1',785,405,135,{face:'number',color:C.green});arrow([470,366],[620,366],ease(P(t,start,start+1.1)),C.green,4);
   if(i===14){const rp=ease((u-.35)/.7);g.save();g.globalAlpha=rp;text('条款变更',90,575,42,{color:C.red});text('v2',335,620,110,{face:'number',color:C.red});line([550,579],[900,579],1,C.red,3);line([710,548],[755,605],1,C.red,5);line([755,548],[710,605],1,C.red,5);text('须有覆盖新版本的批准',90,742,39);g.restore();}
  }else{
   text('同一动作 ID',90,330,43,{color:C.green});text('重试',90,470,65);arrow([285,445],[530,445],ease(u/.7));text('1',620,550,240,{face:'number',color:C.green});text('至多执行一次',90,760,59,{face:'serif'});
   if(u>.6){line([300,510],[520,510],ease((u-.6)/.8),C.muted,2);line([520,510],[520,570],ease((u-1)/.4),C.muted,2);line([520,570],[300,570],ease((u-1.2)/.5),C.muted,2);}
  }
  credit='Poppy operations 扩展原文 · 条款版本与动作 ID 的机制示意，非产品界面';
 }else if(i===16){
  text('两层许可，分别看',85,190,79,{face:'serif'});
  evidence('summit-login.jpg',[80,300,830,400],[.548,.502,.33,.148]);
  evidence('ops-intro.png',[1000,300,840,400],[.012,.39,.98,.13],{marks:[{r:focus.approval,p:ease(u/.8),color:'#a34229'}]});
  text('访问账户',90,830,62);text('确认具体动作',1015,830,62,{color:C.green});line([930,280],[930,860],1,'#56615b',2);
  credit='左：峰会账户授权画面；右：可选扩展条款原文 · 两者含义分别呈现';
 }else if(i===17){
  full(t,{focus:[focus.linkButton],dim:.83});veil('left',.94);
  image(media(t),[1055,360,760,430],{crop:[.55,.466,.23,.168],focus:[focus.linkButton],dim:.58,marks:[{r:focus.linkButton,p:ease(u/.6),color:'#7bf096',width:4}]});
  text('规则之外，还有一个问题',85,245,30,{color:C.green});heading('谁能证明','人真的同意？',400,C.paper,'serif');
  credit='Sierra Summit 允许连接的真实按钮 · 下面讨论的是确认凭据的证明边界';
 }else if(i===18){
  label='安全讨论 / 人的确认';
  evidence('x-post-2109096066746380721.png',[785,200,1045,690],[0,0,1,1],{focus:[[.018,.174,.958,.14]],dim:.63,marks:[{r:[.018,.174,.958,.14],p:ease(u/.75),color:'#bf4c30'}]});
  text('人的确认',85,350,86,{face:'serif'});text('如何证明？',85,470,86,{face:'serif',color:C.green});wrap('原帖提出的要求，仍需要具体实现来回答。',90,680,590,35,{color:C.muted});
  credit='Dino A. Dai Zovi 10 月 11 日原帖 · 观点讨论，并非已验证的协议漏洞';
 }else if(i===19||i===20){
  label='官方文档写出的边界';
  const r=[.018,.552,.96,.075],k=ease(P(t,S(19),S(19)+1.1));
  evidence('ops-trust.png',[90,210,1740,350],mix([0,.40,1,.5],[.018,.55,.64,.077],k),{focus:[r],dim:.65,marks:[{r,p:1,color:'#a83c28'}]});
  text('代理声称：',90,690,42,{color:C.muted});text('“用户已批准”',365,690,72,{face:'serif'});
  if(i===20){const a=ease(u/.65);line([1020,663],[1220,663],a,C.red,4);line([1090,635],[1145,690],a,C.red,5);line([1145,635],[1090,690],a,C.red,5);g.save();g.globalAlpha=a;text('用户确实同意',1270,690,63,{face:'serif',color:C.red});text('记录确认 ≠ 证明人的同意',90,855,69,{face:'serif',color:C.paper});g.restore();}
  credit='Poppy operations §8 原文：确认不能证明用户看过或同意条款';
 }else if(i===21){
  label='需要更强证明时';
  evidence('ops-trust.png',[80,210,1110,660],[0,.50,1,.5],{focus:[[.015,.72,.97,.25]],dim:.7});
  text('回到',1275,370,78,{face:'serif'});text('企业自己的网站',1275,470,49,{color:C.green});text('由用户批准',1275,570,64,{face:'serif'});arrow([900,825],[1780,825],ease(u/1.2),C.green,4);
  credit='Poppy operations §8 · 企业可以要求用户在自己的网站登录批准；该步骤不由此扩展定义';
 }else if(i===22||i===23){
  full(t,{focus:i===22?[focus.pdf]:undefined,dim:.62});veil('left',.93);
  if(i===22){image(media(t),[830,185,1000,685],{crop:[.535,.36,.25,.3],marks:[{r:focus.pdf,p:ease(u/.85),color:'#922b22',width:4}]});text('演示的结果',85,315,37,{color:C.green});heading('出现了','预批信',450,C.paper,'serif');}
  else{text('演示结果',85,285,37,{color:C.green});heading('预批信','≠ 贷款已发放',430,C.paper,'serif');line([90,610],[860,610],ease(u/.9),C.red,5);}
  credit='Sierra Summit 原片 02:58–03:02 · 公开演示中的预批信，不代表真实放贷';
 }else if(i===24||i===25){
  full(t,{shade:.82});
  evidence('architecture.webp',[850,180,990,685],[.23,.15,.54,.704]);
  if(i===24){heading('认出代理','按授权办事',350);line([90,600],[720,600],ease(u/.9),C.green,5);}
  else{heading('企业接入','权限实际执行',350,C.green);text('草案 → 实现 → 实际效果',90,780,37,{color:C.paper});}
  credit='Sierra 官方机制图与峰会现场 · 草案设计与实际部署、实际效果分别判断';
 }else{
  full(t,{shade:.88});label='下一次，留意这三处';
  text('看到结果之前，先看授权',85,190,79,{face:'serif'});
  const plateY=320,plateH=320, xs=[85,690,1295],w=540;
  const n=i===26?-1:Math.min(2,Math.floor(P(t,S(27),cues[27].voiceEnd)*3.1));
  const pics=[['summit-login.jpg',[.548,.502,.33,.148]],['ops-intro.png',[.012,.39,.98,.13]],['summit-result.jpg',[.55,.455,.13,.165]]];
  for(let j=0;j<3;j++){const dim=n>=0&&j!==n?.67:0;const box=[xs[j],plateY,w,plateH];evidence(pics[j][0],box,pics[j][1],{shade:dim});text('0'+(j+1),xs[j],275,58,{face:'number',color:j===n?C.green:C.muted});text(['访问范围','批准的动作','实际结果'][j],xs[j],755,52,{color:j===n?C.green:C.paper});if(j===n)strokeRect([xs[j]-8,plateY-8,w+16,plateH+16],ease(P(t,S(27)+j*(cues[27].voiceEnd-S(27))/3,S(27)+(j+.3)*(cues[27].voiceEnd-S(27))/3)),C.green,4);if(j<2)arrow([xs[j]+w+10,485],[xs[j+1]-15,485],i===26?ease((u-j*.6)/.7):1,C.green,3);}
  credit='左、右：峰会画面局部定格；中：动作确认规范 · 三处信息分别核对';
 }
 meta(label);footer(cues[i],t,credit,keywords[i]);
}
let current=0,origin=0,playing=true,audioDriven=false,started=false,lastSync=0,active=-1;
function clock(){return audioDriven&&!voice.paused?voice.currentTime:current+(playing?(performance.now()-origin)/1000:0)}
async function syncMedia(t,force=false){const z=shotFor(t);for(let n=0;n<2;n++)if(!z||videos[n]!==z.v)videos[n].pause();if(!z){active=-1;return;}const v=z.v;
 if(force||active!==z.index||Math.abs(v.currentTime-z.time)>.28){if(force){await new Promise(r=>{if(Math.abs(v.currentTime-z.time)<.025){r();return;}v.addEventListener('seeked',r,{once:true});v.currentTime=z.time;});}else v.currentTime=z.time;}
 v.playbackRate=clamp(z.rate,.25,3);if(playing)v.play().catch(()=>{});else v.pause();active=z.index;
 const next=segments[z.index+1];if(next&&S(next.cue)-t<1.0&&S(next.cue)>t){const other=videos[(z.index+1)%2];if(Math.abs(other.currentTime-next.in)>.1&&!other.seeking)other.currentTime=next.in;}
}
function setTime(t){current=clamp(t,0,120);origin=performance.now();if(audioDriven)voice.currentTime=current;syncMedia(current);draw(current)}
window.seek=async t=>{playing=false;voice.pause();audioDriven=false;current=clamp(t,0,120);origin=performance.now();await syncMedia(current,true);draw(current);document.getElementById('pause').textContent='播放';return current;};
window.renderAt=t=>{draw(t);return indexAt(t)};
async function enableSound(){current=clamp(clock(),0,119.99);origin=performance.now();voice.currentTime=current;voice.muted=false;try{await voice.play();audioDriven=true;playing=true;document.getElementById('sound').textContent='旁白已开启';document.getElementById('pause').textContent='暂停';}catch{document.getElementById('sound').textContent='点击开启旁白';}}
function tick(now){if(started){const t=clamp(clock(),0,120);if(t>=120){current=120;playing=false;voice.pause();videos.forEach(v=>v.pause());document.getElementById('pause').textContent='播放';}draw(t);if(now-lastSync>180){syncMedia(t);lastSync=now;document.getElementById('seek').value=t;}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
document.getElementById('sound').onclick=()=>{if(audioDriven&&!voice.muted){voice.muted=true;document.getElementById('sound').textContent='开启旁白';}else enableSound();};
document.getElementById('pause').onclick=()=>{if(playing){current=clamp(clock(),0,120);playing=false;voice.pause();videos.forEach(v=>v.pause());}else{if(current>=120)current=0;origin=performance.now();playing=true;if(audioDriven){voice.currentTime=current;voice.play().catch(()=>{audioDriven=false;});}syncMedia(current);}document.getElementById('pause').textContent=playing?'暂停':'播放';};
document.getElementById('replay').onclick=()=>{setTime(0);playing=true;if(audioDriven)voice.play().catch(()=>{audioDriven=false;});document.getElementById('pause').textContent='暂停';};
document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.getElementById('seek').oninput=e=>setTime(+e.target.value);
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();document.getElementById('pause').click();}if(e.code==='ArrowRight')setTime(clock()+5);if(e.code==='ArrowLeft')setTime(clock()-5);});
async function ready(){try{
 await Promise.all(imageNames.map(n=>new Promise((r,j)=>{const im=new Image();im.onload=()=>{imgs[n]=im;r();};im.onerror=()=>j(Error('素材无法载入：'+n));im.src='assets/'+n;})));
 await Promise.all([...videos,voice].map(v=>v.readyState>=2?Promise.resolve():new Promise((r,j)=>{v.addEventListener('loadeddata',r,{once:true});v.addEventListener('error',()=>j(Error('音视频无法载入')),{once:true});})));
 await Promise.all([document.fonts.load('850 80px "Film Sans"','权限'),document.fonts.load('700 80px "Film Serif"','授权'),document.fonts.load('700 80px "Film Numbers"','35')]);await document.fonts.ready;
 document.getElementById('status').remove();origin=performance.now();started=true;await syncMedia(0,true);draw(0);
 if(new URLSearchParams(location.search).has('review'))await window.seek(0);else try{await voice.play();audioDriven=true;document.getElementById('sound').textContent='旁白已开启';}catch{document.getElementById('sound').textContent='点击开启旁白';}
 window.__READY=true;
}catch(e){document.getElementById('status').textContent=e.message;console.error(e);}}ready();
