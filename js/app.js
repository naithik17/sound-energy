// Slide engine + physics scenes. Scenes are keyed by slide number (1-based).
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0,wt=0;
const S={ch:{},k:{},s9:'',mode:'before',amp:0,p3:-1,w7:0,play:true,rev:0,revT:0,hl:'',tm:'x',ct:{}};
const TAU=Math.PI*2,INK='#f3ecd0',G='#7fa68a',CY='#6fb7c9',Y='#e8c872';
function fit(c){const d=devicePixelRatio||1,r=c.getBoundingClientRect();c.width=r.width*d;c.height=r.height*d;c.W=r.width;c.H=r.height;c.x=c.getContext('2d');c.x.setTransform(d,0,0,d,0,0)}
const fitAll=()=>$$('canvas').forEach(fit);addEventListener('resize',fitAll);
function go(i){cur=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,j)=>s.classList.toggle('on',j==cur));
 $('#bar i').style.width=cur/(slides.length-1)*100+'%';$('#num').textContent=cur+1+' / '+slides.length;$('#menu').classList.remove('on');
 if(cur==2){S.p3=-1;$('#m3').classList.remove('show')}if(cur==7){S.revT=0;S.rev=0;S.hl=''}history.replaceState(null,'','#'+(cur+1))}
$('#menu').innerHTML=slides.map((s,i)=>`<a data-a="go:${i}">${i+1}. ${s.dataset.t}</a>`).join('');
const acts={
 go:v=>go(+v),nav:v=>go(cur+ +v),menu:()=>$('#menu').classList.toggle('on'),
 show:(v,b)=>(v?$(v):b).classList.toggle('show'),open:(v,b)=>b.classList.toggle('open'),
 present:()=>{document.body.classList.toggle('present');const f=document.fullscreenElement;f?document.exitFullscreen():document.documentElement.requestFullscreen?.().catch(()=>{});setTimeout(fitAll,300)},
 chain:v=>{const c=$(v),s=$$('.st',c),N=s.length+ +(c.dataset.ex||0);let n=S.ch[v]||0;
  if(n>=N){s.forEach(e=>e.classList.remove('lit'));c.classList.remove('done');n=0}else{if(n<s.length)s[n].classList.add('lit');n++;if(n==N)c.classList.add('done')}
  S.ch[v]=n;S.k[v]=0;$(`[data-a="chain:${v}"]`).textContent=n>=N?'Restart ↺':'Next step ▶'},
 mode:(v,b)=>{S.mode=v;$$('[data-a^="mode"]').forEach(x=>x.classList.toggle('act',x==b));['before','during','after'].forEach(m=>$('#x-'+m).classList.toggle('on-card',m==v))},
 play3:()=>{S.p3=0},wave:()=>{S.w7=S.w7?0:1},
 g8:v=>{if(v=='draw')S.revT=S.revT?0:1;else if(v=='play')S.play=!S.play;else S.hl=v=='none'?'':v},
 tm:(v,b)=>{S.tm=v;$$('[data-a^="tm"]').forEach(x=>x.classList.toggle('act',x==b))},
 ct:v=>{S.s9=S.s9==v?'':v;S.k.s9=0;$$('[data-a^="ct:"]').forEach(b=>b.classList.toggle('act',b.dataset.a=='ct:'+S.s9))}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const i=b.dataset.a.indexOf(':'),a=i<0?b.dataset.a:b.dataset.a.slice(0,i),v=i<0?'':b.dataset.a.slice(i+1);acts[a]?.(v,b)});
addEventListener('keydown',e=>{if(e.key=='ArrowRight'||e.key=='PageDown')go(cur+1);if(e.key=='ArrowLeft'||e.key=='PageUp')go(cur-1);if(e.key=='p'||e.key=='P')acts.present();if(e.key=='Escape')document.body.classList.remove('present')});
// ---- helpers
function txt(x,s,px,py,sz,col,al='left'){x.font=sz+'px "Patrick Hand","Segoe Print",cursive';x.fillStyle=col;x.textAlign=al;x.fillText(s,px,py)}
function arrow(x,a,b,c,d,col){x.strokeStyle=col;x.lineWidth=2;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();const g=Math.atan2(d-b,c-a);x.beginPath();x.moveTo(c,d);x.lineTo(c-9*Math.cos(g-.4),d-9*Math.sin(g-.4));x.lineTo(c-9*Math.cos(g+.4),d-9*Math.sin(g+.4));x.fill()}
// particle block: displacement A*sin(k(x0-ref)-t); compression where cos=-1
function block(x,X,Y0,w,h,amp,t,o={}){const rows=o.rows||5,cols=o.cols||36,sp=w/cols,k=o.k||TAU/(w/3),A=.6/k*amp,ref=o.ref||0,r=Math.max(3,w/190);
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x0=i*sp+sp/2,px=x0+A*Math.sin(k*(x0-ref)-t),py=Y0+h*(j+.5)/rows,tr=o.track&&j==2&&i==Math.floor(cols/3);
  if(tr){x.strokeStyle=Y;x.setLineDash([4,4]);x.beginPath();x.arc(X+x0,py,r*2.2,0,TAU);x.stroke();x.setLineDash([])}
  x.fillStyle=tr?Y:CY;x.beginPath();x.arc(X+px,py,tr?r*1.5:r,0,TAU);x.fill()}}
