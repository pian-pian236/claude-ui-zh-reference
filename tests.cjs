const {_electron}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
const packaged=process.argv[2];
const screenshots=path.join(__dirname,'qa');fs.mkdirSync(screenshots,{recursive:true});
async function launch(){return _electron.launch({executablePath:packaged||require('electron'),args:packaged?['--test']:[__dirname,'--test'],env,timeout:60000})}
(async()=>{
 let app=await launch(),page=await app.firstWindow(),errors=[],warnings=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')warnings.push(m.text())});
 await page.waitForSelector('#prompt');
 const click=async action=>{await page.locator('[data-action="'+action+'"]').first().click()};
 const open=async kind=>{await page.evaluate(k=>openModal(k),kind);await page.locator('[role=dialog]').waitFor()};
 const escape=async()=>{await page.keyboard.press('Escape');assert.equal(await page.locator('[role=dialog],.popover').count(),0)};
 assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
 assert.equal(await page.locator('#prompt').inputValue(),'');
 await page.screenshot({path:path.join(screenshots,'01-cowork-zh.png')});
 await page.locator('[data-action="page:projects"]').hover();await page.waitForTimeout(550);
 assert.equal(await page.locator('#tooltip').textContent(),'Projects');
 await click('page:projects');await click('language');
 assert.match(await page.locator('.page-heading h1').textContent(),/Projects/);
 await click('language');await click('modal:project');
 await page.locator('#field-projectName').fill('<img src=x onerror=alert(1)>');
 await click('language');assert.equal(await page.locator('#field-projectName').inputValue(),'<img src=x onerror=alert(1)>');
 assert.equal(await page.locator('.dialog img').count(),0);await click('language');await escape();
 for(const p of ['artifacts','scheduled','customize','tasks']){await click('page:'+p);assert.ok(await page.locator('.page-heading h1').textContent())}
 await click('mode:code');await page.screenshot({path:path.join(screenshots,'02-code-zh.png')});
 await click('menu:permission');await click('permission:planMode');assert.equal(await page.evaluate(()=>state.values.permission),'planMode');
 await click('menu:model');await click('model:Opus 5.5');assert.match(await page.locator('.model-button').textContent(),/Opus/);
 await click('menu:model');await click('effort:high');assert.match(await page.locator('.model-button').textContent(),/高/);
 await page.locator('#prompt').fill('echo hi');await click('simulate:send');assert.match(await page.locator('#dialog-title').textContent(),/演示/);await escape();
 assert.equal(await page.locator('.empty-sidebar').textContent(),'暂无任务');
 const categories=await page.evaluate(()=>settingsList.map(a=>a[0]));
 for(const category of categories){
  await page.evaluate(k=>navigate('settings',k),category);
  assert.ok((await page.locator('.settings-panel').textContent()).length>60,category);
  await click('language');assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await click('language');
 }
 await page.evaluate(()=>navigate('settings','general'));
 await click('toggle:launchAtLogin');assert.equal(await page.locator('[data-action="toggle:launchAtLogin"]').getAttribute('aria-checked'),'true');
 await page.evaluate(()=>navigate('settings','coworkSettings'));
 await page.screenshot({path:path.join(screenshots,'03-settings-zh.png')});
 await page.evaluate(()=>navigate('settings','account'));
 await page.locator('[data-setting=fullName]').fill('临时名称');
 await click('language');assert.equal(await page.locator('[data-setting=fullName]').inputValue(),'临时名称');await click('language');
 for(const kind of ['simulation','project','schedule','artifact','folder','files','connector','skill','plugin','extension','code-project','environment','preferences','domains','config','logs','search','dictionary','guide','licenses','reset']){
  await open(kind);assert.ok(await page.locator('#dialog-title').textContent(),kind);
  await page.keyboard.press('Tab');assert.ok(await page.locator('.dialog').evaluate(el=>el.contains(document.activeElement)),kind);
  await escape();
 }
 await open('dictionary');await page.locator('#dictionary-search').fill('权限');
 assert.ok(await page.locator('.finder-results button').count());await page.screenshot({path:path.join(screenshots,'04-glossary.png')});
 await escape();
 for(const menu of ['native','account','attach','model','permission','filter','sort']){
  await page.evaluate(kind=>{state.popover={kind,x:40,y:80};renderPopover()},menu);
  assert.ok(await page.locator('.popover button').count());await escape();
 }
 for(const tab of ['file','edit','view','go','developer','help']){
  await page.evaluate(t=>{state.values.nativeTab=t;state.popover={kind:'native',x:40,y:80};renderPopover()},tab);
  assert.ok(await page.locator('.menu-body button').count());await escape();
 }
 const security=await page.evaluate(async()=>{
  let denied=false;try{await fetch('https://example.com')}catch{denied=true}
  return {denied,node:typeof require,process:typeof process,api:Object.keys(window.desktop),sw:typeof navigator.serviceWorker};
 });
 assert.equal(security.denied,true);assert.equal(security.node,'undefined');assert.equal(security.process,'undefined');assert.deepEqual(security.api.sort(),['control','onMaximize']);
 assert.equal(await app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];const p=w.webContents.getLastWebPreferences();return p.sandbox&&!p.nodeIntegration&&p.contextIsolation}),true);
 const server=require('node:http').createServer((_q,res)=>res.end('unexpected'));let hits=0;server.on('request',()=>hits++);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const denied=await app.evaluate(async({BrowserWindow},port)=>{
  try{await BrowserWindow.getAllWindows()[0].webContents.session.fetch('http://127.0.0.1:'+port);return false}catch{return true}
 },server.address().port);server.close();const intercepted={denied,hits};
 assert.deepEqual(intercepted,{denied:true,hits:0});
 await page.evaluate(()=>navigate('settings','general'));
 await page.locator('[data-setting=displayLanguage]').selectOption('en');
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.screenshot({path:path.join(screenshots,'05-settings-en.png')});
 await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].setSize(1000,700));
 await page.waitForTimeout(250);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.locator('.settings-panel').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
 await page.screenshot({path:path.join(screenshots,'06-compact.png')});
 await open('reset');await click('reset-confirm');assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');assert.equal(await page.locator('#prompt').inputValue(),'');
 assert.deepEqual(errors,[]);assert.deepEqual(warnings.filter(w=>!w.includes('Content Security Policy')&&!w.includes('connect-src')&&!w.includes('Failed to fetch')),[]);
 await page.locator('#prompt').fill('不应保存的输入');await click('language');await app.close();
 app=await launch();page=await app.firstWindow();await page.waitForSelector('#prompt');
 assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');assert.equal(await page.locator('#prompt').inputValue(),'');
 await app.close();
 const report={passed:true,categories:categories.length,dialogs:21,menus:7,offlineRequestBlocked:intercepted.hits===0,security,screenshots:'qa',rendererErrors:errors};
 fs.writeFileSync(path.join(screenshots,packaged?'packaged-test.json':'test-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;setTimeout(()=>process.exit(1),1000)});
