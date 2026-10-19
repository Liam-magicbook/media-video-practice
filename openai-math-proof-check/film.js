/* AI 数学稿件 / Lean 检查边界 — canvas composition.
   Source coordinates are normalized; crop, mask and marks share one transform. */
'use strict';
const {clamp,lerp,ease,mix,C}=FilmCraft, K=FilmCraft.make(document.getElementById('film'));
const {g,rect,roundRect,text,wrap,line,arrow,tag,image,strokeRect,veil,footer,footerLight,wash,rule,clipTop}=K;
const cues=window.CUES, DUR=window.__DUR||107.5;
const S=i=>i===0?0:cues[i].start, E=i=>cues[i].end, P=(t,a,b)=>clamp((t-a)/(b-a));
const imgs={};
const imageNames=['readme.png','history.png','arxiv.png','tc-02.jpg','tc-03.jpg','tc-04.jpg','tc-05.jpg','x-openai.png','lean-sorry.jpg','smf-title.jpg','smf-timeline.jpg'];
const videos=[document.getElementById('lean'),document.getElementById('smf')],voice=document.getElementById('voice');
const snap=document.createElement('canvas');snap.width=1920;snap.height=780;const sg=snap.getContext('2d');
let lastIdx=-1,lastT=-9,fadeAllowed=true;

const OPENAI_X=[1210,190,596,614];
const focus={
  readmeLine:[.149,.825,.383,.017],
  arxivTitle:[.014,.121,.738,.058],
  arxivMismatch:[.025,.404,.780,.044],
  tcDiscrepancy:[.156,.763,.451,.082],
  tcSelfFormalize:[.338,.792,.232,.022],
  tcTao:[.156,.687,.455,.112],
  tcAgmai:[.196,.629,.412,.047],
  tcCoT:[.157,.418,.450,.045],
  histSign:[.253,.666,.64,.062],
  histDate:[.253,.555,.22,.085],
  leanSorry:[.100,.270,.049,.032],
  leanGoal:[.710,.128,.240,.045]
};

const keywords=['数学稿件','719 篇','42%','数学成立','翻译成 Lean','陈述和推导','那句话','形式系统','sorry','已经检查完','三位数学家','不保证','并不对应','不裁定','不必然推翻','不能只靠模型','答不了','数学共同体','公开讲座','还在动','300/719','符号错误','10 篇','合法推导','同行复核','三处','有没有接手'];

const segments=[
  {cue:7,last:9,in:27.2,out:31.6,v:0},
  {cue:18,last:18,in:56.0,out:60.0,v:1}
];
function which(t){return segments.findIndex(z=>t>=S(z.cue)&&t<E(z.last))}
function shotFor(t){const index=which(t);if(index<0)return null;const z=segments[index],d=E(z.last)-S(z.cue);return {index,v:videos[z.v],time:lerp(z.in,z.out,P(t,S(z.cue),E(z.last))),rate:(z.out-z.in)/d};}
const QS=new URLSearchParams(location.search);
const STILL=QS.has('still');
const PREVIEW=QS.has('review')||QS.has('shot')||QS.has('still')||QS.has('embed');
const CLEAN=QS.has('clean');
let CUR_I=0;
const CHAPTERS=[[0,3],[4,9],[10,22],[23,26]];
const chapterOf=i=>{let c=0;CHAPTERS.forEach(([a,b],k)=>{if(i>=a&&i<=b)c=k});return c};
const tc=t=>{const m=Math.floor(t/60),s=t-m*60;return `${String(m).padStart(2,'0')}:${s.toFixed(1).padStart(4,'0')}`};
const media=t=>{const z=shotFor(t);if(!z)return null;return STILL?(z.v===videos[0]?imgs['lean-sorry.jpg']:imgs['smf-title.jpg']):z.v};
function indexAt(t){let i=0;while(i<cues.length-1&&t>=S(i+1))i++;return i;}
function phase(t,a,d){return ease(clamp((t-a)/Math.max(.001,d)))}

