'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const manifest=require('./release-manifest.cjs'),root=__dirname,pkg=require('./package.json');
const output=path.resolve(process.argv[2]||path.join(root,'dist','portable'));
if(fs.existsSync(output)&&fs.readdirSync(output).length)throw new Error('Output already exists; choose a new folder: '+output);
cp.execFileSync(process.execPath,[path.join(root,'audit-release.cjs')],{stdio:'inherit'});
function copyTree(source,target){fs.mkdirSync(target,{recursive:true});for(const item of fs.readdirSync(source,{withFileTypes:true})){if(item.name==='default_app.asar')continue;const src=path.join(source,item.name),dest=path.join(target,item.name);if(item.isDirectory())copyTree(src,dest);else if(item.isFile())fs.copyFileSync(src,dest);else throw new Error('Unsupported file: '+src)}}
const dist=path.dirname(require('electron'));
if(!fs.existsSync(path.join(dist,'electron.exe')))throw new Error('Electron runtime is not installed.');
fs.mkdirSync(output,{recursive:true});
copyTree(dist,path.join(output,'runtime'));
fs.renameSync(path.join(output,'runtime','electron.exe'),path.join(output,'runtime','ClaudeReference.exe'));
const app=path.join(output,'runtime','resources','app');fs.mkdirSync(app,{recursive:true});
for(const file of manifest.app)fs.copyFileSync(path.join(root,file),path.join(app,file));
for(const file of manifest.assets){const dest=path.join(app,'assets',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,'assets',file),dest)}
for(const file of manifest.notices){fs.copyFileSync(path.join(root,file),path.join(output,file));fs.copyFileSync(path.join(root,file),path.join(app,file))}
fs.writeFileSync(path.join(app,'package.json'),JSON.stringify({name:pkg.name,productName:'界面对照 · 非官方 Claude 学习参考',version:pkg.version,license:pkg.license,main:'main.cjs'},null,2));
fs.copyFileSync(path.join(root,'README.md'),path.join(output,'使用说明.md'));
fs.copyFileSync(path.join(root,'PUBLISHING.md'),path.join(output,'发布说明.md'));
for(const file of ['docs/preview.png']){const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest)}
const csc=path.join(process.env.WINDIR,'Microsoft.NET','Framework64','v4.0.30319','csc.exe');
cp.execFileSync(csc,['/nologo','/target:winexe','/optimize+','/utf8output','/reference:System.Windows.Forms.dll','/win32icon:'+path.join(root,'assets','reference.ico'),'/out:'+path.join(output,'Claude中文对照.exe'),path.join(root,'Launcher.cs')],{stdio:'inherit'});
cp.execFileSync(process.execPath,[path.join(root,'audit-release.cjs'),output],{stdio:'inherit'});
console.log('Built: '+output);