// ---- scenes
const scenes={
1:(x,W,H)=>{x.clearRect(0,0,W,H);x.strokeStyle=G;x.lineWidth=2;for(let n=0;n<3;n++){x.beginPath();for(let i=0;i<=W;i+=8){const y=H*(.55+.12*n)+Math.sin(i/70+wt*(1+n*.4))*(18+n*10);i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()}},
3:(x,W,H,dt)=>{x.clearRect(0,0,W,H);const on=S.p3>=0;if(on){S.p3+=dt;if(S.p3>3)$('#m3').classList.add('show')}const t=S.p3,sy=H*.62,cx0=W*.6,cx1=W*.92;
 // source (speaker-like box)
 const v=on?Math.sin(wt*30)*3:0;x.strokeStyle=INK;x.lineWidth=3;x.strokeRect(W*.06+v,H*.48,W*.07,H*.28);txt(x,'loud sound source',W*.03,H*.45,W/45,INK);
 if(on)for(let n=0;n<8;n++){const r=((t*W*.28)-n*W*.07);if(r>0&&r<W*.52){x.strokeStyle=`rgba(111,183,201,${1-r/(W*.52)})`;x.beginPath();x.arc(W*.13,H*.62,r,-.8,.8);x.stroke()}}
 // container + sheet
 x.strokeStyle=INK;x.beginPath();x.moveTo(cx0,sy);x.lineTo(cx0,H*.92);x.lineTo(cx1,H*.92);x.lineTo(cx1,sy);x.stroke();txt(x,'container',cx0+W*.1,H*.97,W/45,INK);
 const hit=on&&t>1.6?Math.min(1,(t-1.6)):0,A=hit*H*.025;x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let i=0;i<=40;i++){const px=cx0+(cx1-cx0)*i/40;i?x.lineTo(px,sy+Math.sin(wt*28)*A*Math.sin(Math.PI*i/40)):x.moveTo(px,sy)}x.stroke();
 txt(x,'stretched sheet',cx0,sy-H*.3,W/45,Y);
 for(let i=0;i<9;i++){const gx=cx0+(cx1-cx0)*(i+.5)/9,hop=hit?Math.abs(Math.sin(wt*9+i*1.7))*H*.1*hit:0;x.fillStyle=INK;x.beginPath();x.arc(gx,sy-6-hop,5,0,TAU);x.fill()}
 txt(x,'grains',cx1-W*.05,sy-H*.12,W/45,INK)},
5:(x,W,H,dt)=>{x.clearRect(0,0,W,H);const tg=S.mode=='during'?1:0;S.amp+=(tg-S.amp)*Math.min(1,dt*3);const a=S.amp,bx=W*.04,bw=W*.92,by=H*.08,bh=H*.84;
 x.strokeStyle=G;x.lineWidth=2;x.strokeRect(bx,by,bw,bh);
 if(a>.5){const f=(wt*.35)%1.2*bw;x.fillStyle='rgba(232,200,114,.12)';x.fillRect(bx+f-bw*.1,by,bw*.1,bh)}
 P5.forEach((p,i)=>{const jx=Math.sin(wt*p.s*2+p.a)*6,jy=Math.cos(wt*p.s*2.3+p.b)*6,dx=a*Math.sin(wt*7-p.x*9)*W*.025,px=bx+p.x*bw*.92+bw*.04+jx+dx,py=by+p.y*bh*.9+bh*.05+jy;
  x.fillStyle=a>.5?Y:CY;x.beginPath();x.arc(px,py,Math.max(4,W/150),0,TAU);x.fill();if(a>.5&&i%4==0){x.globalAlpha=a;arrow(x,px-W*.03,py+16,px+W*.03,py+16,Y);arrow(x,px+W*.03,py+16,px-W*.03,py+16,Y);x.globalAlpha=1}})},
7:(x,W,H,dt)=>{x.clearRect(0,0,W,H);const tgt=S.w7?1:0;S.a7=(S.a7||0)+(tgt-(S.a7||0))*Math.min(1,dt*3);const a=S.a7,k=TAU/(W*.92/3);
 txt(x,a<.1?'no wave: same density everywhere':'with a wave: crowded, then spread out',W*.04,H*.1,W/38,Y);
 block(x,W*.04,H*.2,W*.92,H*.6,a,wt,{rows:6,track:1});
 if(a>.3){x.globalAlpha=a;for(let n=-1;n<8;n++){const c=(Math.PI*(2*n+1)+wt)/k,r=(TAU*n+wt)/k;if(c>0&&c<W*.92)txt(x,'C',W*.04+c,H*.17,W/28,Y,'center');if(r>0&&r<W*.92)txt(x,'R',W*.04+r,H*.17,W/28,CY,'center')}x.globalAlpha=1}
 txt(x,'particles shift left & right, bunching up — the tracked particle (yellow) only wobbles around its spot',W*.04,H*.95,W/60,INK)},
8:(x,W,H,dt)=>{x.clearRect(0,0,W,H);if(S.play)wt+=dt*1.6;S.rev+=(S.revT-S.rev)*Math.min(1,dt*2.5);const X0=60,GW=W-X0-30,k=TAU/(GW/3),ay=H*.76,gh=H*.16;
 if(S.hl)for(let i=0;i<GW;i+=3){const c=Math.cos(k*i-wt);if(S.hl=='C'?c<-.15:c>.15){x.fillStyle=S.hl=='C'?'rgba(232,200,114,.15)':'rgba(111,183,201,.15)';x.fillRect(X0+i,H*.1,3,H*.8)}}
 block(x,X0,H*.04,GW,H*.38,1,wt,{rows:5,cols:36,k,track:1});
 x.strokeStyle=INK;x.lineWidth=2;x.beginPath();x.moveTo(X0,H*.5);x.lineTo(X0,H*.97);x.lineTo(X0+GW,H*.97);x.stroke();txt(x,'Density',4,H*.62,W/50,INK);txt(x,'Distance →',X0+GW-W*.09,H*.97-6,W/50,INK);
 x.setLineDash([8,6]);x.strokeStyle=G;x.beginPath();x.moveTo(X0,ay);x.lineTo(X0+GW,ay);x.stroke();x.setLineDash([]);txt(x,'average density',X0+GW-W*.12,ay-6,W/55,G);
 x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let i=0;i<=GW*S.rev;i+=3){const y=ay+gh*Math.cos(k*i-wt);i?x.lineTo(X0+i,y):x.moveTo(X0+i,y)}x.stroke();
 if(S.hl&&S.rev>.5)txt(x,S.hl=='C'?'Compression: higher density ↑':'Rarefaction: lower density ↓',X0+GW/2,H*.52,W/38,S.hl=='C'?Y:CY,'center')},