function meta(label){
  const z=g.createLinearGradient(0,0,0,140);z.addColorStop(0,'#050a0bf2');z.addColorStop(.55,'#050a0bf2');z.addColorStop(1,'#050a0b00');rect(0,0,1920,140,z);
  rect(80,40,15,15,C.green);text('科技观察',112,60,24,{weight:700});
  text('OPENAI MATH / LEAN 边界',288,60,21,{color:C.muted});
  text(`0${chapterOf(CUR_I)+1} / 04`,1556,60,19,{align:'right',face:'number',color:C.muted});
  text(label,1840,60,23,{align:'right',color:C.paper});
}
function metaLight(label){
  rect(0,0,1920,110,C.paper);
  rect(80,40,15,15,C.red);text('科技观察',112,60,24,{weight:700,color:C.ink});
  text('OPENAI MATH / LEAN 边界',288,60,21,{color:'#6d746f'});
  text(`0${chapterOf(CUR_I)+1} / 04`,1556,60,19,{align:'right',face:'number',color:'#8b908a'});
  text(label,1840,60,23,{align:'right',color:'#3c423e'});
  rect(80,108,1760,2,'#d8d2c2');
}
function sourceLabel(s,x,y,color=C.muted,size=20){text(s,x,y,size,{color,face:'number',weight:500});}
function panel(box,label,opts={}){
  const [x,y,w,h]=box;
  rect(x-2,y-2,w+4,h+4,opts.border||'#333d3a');
  return image(opts.media,box,opts.imageOpts||{});
}
function bigNum(v,x,y,size,color,face='number'){text(v,x,y,size,{face,color,weight:600});}
function dash(a,b,p=1,color=C.red,width=3,dash=[12,10]){
  p=clamp(p);if(p<=0)return;
  const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),u=[dx/len,dy/len];
  let d=0;g.strokeStyle=color;g.lineWidth=width;g.beginPath();
  while(d<len*p){const e=Math.min(len*p,d+dash[0]);g.globalAlpha=1;g.moveTo(a[0]+u[0]*d,a[1]+u[1]*d);g.lineTo(a[0]+u[0]*e,a[1]+u[1]*e);d=e+dash[1]}
  g.stroke();g.globalAlpha=1;
}
function pushCrop(c,t,a,b,amt=.03,pan=[0,0]){
  const p=ease(clamp((t-a)/Math.max(.001,b-a)));
  const w=c[2]*(1-amt*p),h=c[3]*(1-amt*p);
  const cx=c[0]+c[2]/2+pan[0]*p,cy=c[1]+c[3]/2+pan[1]*p;
  return [cx-w/2,cy-h/2,w,h];
}
let DOTCAN=null;
function dotGrid(alpha=.045){
  if(!DOTCAN){DOTCAN=document.createElement('canvas');DOTCAN.width=1920;DOTCAN.height=1080;const d=DOTCAN.getContext('2d');d.fillStyle='#161b19';for(let y=22;y<1080;y+=44)for(let x=22;x<1920;x+=44){d.beginPath();d.arc(x,y,1.5,0,6.2832);d.fill();}}
  g.save();g.globalAlpha=alpha;g.drawImage(DOTCAN,0,0);g.restore();
}
function vignette(a=.30){const gr=g.createRadialGradient(960,520,430,960,520,1150);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,`rgba(0,0,0,${a})`);rect(0,0,1920,1080,gr);}
function fadeWash(x,y,w,h,alpha=.05){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,`rgba(255,255,255,${alpha})`);gr.addColorStop(.7,`rgba(255,255,255,${alpha*.4})`);gr.addColorStop(1,'rgba(255,255,255,0)');rect(x,y,w,h,gr);}
function circleArrow(cx,cy,r,p,color){
  if(p<=0)return;const a0=-Math.PI*.75,a1=a0+Math.PI*1.6*clamp(p);
  g.strokeStyle=color;g.lineWidth=4;g.beginPath();g.arc(cx,cy,r,a0,a1);g.stroke();
  if(p>.9){const x=cx+r*Math.cos(a1),y=cy+r*Math.sin(a1);const t=a1+Math.PI/2;line([x,y],[x-16*Math.cos(t-.5),y-16*Math.sin(t-.5)],1,color,4);line([x,y],[x-16*Math.cos(t+.5),y-16*Math.sin(t+.5)],1,color,4)}
}

