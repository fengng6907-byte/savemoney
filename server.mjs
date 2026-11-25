import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.webm':'video/webm','.mp4':'video/mp4','.gif':'image/gif','.json':'application/json; charset=utf-8'};

// Use the platform's path rules: Linux uses '/', while Windows uses '\\'.
export function resolveAssetPath(root,pathname,pathApi=path){
  const resolved=pathApi.resolve(root,'.'+decodeURIComponent(pathname));
  const relative=pathApi.relative(root,resolved);
  if(relative==='..'||relative.startsWith('..'+pathApi.sep)||pathApi.isAbsolute(relative))throw Error('Path outside static directory');
  return relative===''?pathApi.join(root,'index.html'):resolved;
}

export function createStaticServer(root=path.resolve('dist')){
  return createServer(async(req,res)=>{
    try{
      const file=resolveAssetPath(root,new URL(req.url,'http://localhost').pathname);
      const content=await readFile(file);
      res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
      res.end(content);
    }catch{
      res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
      res.end('Not found');
    }
  });
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.argv[2]||4173);
  createStaticServer().listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
}
