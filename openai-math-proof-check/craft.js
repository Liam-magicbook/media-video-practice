/* Canvas craft primitives for this film.
   Source positions are normalized; camera, masks and marks share one mapping. */
'use strict';
window.FilmCraft=(()=>{
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lerp=(a,b,p)=>a+(b-a)*p;
 const ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,p)=>a.map((v,i)=>lerp(v,b[i],p));
 const F={
   sans:'"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
   serif:'"Songti SC","STSong","SimSun",serif',
   number:'"SF Mono","Menlo","Consolas",monospace'
 };
 const C={bg:'#0d1112',paper:'#f3f0e6',white:'#f8f6ee',green:'#7fe3a8',red:'#e0523a',amber:'#f2c14e',muted:'#9aa39f',ink:'#141818',line:'#3a4441'};
 function make(canvas){const g=canvas.getContext('2d',{alpha:false});
  const rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  function roundRect(x,y,w,h,r,fill){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fillStyle=fill;g.fill();}
  function text(s,x,y,size=38,opts={}){const face=opts.face||'sans',weight=opts.weight||(face==='number'?600:face==='serif'?700:size>=64?800:500);g.fillStyle=opts.color||C.white;g.font=`${weight} ${size}px ${F[face]}`;g.textAlign=opts.align||'left';g.textBaseline='alphabetic';g.letterSpacing=opts.tracking??(size>=64?`${-size*.015}px`:'0px');g.fillText(s,x,y);g.letterSpacing='0px';}
  function wrap(s,x,y,width,size=38,opts={}){g.font=`${opts.weight||500} ${size}px ${F[opts.face||'sans']}`;let row='',n=0;for(const ch of s){if(g.measureText(row+ch).width>width){text(row,x,y+n*size*1.55,size,opts);row=ch;n++}else row+=ch}if(row)text(row,x,y+n*size*1.55,size,opts);}
  function line(a,b,p=1,color=C.green,width=3){p=clamp(p);g.beginPath();g.moveTo(...a);g.lineTo(lerp(a[0],b[0],p),lerp(a[1],b[1],p));g.strokeStyle=color;g.lineWidth=width;g.stroke();}
  function arrow(a,b,p=1,color=C.green,width=3){line(a,b,p,color,width);if(p>.97){const r=Math.atan2(b[1]-a[1],b[0]-a[0]);line(b,[b[0]-15*Math.cos(r-.5),b[1]-15*Math.sin(r-.5)],1,color,width);line(b,[b[0]-15*Math.cos(r+.5),b[1]-15*Math.sin(r+.5)],1,color,width)}}
  function tag(s,x,y,opts={}){const sz=opts.size||24;g.font=`600 ${sz}px ${F.sans}`;const w=g.measureText(s).width+30;rect(x,y-sz-8,w,sz+20,opts.bg||C.paper);text(s,x+15,y,sz,{weight:650,color:opts.color||C.ink});return w;}
  function strokeRect(r,p=1,color=C.red,width=3){let remain=clamp(p)*2*(r[2]+r[3]);for(const [a,b,len] of [[[r[0],r[1]],[r[0]+r[2],r[1]],r[2]],[[r[0]+r[2],r[1]],[r[0]+r[2],r[1]+r[3]],r[3]],[[r[0]+r[2],r[1]+r[3]],[r[0],r[1]+r[3]],r[2]],[[r[0],r[1]+r[3]],[r[0],r[1]],r[3]]]){if(remain<=0)break;line(a,b,Math.min(remain/len,1),color,width);remain-=len;}}
  function image(media,box,opts={}){
   if(!media||media.tagName==='VIDEO'&&media.readyState<2)return null;
   const iw=media.videoWidth||media.naturalWidth,ih=media.videoHeight||media.naturalHeight;if(!iw||!ih)return null;
   const crop=opts.crop||[0,0,1,1],[sx,sy,sw,sh]=crop.map((v,i)=>v*(i%2?ih:iw)),[x,y,w,h]=box;
   const s=(opts.cover?Math.max:Math.min)(w/sw,h/sh),dw=sw*s,dh=sh*s,dx=x+(w-dw)/2,dy=y+(h-dh)/2;
   const map=(nx,ny)=>[dx+(nx*iw-sx)*s,dy+(ny*ih-sy)*s];
   const mapRect=r=>{const a=map(r[0],r[1]);return [a[0],a[1],r[2]*iw*s,r[3]*ih*s]};
   g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.drawImage(media,sx,sy,sw,sh,dx,dy,dw,dh);
   if(opts.focus?.length){g.beginPath();g.rect(...(opts.cover?[x,y,w,h]:[dx,dy,dw,dh]));for(const r of opts.focus){const z=mapRect(r);g.rect(...z)}g.fillStyle=`rgba(6,10,11,${opts.dim??.72})`;g.fill('evenodd');}
   if(opts.shade){rect(x,y,w,h,`rgba(6,10,11,${opts.shade})`);}
   for(const mark of opts.marks||[]){const z=mapRect(mark.r);if(mark.fill){g.globalAlpha=.12*(mark.p??1);rect(...z,mark.color||C.red);g.globalAlpha=1}strokeRect(z,mark.p??1,mark.color||C.red,mark.width||3)}
   g.restore();return {map,mapRect,visible:[dx,dy,dw,dh]};
  }
  function wash(x,y,w,h,color='#ffffff',alpha=.04){const r=parseInt(color.slice(1,3),16),g2=parseInt(color.slice(3,5),16),b=parseInt(color.slice(5,7),16);rect(x,y,w,h,`rgba(${r},${g2},${b},${alpha})`);}
  function rule(a,b,color=C.line,width=1,alpha=1){g.save();g.globalAlpha=alpha;g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke();g.restore();}
  function clipTop(x,y,w,h,p,fn){p=clamp(p);if(p<=0)return;g.save();g.beginPath();g.rect(x,y,w,h*p);g.clip();fn();g.restore();}
  function veil(side='left',strength=.94){const q=g.createLinearGradient(side==='left'?0:1920,0,side==='left'?1450:470,0);q.addColorStop(0,`rgba(10,15,16,${strength})`);q.addColorStop(.45,`rgba(10,15,16,${strength*.8})`);q.addColorStop(1,'rgba(10,15,16,0)');rect(0,0,1920,1080,q);}
  function footer(cue,t,credit,word=''){
   const z=g.createLinearGradient(0,880,0,1080);z.addColorStop(0,'rgba(10,15,16,0)');z.addColorStop(.42,'rgba(10,15,16,.94)');z.addColorStop(1,'#0a0f10');rect(0,880,1920,200,z);
   text(credit,80,972,20,{color:C.muted});
   if(cue&&t>=cue.start){g.save();g.globalAlpha=clamp((t-cue.start)/.22);const str=cue.text,size=38;g.font=`550 ${size}px ${F.sans}`;const at=word?str.indexOf(word):-1;const parts=at<0?[{s:str,c:C.white}]:[{s:str.slice(0,at),c:C.white},{s:word,c:C.green},{s:str.slice(at+word.length),c:C.white}];let x=960-g.measureText(str).width/2;for(const p of parts){text(p.s,x,1035,size,{weight:550,color:p.c});g.font=`550 ${size}px ${F.sans}`;x+=g.measureText(p.s).width;}g.restore();}
   rect(80,1068,1760,3,'#3a4441');rect(80,1068,1760*clamp(t/108),3,C.green);
  }
  function footerLight(cue,t,credit,word=''){
   rect(0,880,1920,200,C.paper);
   const z=g.createLinearGradient(0,860,0,940);z.addColorStop(0,'rgba(243,240,230,0)');z.addColorStop(1,C.paper);rect(0,860,1920,80,z);
   rect(80,892,1760,2,'#d8d2c2');
   text(credit,80,972,20,{color:'#7b817a'});
   if(cue&&t>=cue.start){g.save();g.globalAlpha=clamp((t-cue.start)/.22);const str=cue.text,size=38;g.font=`550 ${size}px ${F.sans}`;const at=word?str.indexOf(word):-1;const parts=at<0?[{s:str,c:'#1b201d'}]:[{s:str.slice(0,at),c:'#1b201d'},{s:word,c:C.red},{s:str.slice(at+word.length),c:'#1b201d'}];let x=960-g.measureText(str).width/2;for(const p of parts){text(p.s,x,1035,size,{weight:550,color:p.c});g.font=`550 ${size}px ${F.sans}`;x+=g.measureText(p.s).width;}g.restore();}
   rect(80,1068,1760,3,'#d8d2c2');rect(80,1068,1760*clamp(t/108),3,C.red);
  }
  return {g,rect,roundRect,text,wrap,line,arrow,tag,image,strokeRect,veil,footer,footerLight,wash,rule,clipTop};
 }
 return {make,clamp,lerp,ease,mix,F,C};
})();
