import {mkdir,writeFile,stat,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {ANIMATIONS} from '../dist/animation-manifest.mjs';
import {defaultCast,SUPPORT,modelSheet,babyModelSheet} from '../dist/characters.mjs';
import {sceneArtwork,sceneBeats} from '../dist/story-scenes.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),cast=defaultCast();
await mkdir(root+'/dist/assets/animations',{recursive:true});
await mkdir(root+'/dist/assets/posters',{recursive:true});
await mkdir(root+'/dist/assets/characters',{recursive:true});
for(const a of ANIMATIONS){await writeFile(root+'/dist/'+a.source,sceneArtwork(a,cast,{background:'../settings/'+a.environmentId+'.jpg',twins:a.id==='pregnancy_twins_reveal'}));const data=(await readFile(root+'/dist/assets/settings/'+a.environmentId+'.jpg')).toString('base64');await writeFile(root+'/dist/'+a.poster,sceneArtwork(a,cast,{background:'data:image/jpeg;base64,'+data,twins:a.id==='pregnancy_twins_reveal'}));}
for(const [id,c] of Object.entries({player:cast.player,partner:cast.partner,...SUPPORT}))await writeFile(root+`/dist/assets/characters/${id}-model-sheet.svg`,modelSheet(c,id));
await writeFile(root+'/dist/assets/characters/babies-model-sheet.svg',babyModelSheet());
await writeFile(root+'/dist/assets/animation-manifest.json',JSON.stringify(ANIMATIONS,null,2)+'\n');
await writeFile(root+'/dist/assets/storyboards.json',JSON.stringify(ANIMATIONS.map(a=>({id:a.id,environment:a.environmentId,cast:a.characterIds,frames:sceneBeats(a,cast),durationMs:a.durationMs,staticFallback:a.fallbackScene})),null,2)+'\n');
const assets=await Promise.all(ANIMATIONS.map(async a=>({id:a.id,sourceBytes:(await stat(root+'/dist/'+a.source)).size,posterBytes:(await stat(root+'/dist/'+a.poster)).size,settingBytes:(await stat(root+'/dist/assets/settings/'+a.environmentId+'.jpg')).size,durationMs:a.durationMs})));
const backgroundBytes=(await stat(root+'/dist/assets/storybook-settings.jpg')).size;
await writeFile(root+'/dist/assets/asset-sizes.json',JSON.stringify({measuredAt:'2026-11-26',backgroundBytes,assets,totalUniqueSceneBytes:assets.reduce((n,a)=>n+a.sourceBytes,backgroundBytes),sourceSvgBytes:assets.reduce((n,a)=>n+a.sourceBytes,0),posterBytes:assets.reduce((n,a)=>n+a.posterBytes,0),settingBytes:(await Promise.all(['home','clinic','showroom','apartment'].map(async id=>(await stat(root+'/dist/assets/settings/'+id+'.jpg')).size))).reduce((n,v)=>n+v,0),note:'Encoded file sizes, not a network-speed or playback guarantee. Runtime uses the shared rig and one cached atlas; model sheets are not loaded by gameplay.'},null,2)+'\n');
console.log(JSON.stringify({scenes:ANIMATIONS.length,characterSheets:3+Object.keys(SUPPORT).length,backgroundBytes,maxSceneBytes:Math.max(...assets.map(a=>a.sourceBytes)),totalUniqueSceneBytes:assets.reduce((n,a)=>n+a.sourceBytes,backgroundBytes)}));