9:(x,W,H,dt)=>{x.clearRect(0,0,W,H);const t=S.tm=='t';const bw=t?W*.26:0,X0=60+(t?bw+20:0),GW=W-X0-20,ay=H*.5,gh=H*.3,k=TAU/(GW/(t?2.5:2));
 x.strokeStyle=INK;x.lineWidth=2;x.beginPath();x.moveTo(X0,H*.08);x.lineTo(X0,H*.95);x.lineTo(X0+GW,H*.95);x.stroke();txt(x,'Density',4,H*.5,W/45,INK);txt(x,t?'Time →':'Distance →',X0+GW-W*.1,H*.95-6,W/45,INK);
 x.setLineDash([8,6]);x.strokeStyle=G;x.beginPath();x.moveTo(X0,ay);x.lineTo(X0+GW,ay);x.stroke();x.setLineDash([]);txt(x,'average density',X0+GW-W*.14,ay-6,W/50,G);
 const ph=wt,f=i=>ay+gh*Math.cos(t?ph-(GW-i)*k:k*i+Math.PI/2);
 x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let i=0;i<=GW;i+=3){i?x.lineTo(X0+i,f(i)):x.moveTo(X0+i,f(i))}x.stroke();
 txt(x,'above average density',X0+GW*.02,ay-gh-8,W/55,INK);txt(x,'below average density',X0+GW*.02,ay+gh+22,W/55,INK);
 if(t){block(x,10,H*.3,bw,H*.4,1,wt,{rows:5,cols:9,k:TAU/(bw*1.2),ref:bw/2});x.strokeStyle=Y;x.strokeRect(10+bw/2-8,H*.28,16,H*.44);txt(x,'one fixed spot',10+bw/2,H*.24,W/50,Y,'center');
  x.fillStyle=Y;x.beginPath();x.arc(X0+GW,f(GW),8,0,TAU);x.fill()}
 else{const mk=(on,xp,yp,lab,col)=>{if(!on)return;x.fillStyle=col;x.beginPath();x.arc(xp,yp,10,0,TAU);x.fill();txt(x,lab,xp+14,yp+(lab[0]=='C'?-14:30),W/38,col)};
  mk(S.ct.crest,X0+Math.PI/(2*k),ay-gh,'CREST: maximum density',Y);
  mk(S.ct.trough,X0+3*Math.PI/(2*k),ay+gh,'TROUGH: minimum density',CY)}}};
const P5=Array.from({length:46},()=>({x:Math.random(),y:Math.random(),a:Math.random()*6,b:Math.random()*6,s:.8+Math.random()*1.2}));
// ===== added: visual explanation panels (What happens / Recap / Crest & Trough)
const tick=(id,dt)=>S.k[id]=(S.k[id]||0)+dt,st=id=>S.ch[id]||0;
function ln(x,a,b,c,d,col,w=2){x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
function dash(x,f){x.setLineDash([5,5]);f();x.setLineDash([])}
function speaker(x,cx,cy,s,on){const v=on?Math.sin(wt*30)*s*.05:0;x.strokeStyle=INK;x.lineWidth=3;x.strokeRect(cx-s*.5,cy-s*.3,s*.4,s*.6);x.beginPath();x.moveTo(cx-s*.1+v,cy-s*.15);x.lineTo(cx+s*.25+v,cy-s*.42);x.lineTo(cx+s*.25+v,cy+s*.42);x.lineTo(cx-s*.1+v,cy+s*.15);x.closePath();x.stroke()}
function ruler(x,cx,cy,L){const d=Math.sin(wt*14)*L*.2,b=(dd,al)=>{x.globalAlpha=al;x.strokeStyle=INK;x.lineWidth=5;x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+L*.5,cy,cx+L,cy+dd);x.stroke()};b(-L*.2,.2);b(L*.2,.2);b(d,1);x.globalAlpha=1;x.fillStyle=G;x.fillRect(cx-L*.14,cy-L*.12,L*.14,L*.3)}
function field(x,X,Yt,w,h,rows,cols,amp,ph,front,r,tr,cyc=3){const k=TAU/(w/cyc),sp=w/cols;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x0=i*sp+sp/2,e=Math.max(0,Math.min(1,(front-x0)/(w*.12))),px=X+x0+.42/k*amp*e*Math.sin(k*x0-ph),py=Yt+h*(j+.5)/rows,t=tr&&j==tr[0]&&i==tr[1];
  if(t){x.strokeStyle=Y;dash(x,()=>{x.beginPath();x.arc(X+x0,py,r*2.2,0,TAU);x.stroke()})}
  x.fillStyle=t?Y:CY;x.beginPath();x.arc(px,py,t?r*1.5:r,0,TAU);x.fill()}return k}