function draw(t){
  t=clamp(t,0,DUR);const i=indexAt(t),u=t-S(i),q=ease(P(t,S(i),E(i)));CUR_I=i;
  if(i!==lastIdx){if(lastIdx>=0&&fadeAllowed){sg.clearRect(0,0,1920,780);sg.drawImage(g.canvas,0,110,1920,780,0,0,1920,780);lastT=t;}lastIdx=i;}
  rect(0,0,1920,1080,C.bg);
  let credit='来源：OpenAI / GitHub / arXiv / TechCrunch / X',label='AI 的数学稿，Lean 检查了什么？';

  /* ---------- 0. 发布规模 ---------- */
  if(i<=2){
    image(imgs['readme.png'],[0,0,1920,1080],{cover:true,shade:.90,crop:pushCrop([0,0,1,1],t,S(0),E(2),.02,[0,.004])});
    rect(0,0,1920,1080,'rgba(9,13,14,.55)');
    rect(0,0,1010,1080,'rgba(9,13,14,.35)');
    veil('left',.96);
    label=i===2?'发布 / 42% 形式化':i===1?'发布 / 仓库口径':'发布 / 719 篇';
    text('2026.10.06  /  OPENAI · MATH',92,232,23,{face:'number',color:C.green,weight:600});

    const out=ease(P(t,S(1),S(1)+.55));
    if(i===0||out<1){
      g.save();g.globalAlpha=i===0?1:(1-out);
      text('一次公开',92,352,58);
      text('七百多篇',92,478,96);
      text('数学稿件',92,596,96);
      g.restore();
    }
    const inn=i>=1?ease(P(t,S(1)+.18,S(1)+.92)):0;
    if(inn>0){
      g.save();g.globalAlpha=inn;
      text('一次公开',92,334,40,{color:C.muted});
      bigNum('719',88,500,150,C.white);
      text('篇稿件',382,500,44);
      bigNum('372',88,626,86,C.green);
      text('个结果族',270,626,38);
      g.restore();
    }
    if(i===2){
      const q42=ease(P(t,S(2),S(2)+.8));
      g.save();g.globalAlpha=q42;
      const pct=Math.round(42*ease(P(t,S(2)+.1,S(2)+.95)));bigNum(pct+'%',88,742,96,C.green);
      text('top-line 结果附 Lean 形式化',372,742,28,{color:C.paper});
      rect(90,790,620,10,'#2a3330');
      rect(90,790,620*(pct/100),10,C.green);
      text('已形式化',90,832,21,{color:C.green});
      text('其余 58% 未附',90,862,21,{color:C.muted});
      g.restore();
      credit='README：约 42% top-line results 附 Lean formalization（采集于 10 月 12 日）';
    }else if(i===1)credit='GitHub openai/math · README 当前目录（采集于 2026-10-12）';

    const xOut=i===0?1:1-ease(P(t,S(1),S(1)+.6));
    if(xOut>0){
      g.save();g.globalAlpha=xOut;
      const y=OPENAI_X[1]-22*(1-xOut);
      rect(OPENAI_X[0]+12,y+16,OPENAI_X[2],OPENAI_X[3],'#00000066');
      image(imgs['x-openai.png'],[OPENAI_X[0],y,OPENAI_X[2],OPENAI_X[3]],{});
      strokeRect([OPENAI_X[0],y,OPENAI_X[2],OPENAI_X[3]],1,'#59645f',1);
      sourceLabel('X / @OpenAI · 10 月 7 日',OPENAI_X[0],y+OPENAI_X[3]+38,C.muted);
      g.restore();
      if(i===0)credit='X / @OpenAI 官方帖文 · 背景为 GitHub openai/math README';
    }
    if(i>=1){
      const pin=ease(P(t,S(1)+.12,S(1)+.95));
      const box=[566,168,1284,520];
      g.save();g.globalAlpha=pin;
      const dy=26*(1-pin);
      rect(box[0]+10,box[1]+dy+14,box[2],box[3],'rgba(0,0,0,.5)');
      rect(box[0]-1,box[1]+dy-1,box[2]+2,box[3]+2,'#3b4642');
      image(imgs['readme.png'],[box[0],box[1]+dy,box[2],box[3]],{crop:pushCrop([.095,.455,.785,.515],t,S(1),E(2),.035,[0,-.003]),shade:.03,marks:[{r:focus.readmeLine,fill:true,p:1,color:'#f6e52b'},{r:focus.readmeLine,p:ease((t-S(1)-.55)/.8),color:'#b43522',width:4}]});
      sourceLabel('GitHub / openai/math / README.md',box[0],box[1]+dy-18,C.muted,19);
      g.restore();
    }
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 1. 核心问题 ---------- */
  }else if(i===3){
    rect(0,0,1920,1080,C.paper);dotGrid(.045);metaLight('问题 / 检查边界');
    rect(80,236,7,560,C.red);
    text('THE QUESTION / 2026.10',124,300,22,{face:'number',color:C.red,weight:600});
    text('Lean 通过',124,436,112,{weight:800,color:C.ink});
    const eq=p=>{text('=',700,436,140,{face:'serif',color:'#242a26'});if(p>0){const a=clamp(p);line([660,500],[760,380],a,C.red,10)}};
    eq(ease((u-.55)/.6));
    text('数学成立？',872,436,112,{weight:800,color:C.ink});
    text('机器检查的是推导；数学成立还要看命题本身。',124,620,40,{face:'serif',color:'#3d443f'});
    line([124,668],[980,668],ease(u/1.4),'#b9b3a4',3);
    text('推导合法',124,760,30,{color:'#6d746f'});
    text('≠',640,770,60,{face:'serif',color:C.red});
    text('数学为真',760,760,30,{color:'#6d746f'});
    text('2026 / LEAN 边界',124,930,22,{face:'number',color:'#8b908a'});
    credit='本片问题设定；以下逐层区分发布、形式化、编译检查与同行复核';
    footerLight(cues[i],t,credit,keywords[i]);

  /* ---------- 2. 翻译链 ---------- */
  }else if(i>=4&&i<=6){
    label=i===4?'机制 / 翻译链':i===5?'机制 / 检查器':'机制 / 语义缺口';
    text('被折叠的一步',92,196,58,{weight:800});
    text('自然语言  →  形式化  →  编译检查',92,246,24,{face:'number',color:C.muted});
    const cols=[[120,540],[710,540],[1300,500]];
    const accents=[C.paper,C.amber,C.green];
    const titles=['论文','Lean 代码','编译器'];
    const details=['自然语言陈述','形式化后的命题','检查推导是否闭合'];
    for(let n=0;n<3;n++){
      if(i===4&&n===2)continue;
      const p=n<2?phase(t,S(4)+(n===0?.05:.65),.7):phase(t,S(5)+.05,.9);
      if(p<=0)continue;
      const [x,w]=cols[n],top=300,accent=accents[n];
      const dim=(i===6&&n>=1)?.36:1;
      const drawCol=()=>{
        g.save();g.globalAlpha=(n===2?dim:p*dim);
        fadeWash(x-14,top,w+28,430,.045);
        rule([x,top],[x+w,top],accent,n===2?3:2,.9);
        text('0'+(n+1),x,278,19,{face:'number',color:accent,weight:600});
        text(titles[n],x,372,42,{weight:700,color:C.paper});
        text(details[n],x,414,23,{color:C.muted});
        if(n===0){
          for(let k=0;k<4;k++)rule([x,478+k*30],[x+w-90-k*26,478+k*30],'#4d5854',4,.7);
          text('原话的含义，不在编译器里。',x,620,22,{face:'serif',color:'#9aa39f'});
        }
        if(n===1){
          text('theorem foo : P := by',x,484,21,{face:'number',color:'#d7ded9'});
          text('  exact h',x,518,21,{face:'number',color:C.green});
          text('  -- 只在这里成立',x,556,19,{face:'number',color:C.muted});
        }
        if(n===2){
          text('✓',x,560,96,{face:'number',color:C.green});
          text('推导闭合',x+130,600,30,{color:C.paper});
          text('不管这句话原本想说什么',x,650,21,{face:'serif',color:C.muted});
        }
        g.restore();
      };
      if(n===2)clipTop(x,255,w,445,p,drawCol);else drawCol();
      if(n===1){const a=phase(t,S(4)+1.1,.6);arrow([632,428],[700,428],a,C.amber,2);}
      if(n===2){const a=phase(t,S(5)+.2,.6);arrow([1248,428],[1294,428],a,C.green,2);}
    }
    if(i===6){
      const p=ease((u-.15)/.9);
      g.save();g.globalAlpha=p;
      rule([710,748],[1810,748],C.red,2,.95);
      rule([710,742],[710,754],C.red,2,1);rule([1810,742],[1810,754],C.red,2,1);
      text('这里只保证内部一致',732,726,24,{color:'#ff9b84'});
      text('原话的含义',130,726,24,{color:C.amber});
      dash([636,718],[704,718],p,'#b43522',3);
      text('翻译 ≠ 等价',500,660,32,{face:'serif',color:'#ff9b84'});
      g.restore();
    }
    if(i===4)credit='机制示意：自然语言论文 → Lean 形式化 → 编译检查；不是 OpenAI 的实际流水线';
    else if(i===5)credit='机制示意：检查器只处理写入形式系统的陈述与推导';
    else credit='机制示意：语义对应不在编译器的检查范围内';
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 3. Lean 画面 ---------- */
  }else if(i>=7&&i<=9){
    label=i===7?'Lean / 编译通过':i===8?'Lean / sorry':'Lean / 未完成';
    const box=[86,196,1180,664];
    rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
    const im=image(media(t),box,{focus:i>=8?[focus.leanSorry]:[],dim:i>=8?.18:.04,marks:[
      {r:focus.leanSorry,fill:true,p:i>=8?.8:0,color:'#f2c14e'},
      {r:focus.leanSorry,p:i>=8?ease((u-.15)/.7):0,color:'#ff4a2f',width:4},
      {r:focus.leanGoal,p:i===9?ease((u-.4)/.8):0,color:'#7fe3a8',width:4}
    ]});
    sourceLabel('Lean 4 / Xena Project 教学演示 · 非 OpenAI 材料',90,168,C.muted,19);
    text('TEACHING DEMO',1280,168,18,{face:'number',color:C.amber,weight:600});
    text(i===7?'编译通过':i===8?'一个占位符':'目标栏说完成',1318,240,58,{weight:800});
    if(i===7){
      text('= 形式系统里走通了',1318,320,34,{color:C.green});
      text('≠ 数学命题成立',1318,374,34,{color:C.muted});
      wrap('编译器只认写进文件里的符号；它不读论文，也不判断这句话是否值得证明。',1320,470,510,27,{color:C.paper});
      credit='Lean 4 教学演示（Xena Project）· 非 OpenAI 材料，仅说明检查机制';
    }else if(i===8){
      const p=ease((u-.15)/.7);
      g.save();g.globalAlpha=p;
      rect(1318,312,520,190,'#171f1f');strokeRect([1318,312,520,190],1,'#b43522',3);
      text('sorry',1348,404,72,{face:'number',color:'#ff9b84',weight:600});
      text('先跳过没写完的证明',1348,462,27,{color:C.paper});
      g.restore();
      text('Lean 仍会接受这段代码，只给警告。',1318,560,27,{color:C.muted});
      credit='教学演示中的 `sorry` 占位；本片用它说明机制，不指代 OpenAI 的稿件';
    }else{
      const p=ease((u-.35)/.8);
      g.save();g.globalAlpha=p;
      rect(1318,300,530,240,'#101718');strokeRect([1318,300,530,240],1,C.green,3);
      image(media(t),[1322,304,522,232],{crop:[.690,.055,.300,.200]});
      text('goals accomplished',1338,584,26,{face:'number',color:C.green});
      g.restore();
      text('但代码第 7 行，仍是 sorry。',1318,650,30,{color:'#ff9b84'});
      credit='同一教学演示：目标栏显示完成，证明里仍有 `sorry` 占位';
    }
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 4. arXiv 论文 ---------- */
  }else if(i>=10&&i<=13){
    label=i===10?'同日论文 / arXiv':i===11?'论文 / 标题':i===12?'论文 / 摘要':'论文 / 边界';
    image(imgs['arxiv.png'],[0,0,1920,1080],{cover:true,shade:i===10?.9:i===11?.7:.94,crop:pushCrop([0,0,1,1],t,S(10),E(13),.015)});
    veil('left',i===10?.98:.94);
    if(i===10){
      rect(0,0,980,1080,'rgba(9,14,15,.72)');
      text('同一天',92,330,58,{color:C.green});
      text('另一篇论文',92,448,92);
      text('arXiv:2610.08144  ·  2026-10-06',92,520,25,{face:'number',color:C.muted});
      text('Bastounis / Circelli / Hansen',92,568,28,{color:C.paper});
      const sl=ease(clamp((u-.05)/.7));const strip=[92,650+28*(1-sl),1736,160];
      rect(strip[0]-2,strip[1]-2,strip[2]+4,strip[3]+4,'#39423f');
      image(imgs['arxiv.png'],strip,{crop:pushCrop([.004,.108,.80,.090],t,S(10),E(10),.03),shade:.04,marks:[{r:focus.arxivTitle,p:ease((u-.5)/.9),color:'#b43522',width:4}]});
      sourceLabel('arXiv 摘要页 · 原题',96,626+28*(1-sl),C.muted,19);
      credit='arXiv:2610.08144 · Bastounis / Circelli / Hansen · 2026-10-06';
    }else if(i===11){
      text('Navier–Stokes',92,318,74,{face:'serif'});
      text('lost in translation',92,404,74,{face:'serif',color:C.green});
      text('Lean 验证，不保证自然语言证明正确。',92,506,40,{face:'serif',color:C.paper});
      text('论文标题 · 原文',92,246,22,{face:'number',color:C.amber,weight:600});
      const sl=ease(clamp((u-.05)/.7));const strip=[90,742+30*(1-sl),1742,190];
      rect(strip[0]-2,strip[1]-2,strip[2]+4,strip[3]+4,'#39423f');
      image(imgs['arxiv.png'],strip,{crop:pushCrop([.004,.108,.80,.090],t,S(11),E(11),.03),shade:.04,marks:[{r:focus.arxivTitle,p:ease((u-.3)/.9),color:'#b43522',width:4}]});
      sourceLabel('arXiv 摘要页 · 原题',94,716+30*(1-sl),C.muted,19);
      credit='arXiv 摘要页原文标题与作者；左侧为中文释义';
    }else if(i===12){
      text('论文摘要',92,176,24,{face:'number',color:C.amber,weight:600});
      const by=200+(i===12?26*(1-ease(clamp((u-.05)/.7))):0);const box=[92,by,1710,380];
      rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
      image(imgs['arxiv.png'],box,{crop:pushCrop([.006,.220,.79,.260],t,S(12),E(13),.022),shade:.02,marks:[{r:focus.arxivMismatch,fill:true,p:1,color:'#f6e52b'},{r:focus.arxivMismatch,p:ease((u-.5)/.9),color:'#b43522',width:4}]});
      text('论文指出：形式化证明，与原自然语言证明并不对应。',96,700,42,{face:'serif'});
      credit='arXiv 摘要原文 · 论文分析的是 OpenAI 2026 年 9 月 Navier–Stokes 材料';
    }else{
      text('论文摘要',92,176,24,{face:'number',color:C.amber,weight:600});
      const by=200+(i===12?26*(1-ease(clamp((u-.05)/.7))):0);const box=[92,by,1710,380];
      rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
      image(imgs['arxiv.png'],box,{crop:pushCrop([.006,.220,.79,.260],t,S(12),E(13),.022),shade:.12,marks:[{r:focus.arxivMismatch,fill:true,p:1,color:'#f6e52b'},{r:focus.arxivMismatch,p:1,color:'#b43522',width:4}]});
      g.save();g.translate(1450,790);g.rotate(-.05);
      rect(-220,-54,440,108,'#f3f0e6');strokeRect([-220,-54,440,108],1,C.red,6);
      text('不裁定原证明',0,14,44,{face:'serif',color:'#a52f1e',align:'center'});
      g.restore();
      text('论文只指出翻译环节的风险；不据此判定原证明本身。',92,700,34,{face:'serif',color:C.paper});
      credit='论文自述范围：指出翻译风险，不裁定原证明本身';
    }
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 5. TechCrunch 差异 ---------- */
  }else if(i===14||i===15){
    label=i===14?'独立报道 / TechCrunch':'独立报道 / 自我形式化';
    image(imgs['tc-05.jpg'],[0,0,1920,1080],{cover:true,shade:.96,crop:pushCrop([0,0,1,1],t,S(14),E(15),.015)});
    rect(0,0,1920,1080,'rgba(9,14,15,.80)');
    const box=[86,255,1230,325];
    rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
    image(imgs['tc-05.jpg'],box,{crop:pushCrop([.13,.63,.505,.22],t,S(14),E(15),.03,[.002,.002]),shade:.02,marks:[
      {r:focus.tcDiscrepancy,p:i===14?ease((u-.25)/.9):1,color:'#b43522',width:4},
      {r:focus.tcSelfFormalize,fill:true,p:i===15?ease((u-.2)/.8):0,color:'#f2c14e'},
      {r:focus.tcSelfFormalize,p:i===15?ease((u-.2)/.8):0,color:'#d99a12',width:5}
    ]});
    sourceLabel('TechCrunch · 2026-10-08',90,228,C.muted,19);
    text('差异',1400,330,54,{color:C.muted});
    text('≠',1400,422,84,{face:'serif',color:C.red});
    text('推翻任一解法',1400,522,42,{color:C.paper});
    if(i===15){
      const p=ease((u-.15)/.8);g.save();g.globalAlpha=p;
      text('但',1400,660,40,{color:C.amber});
      text('不能只靠模型',1400,730,46,{face:'serif',color:C.amber});
      text('给自己的证明做形式化',1400,790,30,{color:C.paper});
      circleArrow(1700,762,48,p,C.amber);
      g.restore();
      credit='TechCrunch 原文：不能只靠模型给自己的解法做形式化';
    }else credit='TechCrunch · 2026-10-08 · 报道转述，非逐篇审计';
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 6. 数学界 ---------- */
  }else if(i===16||i===17){
    label=i===16?'数学界 / 陶哲轩':'数学界 / AGMAI';
    image(imgs[i===16?'tc-04.jpg':'tc-02.jpg'],[0,0,1920,1080],{cover:true,shade:.97,crop:pushCrop([0,0,1,1],t,S(16),E(17),.02)});
    rect(0,0,1920,1080,'rgba(9,14,15,.80)');
    const ev=[860,250,980,330];
    rect(ev[0]+9,ev[1]+11,ev[2],ev[3],'rgba(0,0,0,.45)');
    rect(ev[0]-1,ev[1]-1,ev[2]+2,ev[3]+2,'#3b4642');
    if(i===16){
      image(imgs['tc-04.jpg'],ev,{crop:pushCrop([.136,.60,.49,.26],t,S(16),E(16),.025),shade:.02,marks:[{r:focus.tcTao,fill:true,p:1,color:'#f6e52b'},{r:focus.tcTao,p:ease((u-.2)/.8),color:'#b43522',width:4}]});
      sourceLabel('TechCrunch 转述 · 陶哲轩社媒发言',864,226,C.muted,19);
    }else{
      image(imgs['tc-02.jpg'],ev,{crop:pushCrop([.136,.52,.505,.25],t,S(17),E(17),.025),shade:.02,marks:[{r:focus.tcAgmai,fill:true,p:1,color:'#f6e52b'},{r:focus.tcAgmai,p:ease((u-.2)/.8),color:'#b43522',width:4}]});
      sourceLabel('TechCrunch 引述 · AGMAI 声明',864,226,C.muted,19);
    }
    const card=(x,y,w,h,p,active,title,l1,l2,note,color)=>{g.save();g.globalAlpha=p;if(active){fadeWash(x,y,w,h,.05);rule([x,y],[x+w,y],color,3,1);}else{rule([x,y],[x+w,y],'#39423f',1,.9);}text(title,x+2,y+46,21,{face:'number',color:active?color:C.muted,weight:600});text(l1,x+2,y+112,34,{face:'serif',color:active?C.paper:'#7f8984'});text(l2,x+2,y+158,34,{face:'serif',color:active?C.paper:'#7f8984'});text(note,x+2,y+h-18,17,{color:C.muted});g.restore();};
    if(i===16){
      card(80,260,720,250,phase(t,S(16),.5),true,'TERENCE TAO / 陶哲轩','解决一个目标就离开，','答不了同行的提问。','转述 · 个人观点，不代表数学界共识',C.amber);
    }else{
      card(80,250,720,230,1,false,'TERENCE TAO / 陶哲轩','解决一个目标就离开，','答不了同行的提问。','转述 · 个人观点',C.muted);
      card(80,540,720,250,phase(t,S(17),.55),true,'AGMAI / 顾问组','最终由数学共同体判断：','建议落实了多少。','九位研究者 · 2026 年 9 月发布指南',C.green);
    }
    credit=i===16?'TechCrunch 转述陶哲轩在社媒的批评 · 个人观点，不当作数学界共识':'AGMAI 声明 · TechCrunch 引述 · 九位研究者组成的顾问组';
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 7. SMF 讲座 ---------- */
  }else if(i===18){
    label='数学界 / 公开讲座';
    rect(0,0,1920,1080,'#0b1011');
    const box=[120,170,940,676];
    rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
    image(media(t),box,{crop:[.146,.13,.524,.67]});
    sourceLabel('SMF 公开讲座 · 2026',124,146,C.muted,19);
    const sp=[1180,262,520,285];
    rect(sp[0]-3,sp[1]-3,sp[2]+6,sp[3]+6,C.green);
    image(media(t),sp,{crop:[.688,.088,.312,.285]});
    text('Hugo Duminil-Copin',1180,610,28,{color:C.paper});
    text('SMF · 2026',1180,648,21,{face:'number',color:C.muted});
    text('讲座标题',1180,730,21,{face:'number',color:C.amber,weight:600});
    text('Un grave défaut d’alignement',1180,772,24,{face:'number',color:'#c9d2cd'});
    text('de l’IA en math',1180,806,24,{face:'number',color:'#c9d2cd'});
    text('“AI 在数学中的严重对齐缺陷”',1180,880,30,{face:'serif',color:C.green});
    credit='SMF 公开讲座（2026）· 画面为该讲座的幻灯片与参会者；不是 OpenAI 发布会';
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 8. 修订记录 ---------- */
  }else if(i>=19&&i<=22){
    if(i===22){
      label='核对 / 思维链';
      image(imgs['tc-03.jpg'],[0,0,1920,1080],{cover:true,shade:.96,crop:pushCrop([0,0,1,1],t,S(22),E(22),.02)});
      rect(0,0,1920,1080,'rgba(9,14,15,.82)');
      text('只有',92,196,26,{face:'number',color:C.amber,weight:600});
      bigNum('10',88,330,150,C.white);
      text('/ 719',300,330,58,{color:C.muted});
      text('篇稿件附了模型的思维链',92,400,38,{color:C.paper});
      const box=[86,540,1750,150];
      rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.42)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
      image(imgs['tc-03.jpg'],box,{crop:pushCrop([.145,.405,.50,.065],t,S(22),E(22),.035),shade:.02,marks:[{r:focus.tcCoT,fill:true,p:1,color:'#f6e52b'},{r:focus.tcCoT,p:ease((u-.3)/.8),color:'#b43522',width:4}]});
      sourceLabel('TechCrunch 核对 · 10 / 719',90,494,C.muted,19);
      credit='TechCrunch 核对：仅 10/719 稿件附模型思维链';
    }else{
      label=i===19?'修订 / history':i===20?'修订 / 10 月 7 日':'修订 / 撤回原因';
      image(imgs['history.png'],[0,0,1920,1080],{cover:true,shade:.96,crop:pushCrop([0,0,1,1],t,S(19),E(21),.018)});
      rect(0,0,1920,1080,'rgba(9,14,15,.82)');
      const box=[86,250,1090,440];
      rect(box[0]+9,box[1]+11,box[2],box[3],'rgba(0,0,0,.45)');
      rect(box[0]-1,box[1]-1,box[2]+2,box[3]+2,'#3b4642');
      const pan=i===19?0:ease(P(t,S(20),S(20)+1.0));
      const crop=pushCrop(mix([.24,.50,.68,.38],[.24,.56,.68,.32],pan),t,S(19),E(21),.022);
      const dateA=i===19?ease((u-.35)/.8):1-pan;
      const signA=i===19?0:ease((t-S(20)-.2)/.8);
      image(imgs['history.png'],box,{crop,shade:i>=21?.16:.02,marks:[
        {r:focus.histDate,fill:true,p:dateA,color:'#f6e52b'},{r:focus.histDate,p:dateA,color:'#b43522',width:4},
        {r:focus.histSign,fill:true,p:signA,color:'#f6e52b'},{r:focus.histSign,p:signA,color:'#b43522',width:4}
      ]});
      text(i===19?'修订记录':'10 月 7 日',88,190,50,{weight:800});
      if(i===19){
        text('结果还在动。',1210,340,38,{face:'serif',color:C.green});
        credit='GitHub openai/math · history.md · 2026-10-07';
      }else if(i===20){
        const xs=1210;const t0=S(20);
        const reveal=(at)=>ease(clamp((t-at)/.5));
        const items=[['3','篇撤回',C.red,.0],['14','篇修订',C.amber,1.25],['+6','个新形式化',C.green,2.5],['300/719','已形式化',C.green,3.4]];
        items.forEach(([v,l,col,off],k)=>{const p=reveal(t0+off);g.save();g.globalAlpha=p;text(v,xs,350+k*125,66,{face:'number',color:col,weight:600});text(l,xs+(k===3?330:200),350+k*125,25,{color:C.muted});g.restore()});
        credit='history.md：3 篇撤回、14 篇修订；新增 6 个形式化，300/719';
      }else{
        text('撤回原因',1210,340,36,{face:'serif',color:'#ff9b84'});
        text('符号错误',1210,404,46,{face:'serif',color:C.paper});
        g.save();g.translate(1440,560);g.rotate(-.06);
        rect(-180,-48,360,96,'#f3f0e6');strokeRect([-180,-48,360,96],1,C.red,5);
        text('NOT LEAN',0,10,36,{face:'number',color:'#a52f1e',align:'center'});
        g.restore();
        text('不是 Lean 未通过',1210,690,28,{color:C.paper});
        credit='history.md 写明撤回原因：sign error 及相关论证问题，不是 Lean 检查失败';
      }
    }
    footer(cues[i],t,credit,keywords[i]);

  /* ---------- 9. Lean 能保证什么 ---------- */
  }else if(i===23||i===24){
    rect(0,0,1920,1080,C.paper);dotGrid(.04);metaLight(i===23?'结论 / 能保证':'结论 / 不能保证');
    text('Lean 能保证什么？',92,190,58,{weight:800,color:C.ink});
    text('形式系统内，有一个合法推导。',92,244,28,{color:'#5d655f'});
    text('MECHANISM / 示意',92,318,19,{face:'number',color:'#7b817a',weight:600});
    rule([92,340],[872,340],'#b9b3a4',2,1);
    const rows=[['A  ⇒  B','给定'],['B  ⇒  C','给定'],['A  ⇒  C','推出']];
    rows.forEach((r,k)=>{
      const y=420+k*100;
      text(r[0],110,y,44,{face:'number',color:C.ink,weight:600});
      text(r[1],520,y,24,{color:'#7b817a'});
      rule([92,y+40],[872,y+40],'#d8d2c2',1,1);
      rule([92,y-42],[92,y+40],'#d8d2c2',1,1);
      rule([872,y-42],[872,y+40],'#d8d2c2',1,1);
    });
    const gp=ease((u-.4)/.9);
    g.save();g.globalAlpha=gp;
    text('✓',110,760,64,{face:'number',color:'#1c7a4b'});
    text('合法推导',200,752,28,{color:'#1c7a4b'});
    text('只在这个形式系统里',200,786,20,{color:'#7b817a'});
    g.restore();
    text('检查范围',1000,318,19,{face:'number',color:'#7b817a',weight:600});
    rule([1000,340],[1828,340],'#b9b3a4',2,1);
    const items=['忠实表达原问题','结果新颖、重要','已被同行复核'];
    items.forEach((s2,k)=>{
      if(i===23){
        g.save();g.globalAlpha=.16;
        text('×',1010,470+k*120,54,{face:'number',color:C.red});
        text(s2,1090,452+k*120,38,{color:C.ink});
        text('Lean 不检查',1090,486+k*120,20,{color:'#8b908a'});
        rule([1000,520+k*120],[1828,520+k*120],'#d8d2c2',1,1);
        g.restore();
        return;
      }
      const at=S(24)+k*1.15,p=ease((t-at)/.5);
      g.save();g.globalAlpha=p;
      text('×',1010,470+k*120,54,{face:'number',color:C.red});
      text(s2,1090,452+k*120,38,{color:p>.9?C.ink:'#8b908a'});
      text('Lean 不检查',1090,486+k*120,20,{color:'#8b908a'});
      rule([1000,520+k*120],[1828,520+k*120],'#d8d2c2',1,1);
      g.restore();
    });
    credit=i===23?'机制示意：形式系统内的合法推导':'本片结论；三项均不在 Lean 编译检查范围内';
    footerLight(cues[i],t,credit,keywords[i]);

  /* ---------- 10. 三处 ---------- */
  }else{
    rect(0,0,1920,1080,'#0b1011');
    image(imgs['smf-title.jpg'],[0,0,1920,1080],{cover:true,shade:.96,crop:pushCrop([0,0,1,1],t,S(25),E(26),.02)});
    rect(0,0,1920,1080,'rgba(8,12,13,.58)');
    label='收束 / 三处';
    text('下次看到',92,190,40,{color:C.muted});
    text('“AI 证明了数学难题”',92,270,64);
    text('先看三处',92,360,78,{color:C.green});
    const cards=[
      {x:88,title:'它形式化了哪句话',tag:'01 / 语义',img:'arxiv.png',crop:[.012,.06,.78,.34]},
      {x:688,title:'Lean 真的检查了什么',tag:'02 / 检查',img:'lean-sorry.jpg',crop:[.0,.05,.72,.90]},
      {x:1288,title:'数学家有没有接手',tag:'03 / 共同体',img:'smf-timeline.jpg',crop:[.146,.09,.524,.76]}
    ];
    const active=i===26?Math.min(2,Math.floor((t-S(26))/1.35)):-1;
    cards.forEach((c,k)=>{
      const p=phase(t,S(25)+k*.35,.55),on=active===k,dim=active>=0&&!on;
      g.save();g.globalAlpha=p*(dim?.55:1);
      if(on)fadeWash(c.x-12,418,568,580,.05);
      rule([c.x,430],[c.x+544,430],on?C.green:'#39423f',on?3:1,1);
      rect(c.x+1,431,542,342,'#333d3a');
      image(imgs[c.img],[c.x+2,432,540,340],{crop:c.crop});
      rule([c.x,800],[c.x+544,800],'#2a3330',1,1);
      text(c.tag,c.x+2,842,19,{face:'number',color:on?C.green:C.muted,weight:600});
      text(c.title,c.x+2,898,35,{color:on?C.white:C.paper});
      text(['原题与摘要','编译与占位符','公开讲座'][k],c.x+2,940,21,{color:C.muted});
      g.restore();
    });
    credit='左：arXiv 标题；中：Lean 教学演示；右：SMF 公开讲座 · 均为来源画面';
    footer(cues[i],t,credit,keywords[i]);
  }
  if(!(i===3||i===23||i===24))vignette();
  if(!(i===3||i===23||i===24))meta(label);
  if(fadeAllowed&&lastT>0&&t>=lastT&&t-lastT<.52){g.save();g.globalAlpha=1-ease((t-lastT)/.52);g.drawImage(snap,0,110);g.restore();}
  if(PREVIEW&&!CLEAN){text(`CUE ${String(i).padStart(2,'0')}    ${tc(t)} / ${tc(DUR)}`,1840,932,18,{align:'right',face:'number',color:'#9fe8c2',weight:500});}
}

