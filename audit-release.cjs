'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const manifest=require('./release-manifest.cjs');
const source=__dirname,target=process.argv[2]?path.resolve(process.argv[2]):null;
const banned=/\.(?:woff2?|ttf|otf|asar|vhdx|log)$/i;
const privateText=/C:[\\/]+Users[\\/]+Administrator|coworkEgressAllowedHosts|claude_desktop_config|cc27851ad|c66fc489e|@font-face|AnthropicSerif/;
function inventory(dir){const files=[];for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.isSymbolicLink())throw new Error('Symlink disallowed: '+item.name);if(item.isDirectory())files.push(...inventory(path.join(dir,item.name)).map(p=>item.name+'/'+p));else files.push(item.name)}return files.sort()}
for(const file of manifest.source){
 assert.ok(fs.existsSync(path.join(source,file)),'Missing release source: '+file);
 assert.ok(!banned.test(file),'Private asset: '+file);
 if(/\.(?:cjs|js|json|md|css|html|cs|yml|svg)$/.test(file)&&file!=='audit-release.cjs'){
  const text=fs.readFileSync(path.join(source,file),'utf8');
  assert.ok(!privateText.test(text),'Private path or extracted font reference in '+file);
 }
}
assert.deepEqual(inventory(path.join(source,'assets')),manifest.assets.slice().sort(),'Unexpected source assets');
assert.ok(!fs.readFileSync(path.join(source,'app.js'),'utf8').includes('function sun('),'Old brand mark');
if(target){
 const runtime=path.join(target,'runtime'),app=path.join(runtime,'resources','app');
 assert.deepEqual(inventory(path.join(app,'assets')),manifest.assets.slice().sort(),'Unexpected bundled assets');
 const expected=[...manifest.app,...manifest.notices,'package.json',...manifest.assets.map(f=>'assets/'+f)].sort();
 assert.deepEqual(inventory(app),expected,'Unexpected application files');
 for(const file of ['LICENSE','LICENSES.chromium.html'])assert.ok(fs.statSync(path.join(runtime,file)).size>100,'Missing runtime license');
 for(const file of inventory(target))assert.ok(!banned.test(file),'Private asset in release: '+file);
 for(const file of manifest.notices)assert.equal(fs.readFileSync(path.join(target,file),'utf8'),fs.readFileSync(path.join(source,file),'utf8'));
}
console.log('Release audit passed: explicit file lists, system fonts, original icon, notices, no private paths or extracted application assets.');