function bands(x,X,Yt,w,h,ph,front,k){x.fillStyle='rgba(232,200,114,.13)';for(let n=-1;n<9;n++){const c=(Math.PI*(2*n+1)+ph)/k;if(c>0&&c<Math.min(w,front))x.fillRect(X+c-w/26,Yt,w/13,h)}}
function vib(x,W,y,cnt,r,A,off,w0=.12,w1=.76){for(let i=0;i<cnt;i++){const cx=W*(w0+w1*i/(cnt-1)),f=m=>cx+A*Math.sin((wt-m*.05)*5+i*off);
 x.strokeStyle=G;dash(x,()=>{x.beginPath();x.arc(cx,y,r*1.2,0,TAU);x.stroke()});
 for(let m=4;m>0;m--){x.fillStyle=`rgba(111,183,201,${.1*(5-m)})`;x.beginPath();x.arc(f(m),y,r,0,TAU);x.fill()}
 x.fillStyle=CY;x.beginPath();x.arc(f(0),y,r,0,TAU);x.fill();txt(x,'← →',cx,y+r*2.8,r*1.2,Y,'center')}}
function sheetScene(x,W,H,grains){const sy=H*.55,c0=W*.5,c1=W*.92,mx=(c0+c1)/2;speaker(x,W*.1,sy+H*.12,W*.16,1);
 for(let m=0;m<4;m++){const r=(wt*W*.2+m*W*.08)%(W*.32);x.strokeStyle=`rgba(111,183,201,${1-r/(W*.32)})`;x.lineWidth=2;x.beginPath();x.arc(W*.17,sy+H*.12,r,-.7,.7);x.stroke()}
 x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.moveTo(c0,sy);x.lineTo(c0,H*.82);x.lineTo(c1,H*.82);x.lineTo(c1,sy);x.stroke();txt(x,'container',mx,H*.87,W/42,INK,'center');
 const A=H*.03,f=u=>sy+Math.sin(wt*28)*A*Math.sin(Math.PI*u);x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let i=0;i<=40;i++)i?x.lineTo(c0+(c1-c0)*i/40,f(i/40)):x.moveTo(c0,sy);x.stroke();
 txt(x,'stretched sheet',mx,sy+H*.1,W/42,Y,'center');
 if(grains)for(let i=0;i<9;i++){x.fillStyle=INK;x.beginPath();x.arc(c0+(c1-c0)*(i+.5)/9,f((i+.5)/9)-6-Math.abs(Math.sin(wt*9+i*1.7))*H*.13,5,0,TAU);x.fill()}
 else{arrow(x,mx,sy-H*.22,mx,sy-H*.06,Y);arrow(x,mx,sy-H*.06,mx,sy-H*.22,Y);txt(x,'↑ ↓',mx+W*.04,sy-H*.13,W/36,Y)}}
function mini(x,i,rx,ry,rw,rh,a){x.globalAlpha=.5+.5*a;const my=ry+rh/2;
 if(i==0)speaker(x,rx+rw*.3,my,rh*1.1,1);
 else if(i==1)field(x,rx,ry,rw,rh,3,30,1,wt*2,1e9,2.5);
 else if(i==2){const k=TAU/(rw/3);x.strokeStyle=Y;x.lineWidth=3;x.beginPath();for(let q=0;q<=rw;q+=4){const yy=my+rh*.35*Math.cos(k*q-wt*2);q?x.lineTo(rx+q,yy):x.moveTo(rx,yy)}x.stroke();x.strokeStyle=G;dash(x,()=>{x.beginPath();x.moveTo(rx,my);x.lineTo(rx+rw,my);x.stroke()})}
 else{const sy=ry+rh*.45,c0=rx+rw*.15,c1=rx+rw*.85,A=rh*.1;x.strokeStyle=INK;x.lineWidth=2;x.beginPath();x.moveTo(c0,sy);x.lineTo(c0,ry+rh);x.lineTo(c1,ry+rh);x.lineTo(c1,sy);x.stroke();
  const f=u=>sy+Math.sin(wt*28)*A*Math.sin(Math.PI*u);x.strokeStyle=Y;x.lineWidth=3;x.beginPath();for(let q=0;q<=20;q++)q?x.lineTo(c0+(c1-c0)*q/20,f(q/20)):x.moveTo(c0,sy);x.stroke();
  if(i==4)for(let g=0;g<7;g++){x.fillStyle=INK;x.beginPath();x.arc(c0+(c1-c0)*(g+.5)/7,f((g+.5)/7)-5-Math.abs(Math.sin(wt*9+g*1.7))*rh*.4,3.5,0,TAU);x.fill()}}
 x.globalAlpha=1}