let current=0,origin=0,playing=true,audioDriven=false,started=false,lastSync=0,active=-1;
function clock(){return audioDriven&&!voice.paused?voice.currentTime:current+(playing?(performance.now()-origin)/1000:0)}
async function syncMedia(t,force=false){if(STILL){videos.forEach(v=>v.pause());active=-1;return;}const z=shotFor(t);for(let n=0;n<2;n++)if(!z||videos[n]!==z.v)videos[n].pause();if(!z){active=-1;return;}const v=z.v;
  if(force||active!==z.index||Math.abs(v.currentTime-z.time)>.25){if(force){await new Promise(r=>{if(Math.abs(v.currentTime-z.time)<.03){r();return;}v.addEventListener('seeked',r,{once:true});v.currentTime=z.time;});}else v.currentTime=z.time;}
  v.playbackRate=clamp(z.rate,.25,3);if(playing)v.play().catch(()=>{});else v.pause();active=z.index;
  const next=segments[z.index+1];if(next&&S(next.cue)-t<1.0&&S(next.cue)>t){const other=videos[next.v];if(Math.abs(other.currentTime-next.in)>.1&&!other.seeking)other.currentTime=next.in;}
}
function setTime(t){fadeAllowed=false;current=clamp(t,0,DUR);origin=performance.now();if(audioDriven)voice.currentTime=current;syncMedia(current);draw(current);fadeAllowed=true}
function frameReady(v){return new Promise(r=>{let done=false;const fin=()=>{if(done)return;done=true;r()};if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(fin);setTimeout(fin,260);});}
window.seek=async t=>{fadeAllowed=false;playing=false;voice.pause();audioDriven=false;current=clamp(t,0,DUR);origin=performance.now();const z=shotFor(current);await syncMedia(current,true);if(z&&!STILL)await frameReady(z.v);await new Promise(r=>requestAnimationFrame(()=>r()));draw(current);fadeAllowed=true;document.getElementById('pause').textContent='播放';return current;};
window.renderAt=t=>{draw(t);return indexAt(t)};
window.filmNow=()=>clock();
window.filmPlaying=()=>playing;
window.pauseFilm=()=>{current=clamp(clock(),0,DUR);playing=false;voice.pause();videos.forEach(v=>v.pause());document.getElementById('pause').textContent='播放';};
window.playFilm=async t=>{current=clamp(t,0,DUR-.01);origin=performance.now();if(audioDriven)voice.currentTime=current;playing=true;await syncMedia(current);if(audioDriven)voice.play().catch(()=>{audioDriven=false;});document.getElementById('pause').textContent='暂停';};
async function enableSound(){current=clamp(clock(),0,DUR-.01);origin=performance.now();voice.currentTime=current;voice.muted=false;try{await voice.play();audioDriven=true;playing=true;document.getElementById('sound').textContent='旁白已开启';document.getElementById('pause').textContent='暂停';}catch{document.getElementById('sound').textContent='点击开启旁白';}}
function tick(now){if(started){const t=clamp(clock(),0,DUR);if(t>=DUR){current=DUR;playing=false;voice.pause();videos.forEach(v=>v.pause());document.getElementById('pause').textContent='播放';}draw(t);{const ce=document.getElementById('clock');if(ce)ce.textContent=`${tc(t)} / ${tc(DUR)}`;}if(now-lastSync>180){syncMedia(t);lastSync=now;document.getElementById('seek').value=t;}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
document.getElementById('sound').onclick=()=>{if(audioDriven&&!voice.muted){voice.muted=true;document.getElementById('sound').textContent='开启旁白';}else enableSound();};
document.getElementById('pause').onclick=()=>{if(playing){current=clamp(clock(),0,DUR);playing=false;voice.pause();videos.forEach(v=>v.pause());}else{if(current>=DUR)current=0;origin=performance.now();playing=true;if(audioDriven){voice.currentTime=current;voice.play().catch(()=>{audioDriven=false;});}syncMedia(current);}document.getElementById('pause').textContent=playing?'暂停':'播放';};
document.getElementById('replay').onclick=()=>{setTime(0);playing=true;if(audioDriven)voice.play().catch(()=>{audioDriven=false;});document.getElementById('pause').textContent='暂停';};
document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.getElementById('seek').oninput=e=>setTime(+e.target.value);
window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();document.getElementById('pause').click();}if(e.code==='ArrowRight')setTime(clock()+5);if(e.code==='ArrowLeft')setTime(clock()-5);});
async function ready(){try{
  await Promise.all(imageNames.map(n=>new Promise((r,j)=>{const im=new Image();im.onload=()=>{imgs[n]=im;r();};im.onerror=()=>j(Error('素材无法载入：'+n));im.src='assets/'+n;})));
  if(!STILL){
    const wait=v=>v.readyState>=2?Promise.resolve():new Promise((r,j)=>{v.addEventListener('loadeddata',r,{once:true});v.addEventListener('error',()=>j(Error('音视频无法载入')),{once:true});});
    await Promise.race([Promise.all([...videos,voice].map(wait)),new Promise(r=>setTimeout(r,9000))]);
  }
  document.getElementById('status').remove();origin=performance.now();started=true;await syncMedia(0,true);draw(0);
  const q=new URLSearchParams(location.search);
  if(q.has('shot')){document.body.classList.add('shot');document.getElementById('stage').style.width='1920px';document.getElementById('stage').style.height='1080px';document.getElementById('stage').style.aspectRatio='auto';}
  if(q.has('review'))await window.seek(+(q.get('t')||0));
  else if(q.has('t'))await window.seek(+(q.get('t')||0));
  else try{await voice.play();audioDriven=true;document.getElementById('sound').textContent='旁白已开启';}catch{document.getElementById('sound').textContent='点击开启旁白';}
  window.__READY=true;
}catch(e){document.getElementById('status').textContent=e.message;console.error(e);}}ready();
