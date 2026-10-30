'use strict';
let tooltipTimer,restoreFocus;
function hideTooltip(){clearTimeout(tooltipTimer);$('#tooltip').hidden=true}
function closeOverlay(){state.modal=null;state.popover=null;$('#overlay-root').innerHTML='';hideTooltip();if(restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true})}
function openModal(kind){restoreFocus=document.activeElement;state.popover=null;state.modal=kind;hideTooltip();renderModal()}
function openMenu(kind,anchor){if(state.popover?.kind===kind){closeOverlay();return}restoreFocus=anchor;const r=anchor.getBoundingClientRect();state.modal=null;state.popover={kind,x:r.left,y:kind==='account'?r.top-210:r.bottom+6};hideTooltip();renderPopover()}
function switchLanguage(){state.lang=state.lang==='zh'?'en':'zh';delete state.values.displayLanguage;hideTooltip();render()}
function moveHistory(back){const from=back?state.history:state.future,to=back?state.future:state.history;if(!from.length)return;to.push({page:state.page,setting:state.setting,mode:state.mode});Object.assign(state,from.pop(),{modal:null,popover:null});render()}
function findLabel(key){
 const groups={general:['launchAtLogin','closeToTray','quickEntry','spellcheck','displayLanguage','startupMode','resetDemo'],account:['fullName','email','organization','plan','profilePrefs','billing'],appearance:['theme','font','fontSize','zoom','sidebarDensity','reduceMotion'],notifications:['desktopNotifications','taskComplete','permissionNeeded','scheduledReminders','sounds'],privacy:['modelImprovement','incognito','analytics','exportData','deleteChats','deleteAccount'],capabilities:['webSearch','codeExecution','artifacts','memory','computerUse'],connectors:['browseConnectors','customConnector','connectorName','connectorUrl'],coworkSettings:['folderAccess','workspaceStatus','restartWorkspace','reinstallWorkspace','networkPolicy','allowedDomains'],codeSettings:['localProject','defaultEnvironment','defaultPermission','modelDefault','gitIntegration','terminalFont'],developer:['developerMode','localMcp','editConfig','viewLogs','openLogs'],about:['version','referenceVersion','licenses']};
 const found=Object.keys(groups).find(g=>g===key||groups[g].some(k=>key===k||key===k+'Desc'));
 if(found)navigate('settings',found);else if(settingsList.some(([k])=>k===key))navigate('settings',key);else if(['home','projects','artifacts','scheduled','customize','tasks'].includes(key))navigate(key);else{navigate('home');showToast(key)}
 const target=Array.from(document.querySelectorAll('[data-zh]')).find(el=>el.dataset.zh===dict[key]?.[0]);if(target){target.scrollIntoView({block:'center'});target.classList.add('found-label');setTimeout(()=>target.classList.remove('found-label'),2200)}
}
const initialTrue=new Set(['webSearch','desktopNotifications','taskComplete','permissionNeeded','scheduledReminders','closeToTray','spellcheck','gitIntegration','codeExecution','artifacts']);
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');
 if(!button){if(event.target.dataset.backdrop||state.popover&&!event.target.closest('.popover'))closeOverlay();return}
 if(button.disabled)return;const action=button.dataset.action,split=action.indexOf(':'),type=split<0?action:action.slice(0,split),value=split<0?'':action.slice(split+1);hideTooltip();
 switch(type){
 case 'window':window.desktop?.control(value);break;
 case 'language':switchLanguage();break;
 case 'sidebar':state.sidebar=!state.sidebar;render();break;
 case 'activity':state.activity=!state.activity;render();break;
 case 'back':moveHistory(true);break;
 case 'forward':moveHistory(false);break;
 case 'page':if(value==='home')state.prompt='';navigate(value);break;
 case 'setting':navigate('settings',value);break;
 case 'mode':state.mode=value;state.prompt='';navigate('home');break;
 case 'modal':openModal(value);break;
 case 'menu':openMenu(value,button);break;
 case 'close-overlay':closeOverlay();break;
 case 'simulate':openModal('simulation');break;
 case 'native-tab':state.values.nativeTab=value;renderPopover();break;
 case 'tab':{const [group,tab]=value.split(':');state.values['tab-'+group]=tab;render();break}
 case 'toggle':{state.values[value]=!(state.values[value]??initialTrue.has(value));const pos=button.closest('.settings-panel')?.scrollTop;render();if(pos!=null)$('.settings-panel').scrollTop=pos;break}
 case 'model':state.model=value;state.popover=null;render();break;
 case 'effort':state.effort=value[0].toUpperCase()+value.slice(1);state.popover=null;render();break;
 case 'permission':state.values.permission=value;state.popover=null;render();break;
 case 'group':case 'sort':state.values[type]=value;state.popover=null;render();break;
 case 'suggestion':state.prompt=tr(value);render();$('#prompt')?.focus();break;
 case 'demo-save':closeOverlay();showToast('demoNotice');break;
 case 'reset-confirm':Object.assign(state,{lang:'zh',mode:'cowork',page:'home',setting:'general',sidebar:true,activity:false,model:'Sonnet 5.5',effort:'Medium',prompt:'',values:{},history:[],future:[],modal:null,popover:null});document.documentElement.style.zoom=1;delete document.body.dataset.font;delete document.body.dataset.density;delete document.body.dataset.size;render();break;
 case 'find':findLabel(value);break;
 case 'zoom':state.values.zoom=value;document.documentElement.style.zoom=Number(value)/100;closeOverlay();break;
 }
});
document.addEventListener('input',event=>{
 const el=event.target;if(el.id==='prompt'){state.prompt=el.value;$('.send').disabled=!el.value.trim()}
 if(el.dataset.draft)state.values['draft-'+el.dataset.draft]=el.value;
 if(el.dataset.setting&&el.tagName==='INPUT')state.values[el.dataset.setting]=el.value;
 if(el.id==='dictionary-search')$('.finder-results').innerHTML=dictionaryResults(el.value);
});
document.addEventListener('change',event=>{
 const key=event.target.dataset.setting;if(!key)return;
 if(key==='displayLanguage'){state.lang=event.target.value;delete state.values.displayLanguage;render();return}
 state.values[key]=event.target.value;
 if(key==='zoom')document.documentElement.style.zoom=Number(event.target.value)/100;
 if(key==='font')document.body.dataset.font=event.target.value;
 if(key==='sidebarDensity')document.body.dataset.density=event.target.value;
 if(key==='fontSize')document.body.dataset.size=event.target.value;
});
document.addEventListener('submit',event=>event.preventDefault());
document.addEventListener('dragover',event=>event.preventDefault());
document.addEventListener('drop',event=>{event.preventDefault();openModal('simulation')});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){closeOverlay();return}
 if(event.ctrlKey&&event.shiftKey&&event.key.toLowerCase()==='l'){event.preventDefault();switchLanguage();return}
 if(event.ctrlKey&&!event.shiftKey){
  const key=event.key.toLowerCase(),commands={n:()=>{state.prompt='';navigate('home')},',':()=>navigate('settings','general'),k:()=>openModal('search'),b:()=>{state.sidebar=!state.sidebar;render()},'/':()=>$('#prompt')?.focus()};
  if(commands[key]){event.preventDefault();commands[key]();return}
 }
 if(event.altKey&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();moveHistory(event.key==='ArrowLeft');return}
 if(event.key==='Enter'&&event.target.id==='prompt'&&!event.shiftKey){event.preventDefault();if(state.prompt.trim())openModal('simulation')}
 const overlay=$('.dialog')||$('.popover');if(!overlay)return;
 const focusable=Array.from(overlay.querySelectorAll('button:not(:disabled),input,textarea,select,[tabindex="0"]')).filter(el=>el.getClientRects().length);
 if(event.key==='Tab'&&focusable.length){const i=focusable.indexOf(document.activeElement);if(event.shiftKey&&i<=0){event.preventDefault();focusable.at(-1).focus()}else if(!event.shiftKey&&(i<0||i===focusable.length-1)){event.preventDefault();focusable[0].focus()}}
 if($('.popover')&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();const i=focusable.indexOf(document.activeElement);focusable[(i+(event.key==='ArrowDown'?1:-1)+focusable.length)%focusable.length]?.focus()}
});
function revealTooltip(target){
 hideTooltip();const el=target.closest?.('[data-zh][data-en]');if(!el)return;
 tooltipTimer=setTimeout(()=>{if(!el.isConnected)return;const tip=$('#tooltip'),r=el.getBoundingClientRect();tip.textContent=state.lang==='zh'?el.dataset.en:el.dataset.zh;tip.hidden=false;tip.style.left=Math.max(8,Math.min(r.left,innerWidth-tip.offsetWidth-10))+'px';tip.style.top=(r.bottom+tip.offsetHeight+14>innerHeight?Math.max(8,r.top-tip.offsetHeight-8):r.bottom+8)+'px'},450);
}
document.addEventListener('mouseover',event=>revealTooltip(event.target));
document.addEventListener('mouseout',hideTooltip);
document.addEventListener('focusin',event=>revealTooltip(event.target));
document.addEventListener('focusout',hideTooltip);
window.addEventListener('resize',()=>{hideTooltip();if(state.popover)closeOverlay()});
render();