function chainRows(x,W,H,L,rowf,y0,sp,rh,bw,pulseSpeed){const N=L.length,p=(wt*pulseSpeed)%1*(N+.4),ai=Math.floor(p);
 L.forEach((s,i)=>{const ry=y0+i*sp,on=ai==i;x.strokeStyle=on?Y:G;x.lineWidth=on?3:2;x.strokeRect(W*.03,ry,bw,rh);txt(x,s,W*.03+bw/2,ry+rh*.62,Math.min(W/38,rh*.5),on?Y:INK,'center');
  if(rowf)rowf(i,W*.03+bw+W*.03,ry,W*.97-(W*.03+bw+W*.03),rh,on?1:0);if(i<N-1)arrow(x,W*.03+bw/2,ry+rh+2,W*.03+bw/2,ry+sp-2,on?Y:G)});
 const py=y0+Math.min(p,N-.5)*sp+rh/2;if(p<N){x.fillStyle='rgba(232,200,114,.25)';x.beginPath();x.arc(W*.03+bw+8,py,12,0,TAU);x.fill();x.fillStyle=Y;x.beginPath();x.arc(W*.03+bw+8,py,6,0,TAU);x.fill()}}
const hint=(x,W,H,s)=>txt(x,s,W/2,H/2,W/30,'#6c7f73','center');
const cap=(x,W,H,a,b)=>{txt(x,a,W/2,H*.9,W/26,Y,'center');if(b)txt(x,b,W/2,H*.97,W/34,INK,'center')};
scenes[4]=(x,W,H,dt)=>{x.clearRect(0,0,W,H);const n=st('#ch4'),kt=tick('#ch4',dt),ph=wt*2;
 if(!n)return hint(x,W,H,'Press  Next step ▶  to follow the sound, one step at a time');
 if(n==1){speaker(x,W*.45,H*.45,W*.3,1);arrow(x,W*.6,H*.14,W*.7,H*.14,Y);arrow(x,W*.7,H*.14,W*.6,H*.14,Y);txt(x,'SOUND SOURCE (e.g. a speaker)',W*.45,H*.8,W/34,G,'center');cap(x,W,H,'Sound source vibrates')}
 else if(n==2){const X=W*.2,w=W*.76,k=TAU/(w/3);speaker(x,W*.08,H*.5,W*.12,1);txt(x,'SOURCE',W*.08,H*.72,W/45,G,'center');txt(x,'AIR PARTICLES',X+w/2,H*.2,W/45,G,'center');
  const fr=kt*3.2/k;field(x,X,H*.28,w,H*.42,6,26,1,ph,fr,W/150,[2,5]);bands(x,X,H*.28,w,H*.42,ph,fr,k);
  const ax=X+Math.min(fr,w*.9);arrow(x,ax-W*.12,H*.76,ax,H*.76,Y);txt(x,'disturbance travels →',X+w/2,H*.8,W/38,Y,'center');txt(x,'yellow particle: it only wobbles around its spot',X+w/2,H*.86,W/50,INK,'center');cap(x,W,H,'',0);txt(x,'The disturbance travels through the air.',W/2,H*.96,W/30,Y,'center')}
 else if(n==3){const w=W*.8,X=W*.1;field(x,X,H*.04,w,H*.1,2,60,1,ph,1e9,1.6);const z=Math.min(1,kt/.8);x.strokeStyle=Y;x.lineWidth=2;x.strokeRect(X+w*.42,H*.02,w*.16,H*.14);dash(x,()=>{ln(x,X+w*.42,H*.16,W*.1*z+W*.42*(1-z),H*.3,Y);ln(x,X+w*.58,H*.16,W*.9*z+W*.58*(1-z),H*.3,Y)});txt(x,'zoom in',X+w*.62,H*.2,W/50,Y);
  x.globalAlpha=z;vib(x,W,H*.48,6,W/48,W*.04,.9);vib(x,W,H*.72,6,W/48,W*.04,.9+.5);x.globalAlpha=1;txt(x,'dashed ring = the particle\'s own position',W/2,H*.86,W/50,G,'center');txt(x,'The particles vibrate around their own positions.',W/2,H*.96,W/30,Y,'center')}
 else if(n<6){sheetScene(x,W,H,n==5);if(n==4)cap(x,W,H,'Air vibrations make the sheet vibrate.');else{txt(x,'The vibrating sheet makes the grains move.',W/2,H*.93,W/30,INK,'center');const a=Math.min(1,kt/.8);x.globalAlpha=a;x.strokeStyle=Y;x.lineWidth=3;x.strokeRect(W*.1,H*.03,W*.8,H*.13);txt(x,'SOUND TRANSFERS ENERGY.',W/2,H*.12,W/18,Y,'center');x.globalAlpha=1}}
 else{const L=['SOUND SOURCE','AIR PARTICLES','WAVE / DISTURBANCE','VIBRATING SHEET','MOVING GRAINS'];chainRows(x,W,H,L,(i,rx,ry,rw,rh,a)=>mini(x,i==4?4:i==3?3:i,rx,ry,rw,rh,a),H*.02,H*.165,H*.13,W*.3,.2);
  txt(x,'SOUND TRANSFERS ENERGY THROUGH THE MEDIUM',W/2,H*.97,W/27,Y,'center');ln(x,W*.1,H*.99,W*.9,H*.99,Y,3)}};
