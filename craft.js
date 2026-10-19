/* Canvas craft primitives shared by this film and later edits.
   Source positions are normalized; camera, masks and marks share one mapping. */
'use strict';
window.FilmCraft=(()=>{
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lerp=(a,b,p)=>a+(b-a)*p;
 const ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,p)=>a.map((v,i)=>lerp(v,b[i],p));
 const F={sans:'"Film Sans",sans-serif',serif:'"Film Serif",serif',number:'"Film Numbers",sans-serif',mono:'"SFMono-Regular",monospace'};
 const C={bg:'#101416',paper:'#f3f0e7',white:'#f6f5ef',green:'#b6f3bc',red:'#ff9276',muted:'#b3bcb8',ink:'#171b1b'};
 function make(canvas){const g=canvas.getContext('2d',{alpha:false});
 const rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 function text(s,x,y,size=38,opts={}){const face=opts.face||'sans',weight=opts.weight||(face==='number'?700:face==='serif'?700:size>=64?850:500);g.fillStyle=opts.color||C.white;g.font=`${weight} ${size}px ${F[face]}`;g.textAlign=opts.align||'left';g.textBaseline='alphabetic';g.letterSpacing=opts.tracking??(size>=64?`${-size*.018}px`:'0px');g.fillText(s,x,y);g.letterSpacing='0px';}
 function wrap(s,x,y,width,size=38,opts={}){g.font=`${opts.weight||500} ${size}px ${F[opts.face||'sans']}`;let row='',n=0;for(const ch of s){if(g.measureText(row+ch).width>width){text(row,x,y+n*size*1.5,size,opts);row=ch;n++}else row+=ch}if(row)text(row,x,y+n*size*1.5,size,opts);}
 function line(a,b,p=1,color=C.green,width=3){p=clamp(p);g.beginPath();g.moveTo(...a);g.lineTo(lerp(a[0],b[0],p),lerp(a[1],b[1],p));g.strokeStyle=color;g.lineWidth=width;g.stroke();}
 function arrow(a,b,p=1,color=C.green,width=3){line(a,b,p,color,width);if(p>.97){const r=Math.atan2(b[1]-a[1],b[0]-a[0]);line(b,[b[0]-15*Math.cos(r-.5),b[1]-15*Math.sin(r-.5)],1,color,width);line(b,[b[0]-15*Math.cos(r+.5),b[1]-15*Math.sin(r+.5)],1,color,width)}}
 function tag(s,x,y,opts={}){const sz=opts.size||25;g.font=`600 ${sz}px ${F.sans}`;const w=g.measureText(s).width+30;rect(x,y-sz-8,w,sz+22,opts.bg||C.paper);text(s,x+15,y,sz,{weight:650,color:opts.color||C.ink});return w;}
 function strokeRect(r,p=1,color=C.red,width=3){let remain=clamp(p)*2*(r[2]+r[3]);for(const [a,b,len] of [[[r[0],r[1]],[r[0]+r[2],r[1]],r[2]],[[r[0]+r[2],r[1]],[r[0]+r[2],r[1]+r[3]],r[3]],[[r[0]+r[2],r[1]+r[3]],[r[0],r[1]+r[3]],r[2]],[[r[0],r[1]+r[3]],[r[0],r[1]],r[3]]]){if(remain<=0)break;line(a,b,Math.min(remain/len,1),color,width);remain-=len;}}
 function image(media,box,opts={}){
  if(!media||media.tagName==='VIDEO'&&media.readyState<2)return null;
  const iw=media.videoWidth||media.naturalWidth,ih=media.videoHeight||media.naturalHeight;if(!iw||!ih)return null;
  const crop=opts.crop||[0,0,1,1],[sx,sy,sw,sh]=crop.map((v,i)=>v*(i%2?ih:iw)),[x,y,w,h]=box;
  const s=(opts.cover?Math.max:Math.min)(w/sw,h/sh),dw=sw*s,dh=sh*s,dx=x+(w-dw)/2,dy=y+(h-dh)/2;
  const map=(nx,ny)=>[dx+(nx*iw-sx)*s,dy+(ny*ih-sy)*s];
  const mapRect=r=>{const a=map(r[0],r[1]);return [a[0],a[1],r[2]*iw*s,r[3]*ih*s]};
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.drawImage(media,sx,sy,sw,sh,dx,dy,dw,dh);
  if(opts.focus?.length){g.beginPath();g.rect(...(opts.cover?[x,y,w,h]:[dx,dy,dw,dh]));for(const r of opts.focus){const z=mapRect(r);g.rect(...z)}g.fillStyle=`rgba(5,9,10,${opts.dim??.72})`;g.fill('evenodd');}
  if(opts.shade){rect(x,y,w,h,`rgba(5,9,10,${opts.shade})`);}
  for(const mark of opts.marks||[]){const z=mapRect(mark.r);if(mark.fill){g.globalAlpha=.12*(mark.p??1);rect(...z,mark.color||C.red);g.globalAlpha=1}strokeRect(z,mark.p??1,mark.color||C.red,mark.width||3)}
  g.restore();return {map,mapRect,visible:[dx,dy,dw,dh]};
 }
 function veil(side='left',strength=.94){const q=g.createLinearGradient(side==='left'?0:1920,0,side==='left'?1450:500,0);q.addColorStop(0,`rgba(9,14,16,${strength})`);q.addColorStop(.45,`rgba(9,14,16,${strength*.8})`);q.addColorStop(1,'rgba(9,14,16,0)');rect(0,0,1920,1080,q);}
 function footer(cue,t,credit,word=''){
  const z=g.createLinearGradient(0,890,0,1080);z.addColorStop(0,'rgba(9,14,16,0)');z.addColorStop(.42,'rgba(9,14,16,.92)');z.addColorStop(1,'#090e10');rect(0,890,1920,190,z);
  text(credit,80,975,20,{color:C.muted});
  if(cue&&t>=cue.start){const str=cue.text,size=39;g.font=`550 ${size}px ${F.sans}`;const at=word?str.indexOf(word):-1;const parts=at<0?[{s:str,c:C.white}]:[{s:str.slice(0,at),c:C.white},{s:word,c:C.green},{s:str.slice(at+word.length),c:C.white}];let x=960-g.measureText(str).width/2;for(const p of parts){text(p.s,x,1034,size,{weight:550,color:p.c});g.font=`550 ${size}px ${F.sans}`;x+=g.measureText(p.s).width;}}
  rect(80,1067,1760,3,'#3e4845');rect(80,1067,1760*clamp(t/120),3,C.green);
 }
 return {g,rect,text,wrap,line,arrow,tag,image,strokeRect,veil,footer};
 }
 return {make,clamp,lerp,ease,mix,F,C};
})();
