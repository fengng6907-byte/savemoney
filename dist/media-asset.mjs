// Optional adapters. This release ships SVG scenes; future movie/sprite files must
// be committed and registered before these adapters are used.
export class SpriteTimeline {
 constructor({columns,rows,frames}){if(!Number.isInteger(columns)||!Number.isInteger(rows)||!Number.isInteger(frames)||columns<1||rows<1||frames<1||frames>columns*rows)throw Error('Invalid sprite layout');Object.assign(this,{columns,rows,frames});}
 position(fraction){const frame=Math.min(this.frames-1,Math.max(0,Math.floor(fraction*this.frames)));return {frame,x:this.columns===1?0:frame%this.columns/(this.columns-1)*100,y:this.rows===1?0:Math.floor(frame/this.columns)/(this.rows-1)*100};}
}
export function mountMediaAsset(asset,container,{still=false}={}){
 const video=!still&&['webm','mp4'].includes(asset.assetType),sprite=!still&&asset.assetType==='sprite';
 const el=document.createElement(video?'video':sprite?'div':'img');el.className='registered-media';el.setAttribute('aria-label',asset.description||asset.fallbackScene);let timer,done=false,resolveReady,rejectReady;
 const ready=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
 const fail=()=>{if(done)return;done=true;clearTimeout(timer);rejectReady(Error('Registered media failed to load'));};
 const loaded=()=>{if(done)return;done=true;clearTimeout(timer);resolveReady();};
 let image,sprites;
 if(video){el.muted=true;el.playsInline=true;el.preload='auto';el.poster=asset.poster;el.loop=asset.loop;el.onloadeddata=loaded;el.onerror=fail;el.src=asset.source;}
 else if(sprite){sprites=new SpriteTimeline(asset.sprite||{});image=new Image();image.onload=loaded;image.onerror=fail;image.src=asset.source;el.style.backgroundImage=`url("${asset.source.replace(/["\\\r\n]/g,'')}")`;el.style.backgroundSize=`${sprites.columns*100}% ${sprites.rows*100}%`;}
 else{el.alt=asset.fallbackScene;el.onload=loaded;el.onerror=fail;el.src=still?asset.poster:asset.source;}
 container.querySelector('.story-stage-svg')?.replaceWith(el);timer=setTimeout(fail,8000);
 return {el,ready,video,play(){if(video&&el.paused)el.play().catch(()=>{});},pause(){if(video&&!el.paused)el.pause();},seek(ms){if(video&&Number.isFinite(el.duration))el.currentTime=Math.min(el.duration,ms/1000);if(sprite){const p=sprites.position(ms/asset.durationMs);el.style.backgroundPosition=`${p.x}% ${p.y}%`;}},getTime(){return video?el.currentTime*1000:null;},dispose(){clearTimeout(timer);if(video){el.pause();el.removeAttribute('src');el.load();}if(!done){done=true;rejectReady(Error('Media disposed'));}image=null;el.remove();}};
}