scenes[11]=(x,W,H,dt)=>{x.clearRect(0,0,W,H);const n=st('#ch11'),kt=tick('#ch11',dt),ph=wt*2;
 if(!n)return hint(x,W,H,'Press  Next step ▶  to build the big picture');
 if(n==1){ruler(x,W*.3,H*.45,W*.4);txt(x,'a vibrating object',W/2,H*.75,W/36,G,'center');cap(x,W,H,'Vibration starts the disturbance.')}
 else if(n==2){ruler(x,W*.08,H*.5,W*.16);for(let m=0;m<6;m++){const r=(wt*W*.16+m*W*.1)%(W*.6);x.strokeStyle=`rgba(111,183,201,${.8*(1-r/(W*.6))})`;x.lineWidth=2;x.beginPath();x.arc(W*.24,H*.5,r,-.9,.9);x.stroke()}
  txt(x,'VIBRATION',W*.14,H*.78,W/32,INK,'center');arrow(x,W*.3,H*.82,W*.62,H*.82,Y);txt(x,'SOUND ENERGY',W*.76,H*.85,W/32,Y,'center');txt(x,'energy leaves the source as a disturbance',W/2,H*.96,W/38,INK,'center')}
 else if(n==3){vib(x,W,H*.42,7,W/40,W*.035,.8);vib(x,W,H*.68,7,W/40,W*.035,1.3);txt(x,'← → ← → ← → ← →',W/2,H*.18,W/22,Y,'center');txt(x,'Each particle only vibrates around its own fixed position.',W/2,H*.93,W/32,INK,'center')}
 else if(n==4){const N=9,fr=(wt*1.2)%(N+3)-1.5,y=H*.5;for(let i=0;i<N;i++){const cx=W*(.1+.8*i/(N-1)),g=Math.exp(-((i-fr)**2)/1.1),px=cx+W*.04*g;x.strokeStyle=G;dash(x,()=>{x.beginPath();x.arc(cx,y,W/38,0,TAU);x.stroke()});x.fillStyle=g>.4?Y:CY;x.beginPath();x.arc(px,y,W/48,0,TAU);x.fill()}
  const ax=W*(.1+.8*Math.max(0,Math.min(N-1,fr))/(N-1));arrow(x,ax-W*.08,H*.3,ax+W*.04,H*.3,Y);txt(x,'energy / disturbance',ax,H*.24,W/40,Y,'center');txt(x,'passed from particle to particle →',W/2,H*.75,W/34,INK,'center');txt(x,'The particles stay near their own positions. The disturbance moves on.',W/2,H*.93,W/36,Y,'center')}
 else if(n==5){const X=W*.04,w=W*.92,k=field(x,X,H*.3,w,H*.4,5,34,Math.min(1,kt/1.2),ph,1e9,W/190);for(let m=-1;m<8;m++){const c=(Math.PI*(2*m+1)+ph)/k,r=(TAU*m+ph)/k;if(c>0&&c<w)txt(x,'C',X+c,H*.26,W/26,Y,'center');if(r>0&&r<w)txt(x,'R',X+r,H*.26,W/26,CY,'center')}
  txt(x,'CROWDED → COMPRESSION',W*.27,H*.84,W/34,Y,'center');txt(x,'SPREAD OUT → RAREFACTION',W*.73,H*.84,W/34,CY,'center');txt(x,'C = COMPRESSION    R = RAREFACTION',W/2,H*.12,W/34,INK,'center')}
 else if(n==6){const a=Math.min(1,kt/1.2);[[1,'COMPRESSION → HIGHER DENSITY',16,.9,Y],[0,'RAREFACTION → LOWER DENSITY',5,.25,CY]].forEach(([c,s,cols,lv,col],q)=>{const y0=H*(.08+q*.46);txt(x,s,W*.04,y0+H*.04,W/32,col);txt(x,c?'HIGH DENSITY':'LOW DENSITY',W*.04,y0+H*.4,W/40,INK);
   for(let j=0;j<4;j++)for(let i=0;i<cols;i++){x.fillStyle=col;x.beginPath();x.arc(W*.05+i*(W*.5/cols)+Math.sin(wt*6+i+j)*2,y0+H*.1+j*H*.06,W/130,0,TAU);x.fill()}
   x.strokeStyle=G;x.lineWidth=2;x.strokeRect(W*.7,y0+H*.08,W*.06,H*.28);x.fillStyle=col;x.fillRect(W*.7,y0+H*.36-H*.28*lv*a,W*.06,H*.28*lv*a);txt(x,'density',W*.73,y0+H*.42,W/50,G,'center')})}
 else if(n==7){const X=W*.1,w=W*.86,k=TAU/(w/3),a=Math.min(1,kt/2.5),ay=H*.7,gh=H*.13,dn=q=>-Math.cos(k*q-ph);
  field(x,X,H*.06,w,H*.2,3,36,1,ph,1e9,W/190);ln(x,X,H*.42,X,H*.95,INK);ln(x,X,H*.95,X+w,H*.95,INK);txt(x,'DENSITY',W*.01,H*.45,W/52,INK);txt(x,'DISTANCE FROM THE SOURCE →',X+w,H*.99,W/50,INK,'right');
  x.strokeStyle=G;dash(x,()=>{x.beginPath();x.moveTo(X,ay);x.lineTo(X+w,ay);x.stroke()});txt(x,'average density',X+w,ay+H*.2,W/55,G,'right');
  x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let q=0;q<=w*a;q+=3){const yy=ay-gh*dn(q);q?x.lineTo(X+q,yy):x.moveTo(X,yy)}x.stroke();
  if(a>.8){let c=((Math.PI+ph)%TAU)/k,r=(ph%TAU)/k;if(c<w*.08)c+=TAU/k;if(r<w*.08)r+=TAU/k;const it=[];if(c<w){arrow(x,X+c,H*.28,X+c,ay-gh-8,Y);it.push({ax:X+c,l:['compression →','graph rises'],col:Y})}if(r<w){arrow(x,X+r,H*.28,X+r,ay+gh-6,CY);it.push({ax:X+r,l:['rarefaction →','graph falls'],col:CY})}
   annot(x,it.sort((p,q)=>p.ax-q.ax),W,H*.38,W/50)}}
 else{const L=['VIBRATION','SOUND ENERGY','PARTICLE VIBRATION','ENERGY TRANSFER','COMPRESSION / RAREFACTION','DENSITY CHANGES','GRAPHICAL REPRESENTATION'];
  chainRows(x,W,H,L,null,H*.02,H*.14,H*.095,W*.42,.3);[ 'Sound is energy','being transferred','through a medium.'].forEach((s,i)=>txt(x,s,W*.76,H*.18+i*H*.09,W/24,Y,'center'));
  field(x,W*.55,H*.6,W*.42,H*.25,4,22,1,ph,1e9,W/230)}};
