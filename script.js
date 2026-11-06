const b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);m.querySelector('ul').classList.toggle('open',!o);});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.querySelector('ul').classList.remove('open');b.setAttribute('aria-expanded','false');}));
(function(){
 const L={article:'Articles',podcast:'Podcasts',video:'Videos',talk:'Talks',post:'Posts',photo:'Photos',mention:'Mentions'};
 const PAGE=8;
 const list=document.getElementById('media-list'),empty=document.getElementById('media-empty'),fl=document.querySelector('.filters');
 const search=document.getElementById('media-search');
 const more=document.getElementById('media-more');
 const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const safe=u=>/^https?:\/\//i.test(u||'')?u:'#';
 fetch('media.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).catch(()=>[]).then(items=>{
  if(!Array.isArray(items))items=[];
  items=items.filter(i=>i&&L[i.type]);
  if(!items.length)return;
  empty.hidden=true;fl.hidden=false;
  Object.keys(L).forEach(t=>{
   const g=items.filter(i=>i.type===t).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
   const btn=fl.querySelector(`[data-type="${t}"]`);
   if(!g.length){if(btn)btn.hidden=true;return;}
   const sec=document.createElement('div');sec.className='media-group';sec.dataset.type=t;
   sec.innerHTML=`<h3>${L[t]} <span class="count">(${g.length})</span></h3><ul class="media-items">`+g.map(i=>{
    const thumb=i.image&&safe(i.image)!=='#'?`<img class="media-thumb" src="${esc(i.image)}" alt="" loading="lazy" decoding="async">`:'';
    const q=[i.title,i.outlet,i.summary,i.date].join(' ').toLowerCase();
    return `<li class="card" data-q="${esc(q)}"><p class="meta">${esc(i.outlet)}${i.date?' · <time datetime="'+esc(i.date)+'">'+esc(i.date)+'</time>':''}</p>${thumb}<h4><a href="${esc(safe(i.url))}">${esc(i.title)}</a></h4>${i.summary?'<p>'+esc(i.summary)+'</p>':''}</li>`;
   }).join('')+'</ul>';
   list.appendChild(sec);
  });
  let shown=PAGE;
  const apply=()=>{
   const q=(search&&search.value||'').trim().toLowerCase();
   const typeBtn=fl.querySelector('.filter[aria-pressed="true"]');
   const type=typeBtn?typeBtn.dataset.type:'all';
   let hiddenExtra=0;
   list.querySelectorAll('.media-group').forEach(g=>{
    const typeOk=type==='all'||g.dataset.type===type;
    let groupShown=0, groupMatch=0;
    g.querySelectorAll('li.card').forEach(li=>{
     const hit=!q||(li.dataset.q||li.textContent.toLowerCase()).includes(q);
     li.classList.toggle('nomatch',!hit);
     if(!hit||!typeOk){li.hidden=true;return;}
     groupMatch++;
     if(groupShown<shown){li.hidden=false;groupShown++;}
     else{li.hidden=true;hiddenExtra++;}
    });
    g.hidden=!typeOk||groupMatch===0;
   });
   if(more){
    if(hiddenExtra){more.hidden=false;more.textContent='Show more ('+hiddenExtra+' remaining)';}
    else{more.hidden=true;}
   }
  };
  if(more) more.addEventListener('click',()=>{shown+=12;apply();});
  fl.addEventListener('click',e=>{const btn=e.target.closest('.filter');if(!btn)return;
   fl.querySelectorAll('.filter').forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));
   shown=PAGE;apply();});
  if(search) search.addEventListener('input',()=>{shown=PAGE;apply();});
  apply();
 });
})();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&b.getAttribute('aria-expanded')==='true'){m.querySelector('ul').classList.remove('open');b.setAttribute('aria-expanded','false');b.focus();}});
