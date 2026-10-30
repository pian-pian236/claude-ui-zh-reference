'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=__dirname,output=path.resolve(process.argv[2]||path.join(root,'dist','claude-ui-zh-reference'));
if(fs.existsSync(output)&&fs.readdirSync(output).length)throw new Error('Choose an empty source output folder');
cp.execFileSync(process.execPath,[path.join(root,'audit-release.cjs')],{stdio:'inherit'});
for(const file of require('./release-manifest.cjs').source){
 const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);
}
console.log('Clean GitHub source: '+output);