// annotations beside their arrows, pushed AWAY from each other, wrapped/stacked so boxes never overlap
function annot(x,it,W,y,sz){x.font=sz+'px "Patrick Hand","Segoe Print",cursive';const m=W*.012,lh=sz*1.2,bx=[];
 it.forEach((o,i)=>{const one=o.l.join(' '),w1=x.measureText(one).width,w2=Math.max(...o.l.map(t=>x.measureText(t).width)),left=it.length>1?i==0:o.ax>W/2,lim=left?o.ax-m:W-o.ax-m;
  const wrap=w1>lim;o.t=wrap?o.l:[one];o.w=wrap?w2:w1;o.left=left;  let x1=left?o.ax-6-o.w:o.ax+6;x1=Math.max(m,Math.min(W-m-o.w,x1));o.x1=x1;o.y=y;bx.push(o)});
 if(bx.length>1){const a=bx[0],b=bx[1];if(a.x1+a.w+m>b.x1){b.y=a.y+a.t.length*lh+lh*.4}}
 bx.forEach(o=>o.t.forEach((t,j)=>txt(x,t,o.x1,o.y+j*lh,sz,o.col)))}
// fixed-spot annotation: debounced state machine (text only; animation untouched)
const FM={C:['COMPRESSION PASSING →','DENSITY INCREASE',Y],R:['RAREFACTION PASSING →','DENSITY DECREASE',CY],A:['DENSITY NEAR AVERAGE','',INK]};
const FS={ps:'A',shown:'A',cand:'',cT:0,since:0,fade:1,out:false};
function fixedStep(now,dt){const f=FS;
 // 1) physical state with hysteresis (enter at ±.55, leave at ±.25)
 if(f.ps=='C'&&now<.25||f.ps=='R'&&now>-.25)f.ps='A';
 if(f.ps=='A'){if(now>.55)f.ps='C';else if(now<-.55)f.ps='R'}
 f.since+=dt;
 // 2) switch the message only if: different, stable >=.4s, current one shown >=1.8s
 if(f.ps!=f.shown&&!f.out){f.cand==f.ps?f.cT+=dt:(f.cand=f.ps,f.cT=0);
  if(f.cT>=.4&&f.since>=1.8)f.out=true}else if(f.ps==f.shown)f.cand='';
 // 3) fade out -> swap -> fade in
 if(f.out){f.fade-=dt/.3;if(f.fade<=0){f.fade=0;f.out=false;f.shown=f.ps;f.since=0;f.cand=''}}else f.fade=Math.min(1,f.fade+dt/.3);
 return f}
