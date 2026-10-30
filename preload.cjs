const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{
  control:action=>{if(['minimize','maximize','close'].includes(action))ipcRenderer.send('window-action',action)},
  onMaximize:fn=>ipcRenderer.on('window-state',(_event,value)=>fn(value))
});
