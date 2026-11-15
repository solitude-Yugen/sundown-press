import { initNavigation } from './navigation.js';
initNavigation();
const filename = location.pathname.split('/').pop();
document.querySelectorAll('.nav-link,.mobile-link').forEach(link => {
  if (link.getAttribute('href') === filename) link.setAttribute('aria-current','page');
});
const contact = document.querySelector('#contact-form');
contact?.addEventListener('submit', e => {
  e.preventDefault();
  const fields = new FormData(contact);
  const subject = `${fields.get('service')} enquiry — ${fields.get('name')}`;
  const body = `Name: ${fields.get('name')}\nEmail: ${fields.get('email')}\n\n${fields.get('message')}`;
  location.href = `mailto:hello@sundownpress.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
const form = document.querySelector('#design-form');
if (form) {
  const kind = document.querySelector('main').dataset.kind;
  const storageKey = `sundown-studio-${kind}`;
  const themes = {evergreen:{paper:'#103c3a',ink:'#ead6a3',accent:'#bd944c'},rose:{paper:'#ecd9d6',ink:'#642d3b',accent:'#9c6671'},ivory:{paper:'#fbf6e9',ink:'#234c43',accent:'#ab894b'}};
  let theme = 'evergreen';
  const initial = Object.fromEntries(new FormData(form));
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) {
      if (themes[saved.theme]) theme = saved.theme;
      for (const [key,value] of Object.entries(saved.fields || {})) {
        const input = form.elements.namedItem(key);
        if (input && typeof value === 'string') input.value = value;
      }
    }
  } catch { /* Draft storage may be unavailable in private browsing. */ }
  const ns = 'http://www.w3.org/2000/svg';
  function element(tag, attributes, text) {
    const el = document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attributes)) el.setAttribute(key,String(value));
    if(text !== undefined) el.textContent=text;
    return el;
  }
  function wrap(text, max=30) {
    const lines=[''];
    for (const word of text.split(/\s+/)) {
      if ((lines.at(-1)+' '+word).trim().length > max && lines.at(-1)) lines.push(word);
      else lines[lines.length-1] = (lines.at(-1)+' '+word).trim();
    }
    return lines;
  }
  function render() {
    const fields = Object.fromEntries(new FormData(form));
    const {paper,ink,accent}=themes[theme];
    const height = fields.format === 'square' ? 750 : 1050;
    const booth = kind === 'booth';
    const svg = element('svg',{xmlns:ns,viewBox:`0 0 750 ${height}`,width:'750',height,role:'img','aria-label':`${fields.names || 'Your design'} preview`});
    svg.append(element('title',{},fields.names || 'Your design'));
    // A cutout keeps booth downloads usable as an overlay on a photograph.
    if(booth){
      const defs=element('defs',{}),mask=element('mask',{id:'photo-cutout'});
      mask.append(element('rect',{width:750,height,fill:'white'}),element('rect',{x:75,y:165,width:600,height:height-400,rx:100,fill:'black'}));
      defs.append(mask);svg.append(defs,element('rect',{width:750,height,fill:paper,mask:'url(#photo-cutout)'}));
    }else svg.append(element('rect',{width:750,height,fill:paper}));
    svg.append(element('rect',{x:30,y:30,width:690,height:height-60,rx:booth?35:170,fill:'none',stroke:accent,'stroke-width':2}));
    function text(value,y,size=25,color=ink){svg.append(element('text',{x:375,y,'text-anchor':'middle',fill:color,'font-family':'Georgia, serif','font-size':size},value));}
    text('SUNDOWN PRESS',booth?90:95,15,accent);
    text(booth ? fields.occasion.toUpperCase() : '✦',booth?135:175,booth?18:38,accent);
    if(booth) {
      const lines=wrap(fields.names,28).slice(0,3);
      lines.forEach((line,i)=>text(line,height-190+i*35,32));
      text(fields.message.length > 60 ? fields.message.slice(0,57) + '…' : fields.message,height-38,14,accent);
    }else{
      text(fields.occasion.toUpperCase(),height*.29,19,accent);
      const names=wrap(fields.names || 'Your celebration',24);
      names.forEach((line,i)=>text(line,height*.40+i*58,48));
      wrap(fields.message,38).slice(0,5).forEach((line,i)=>text(line,height*.58+i*29,23));
    }
    let date='';
    if(fields.date) date=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date(fields.date+'T12:00:00'));
    text([date,fields.time].filter(Boolean).join(' · '),height-105,21);
    wrap(fields.venue,48).slice(0,2).forEach((line,i)=>text(line,height-69+i*23,19));
    document.querySelector('#design-preview').replaceChildren(svg);
    document.querySelectorAll('[data-theme]').forEach(button=>{
      const selected=button.dataset.theme===theme;
      button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
    });
    try {localStorage.setItem(storageKey,JSON.stringify({theme,fields}));} catch { /* The editor also works without storage. */ }
  }
  document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{theme=button.dataset.theme;render();}));
  form.addEventListener('input',render);
  form.addEventListener('change',render);
  document.querySelector('#reset-design').addEventListener('click',()=>{
    for(const [key,value] of Object.entries(initial)) form.elements.namedItem(key).value=value;
    theme='evergreen';render();document.querySelector('#studio-status').textContent='Your design has been reset.';
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const content = new XMLSerializer().serializeToString(document.querySelector('#design-preview svg'));
    const url = URL.createObjectURL(new Blob([content],{type:'image/svg+xml;charset=utf-8'}));
    const link = document.createElement('a');link.href=url;link.download=`sundown-${kind}.svg`;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    document.querySelector('#studio-status').textContent='Your design has been downloaded.';
  });
  render();
}
