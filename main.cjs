const { app, BrowserWindow, ipcMain, Menu, session } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
app.setName('界面对照 · 非官方 Claude 学习参考');
app.setPath('userData', path.join(os.tmpdir(), 'claude-reference-' + process.pid));
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-background-networking');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-sync');
let win;
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const root=path.resolve(__dirname);
  const localURL=require('url').pathToFileURL(root+path.sep).href;
  const ses=session.fromPartition('reference-'+process.pid,{cache:false});
  ses.webRequest.onBeforeRequest((details,callback)=>{
    const allowed=details.url.startsWith(localURL)&&!details.url.includes('..');
    callback({cancel:!allowed});
  });
  ses.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
  ses.setPermissionCheckHandler(()=>false);
  ses.on('will-download',(event)=>event.preventDefault());
  win=new BrowserWindow({
    width:1280,height:860,minWidth:900,minHeight:620,frame:false,
    backgroundColor:'#faf9f5',show:false,title:'界面对照 · 非官方 Claude 中文学习参考',icon:path.join(__dirname,'assets','reference.ico'),
    autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),session:ses,
      nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,
      spellcheck:false,devTools:process.argv.includes('--test')}
  });
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  win.webContents.on('will-attach-webview',event=>event.preventDefault());
  win.webContents.on('before-input-event',(event,input)=>{
    if(input.key==='F12'||input.control&&input.shift&&['I','J','C'].includes(input.key.toUpperCase()))event.preventDefault();
  });
  ipcMain.on('window-action',(event,action)=>{
    if(event.sender!==win.webContents||event.senderFrame!==win.webContents.mainFrame)return;
    if(action==='minimize')win.minimize();
    if(action==='maximize')win.isMaximized()?win.unmaximize():win.maximize();
    if(action==='close')win.close();
  });
  win.on('maximize',()=>win.webContents.send('window-state',true));
  win.on('unmaximize',()=>win.webContents.send('window-state',false));
  win.once('ready-to-show',()=>win.show());
  win.loadFile(path.join(__dirname,'index.html'));
});
app.on('window-all-closed',()=>app.quit());
