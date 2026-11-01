const b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);m.querySelector('ul').classList.toggle('open',!o);});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.querySelector('ul').classList.remove('open');b.setAttribute('aria-expanded','false');}));
(function(){
 const L={article:'Articles',podcast:'Podcasts',video:'Videos',talk:'Talks',post:'Posts'};
 const list=document.getElementById('media-list'),empty=document.getElementById('media-empty'),fl=document.querySelector('.filters');
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
   if(!g.length){btn.hidden=true;return;}
   const sec=document.createElement('div');sec.className='media-group';sec.dataset.type=t;
   sec.innerHTML=`<h3>${L[t]} <span class="count">(${g.length})</span></h3><ul class="media-items">`+g.map(i=>`<li class="card"><p class="meta">${esc(i.outlet)}${i.date?' · <time datetime="'+esc(i.date)+'">'+esc(i.date)+'</time>':''}</p><h4><a href="${esc(safe(i.url))}">${esc(i.title)}</a></h4>${i.summary?'<p>'+esc(i.summary)+'</p>':''}</li>`).join('')+'</ul>';
   list.appendChild(sec);
   sec.querySelectorAll('li').forEach((li,n)=>{if(n>=6){li.classList.add('extra');li.hidden=true;}});
  });
  const more=document.getElementById('media-more');
  if(list.querySelector('.extra')){more.hidden=false;more.textContent='Show all '+items.length+' media items';more.addEventListener('click',()=>{list.querySelectorAll('.extra').forEach(x=>x.hidden=false);more.hidden=true;});}
  fl.addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;
   fl.querySelectorAll('.filter').forEach(x=>x.setAttribute('aria-pressed',x===b));
   list.querySelectorAll('.media-group').forEach(g=>g.hidden=!(b.dataset.type==='all'||g.dataset.type===b.dataset.type));});
 });
})();