function fixedMsg(x,now,dt,px,py,sz){const f=fixedStep(now,dt),m=FM[f.shown];x.globalAlpha=Math.max(0,f.fade);txt(x,m[0],px,py,sz,m[2]);if(m[1])txt(x,m[1],px,py+sz*1.3,sz,m[2]);x.globalAlpha=1}
scenes[9]=(x,W,H,dt)=>{x.clearRect(0,0,W,H);const t=S.tm=='t',s=S.s9||'',kt=tick('s9',dt),C=s=='C'||s=='crest',R=s=='R'||s=='trough',ph=wt*2;
 const bw=W*.3,X0=W*.38,GW=W*.6,ay=H*.38,gh=H*.2;
 if(t){const w=bw,xs=w*.5,k=TAU/(w/1.5),GX=X0+W*.02,gw=W-GX-W*.02;txt(x,'WE WATCH ONE FIXED POSITION',10,H*.1,W/42,Y);
  field(x,10,H*.28,w,H*.4,5,12,1,ph,1e9,W/120,null,1.5);bands(x,10,H*.28,w,H*.4,ph,1e9,k);x.strokeStyle=Y;x.lineWidth=3;x.strokeRect(10+xs-W*.02,H*.26,W*.04,H*.44);txt(x,'📍 FIXED SPOT',10+xs,H*.22,W/42,Y,'center');
  const d=q=>-Math.cos(k*xs-(ph-(gw-q)*.012)),now=d(gw);fixedMsg(x,now,dt,10,H*.8,W/40);
  ln(x,GX,H*.1,GX,H*.95,INK);ln(x,GX,H*.95,GX+gw,H*.95,INK);txt(x,'DENSITY at the fixed spot',GX+6,H*.09,W/50,INK);txt(x,'TIME →',GX+gw,H*.99,W/50,INK,'right');x.strokeStyle=G;dash(x,()=>{x.beginPath();x.moveTo(GX,ay+H*.1);x.lineTo(GX+gw,ay+H*.1);x.stroke()});txt(x,'average density',GX+gw,ay+H*.1-6,W/55,G,'right');
  x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let q=0;q<=gw;q+=3){const yy=ay+H*.1-gh*d(q);q?x.lineTo(GX+q,yy):x.moveTo(GX,yy)}x.stroke();x.fillStyle=Y;x.beginPath();x.arc(GX+gw,ay+H*.1-gh*now,8,0,TAU);x.fill();return}
 // distance view: frozen snapshot, particles strip under graph, zoom box at left
 const k=TAU/(GW/2),by=H*.1,bh=H*.45,cx=C?GW/4:R?GW/2:-1,col=C?Y:CY;
 if(cx>=0){x.fillStyle=C?'rgba(232,200,114,.14)':'rgba(111,183,201,.14)';x.fillRect(X0+cx-GW*.09,H*.08,GW*.18,H*.82)}
 x.strokeStyle=G;x.lineWidth=2;x.strokeRect(W*.02,by,bw,bh);
 if(cx<0){txt(x,'Pick COMPRESSION, RAREFACTION,',W*.02+bw/2,by+bh/2-8,W/48,'#6c7f73','center');txt(x,'CREST or TROUGH',W*.02+bw/2,by+bh/2+22,W/48,'#6c7f73','center')}
 else{const cols=C?9:4,rows=C?6:4;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){x.fillStyle=col;x.beginPath();x.arc(W*.02+bw*(i+.5)/cols+Math.sin(wt*5+i+j)*2,by+bh*(j+.5)/rows,W/120,0,TAU);x.fill()}
  txt(x,C?'COMPRESSION':'RAREFACTION',W*.02+bw/2,by-8,W/36,col,'center');txt(x,C?'HIGHER DENSITY':'LOWER DENSITY',W*.02+bw/2,by+bh+W/36,W/40,col,'center');
  const L=C?['crowded particles','higher density','graph rises']:['spread-out particles','lower density','graph falls'];L.forEach((q,i)=>{if(kt>i*.5||kt>2){txt(x,(i?'↓ ':'')+q,W*.02+bw/2,H*.72+i*H*.07,W/46,INK,'center')}});
  x.setLineDash([6,5]);arrow(x,W*.02+bw,by+bh/2,X0+cx-GW*.09,by+bh/2,col);x.setLineDash([]);
  txt(x,s=='crest'?'CREST = maximum density = particles most closely packed':s=='trough'?'TROUGH = minimum density = particles most spread out':C?'above average density = more crowded':'below average density = more spread out',X0+GW/2,H*.045,W/42,col,'center')}
 ln(x,X0,H*.1,X0,H*.65,INK);ln(x,X0,ay,X0+GW,ay,'rgba(0,0,0,0)');ln(x,X0,H*.65,X0+GW,H*.65,INK);txt(x,'DISTANCE FROM THE SOURCE →',X0+GW,H*.7,W/50,INK,'right');
 x.save();x.translate(X0-10,H*.4);x.rotate(-Math.PI/2);txt(x,'DENSITY',0,0,W/46,INK,'center');x.restore();
 x.strokeStyle=G;dash(x,()=>{x.beginPath();x.moveTo(X0,ay);x.lineTo(X0+GW,ay);x.stroke()});txt(x,'average density',X0+GW,ay-6,W/55,G,'right');txt(x,'above average = more crowded',X0+GW*.02,ay-gh-10,W/55,INK);txt(x,'below average = more spread out',X0+GW*.02,ay+gh+22,W/55,INK);
 x.strokeStyle=Y;x.lineWidth=4;x.beginPath();for(let q=0;q<=GW;q+=3){const yy=ay+gh*Math.cos(k*q);q?x.lineTo(X0+q,yy):x.moveTo(X0,yy)}x.stroke();
 if(s=='crest'||s=='trough'){x.fillStyle=col;x.beginPath();x.arc(X0+cx,ay+(C?-gh:gh),10,0,TAU);x.fill()}
 field(x,X0,H*.75,GW,H*.1,3,44,1,0,1e9,W/260,null,2);txt(x,'particles in the medium (same positions as the graph)',X0,H*.89,W/55,G);
 txt(x,'Each point on the graph = the density of the medium at that position.',W*.02,H*.93,W/55,INK);txt(x,'Graph height ≠ particle height. The air does NOT move up and down.',W*.02,H*.99,W/48,Y)};
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1e3);last=n;if(S.play&&cur!=7)wt+=dt*(cur==6?2:1.6);const f=scenes[cur+1],c=$('canvas',slides[cur]);if(f&&c&&c.x)f(c.x,c.W,c.H,dt);requestAnimationFrame(loop)}
fitAll();acts.mode('before',$('[data-a="mode:before"]'));const h=+location.hash.slice(1);go(h>0&&h<=slides.length?h-1:0);requestAnimationFrame(loop);
