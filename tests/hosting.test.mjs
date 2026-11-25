import test from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import {readFile} from 'node:fs/promises';
import {resolveAssetPath} from '../server.mjs';

for(const [platform,api,root] of [['Linux',path.posix,'/var/task/dist'],['Windows',path.win32,'C:\\app\\dist']]){
  test(`${platform}: index, stylesheet and entry module resolve inside dist`,()=>{
    for(const [url,file] of [['/','index.html'],['/style.css','style.css'],['/app.mjs','app.mjs']]){
      assert.equal(resolveAssetPath(root,url,api),api.join(root,file));
    }
    assert.throws(()=>resolveAssetPath(root,'/../secret.txt',api));
    assert.throws(()=>resolveAssetPath(root,'/%2e%2e/secret.txt',api));
    if(platform==='Windows')assert.throws(()=>resolveAssetPath(root,'/..%5csecret.txt',api));
  });
}

test('Vercel serves dist statically and gives ES modules a JavaScript MIME type',async()=>{
  const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.equal(config.framework,null);
  assert.equal(config.outputDirectory,'dist');
  assert.equal(config.buildCommand,'');
  assert.ok(config.headers.some(h=>h.source.endsWith('.mjs')&&h.headers.some(v=>v.key==='Content-Type'&&v.value.startsWith('text/javascript'))));
  const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  for(const [,asset] of index.matchAll(/(?:href|src)="([^"#]+\.(?:css|mjs|svg))"/g)){
    assert.ok((await readFile(new URL('../dist/'+asset,import.meta.url))).byteLength>0,asset);
  }
});
