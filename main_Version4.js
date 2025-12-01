const DATA_PATH = 'data/prompts.json';

let allItems = [];

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

async function loadData(){
  try{
    const res = await fetch(DATA_PATH);
    if(!res.ok) throw new Error('Failed to load data');
    allItems = await res.json();
    populateModelFilter();
    render(allItems);
  }catch(err){
    console.error(err);
    document.getElementById('cards').innerHTML = '<p style="color:#f88">Could not load data/prompts.json. Make sure the file exists.</p>';
  }
}

function populateModelFilter(){
  const models = Array.from(new Set(allItems.map(i=>i.model).filter(Boolean)));
  const select = $('#modelFilter');
  models.forEach(m=>{
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  });
}

function render(items){
  const container = $('#cards');
  $('#resultsCount').textContent = `${items.length} result${items.length===1?'':'s'}`;
  container.innerHTML = '';
  if(items.length===0){
    container.innerHTML = '<p style="color:var(--muted)">No results found.</p>';
    return;
  }

  items.forEach(item=>{
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = item.prompt.slice(0,80);
    img.src = item.image || '';

    img.onerror = () => { img.src = item.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="%230b1220"/><text x="50%" y="50%" fill="%239aa4b2" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">No image</text></svg>'; };

    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'card-body';

    const promptEl = document.createElement('div');
    promptEl.className = 'prompt';
    promptEl.textContent = item.prompt;
    body.appendChild(promptEl);

    const meta = document.createElement('div');
    meta.className = 'meta';

    if(item.model){
      const m = document.createElement('span');
      m.className = 'badge';
      m.textContent = item.model;
      meta.appendChild(m);
    }

    if(Array.isArray(item.tags)){
      item.tags.slice(0,6).forEach(t=>{
        const tEl = document.createElement('span');
        tEl.className = 'badge';
        tEl.textContent = `#${t}`;
        meta.appendChild(tEl);
      });
    }

    body.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn small';
    copyBtn.textContent = 'Copy prompt';
    copyBtn.onclick = async () => {
      try{
        await navigator.clipboard.writeText(item.prompt);
        copyBtn.textContent = 'Copied!';
        setTimeout(()=>copyBtn.textContent = 'Copy prompt',1200);
      }catch(e){
        alert('Copy failed — select and copy manually.');
      }
    };
    actions.appendChild(copyBtn);

    if(item.image){
      const openBtn = document.createElement('a');
      openBtn.className = 'btn small';
      openBtn.textContent = 'Open image';
      openBtn.href = item.image;
      openBtn.target = '_blank';
      openBtn.rel = 'noopener noreferrer';
      actions.appendChild(openBtn);
    }

    body.appendChild(actions);

    card.appendChild(body);
    container.appendChild(card);
  });
}

function applyFilters(){
  const q = $('#searchInput').value.trim().toLowerCase();
  const model = $('#modelFilter').value;
  let filtered = allItems;

  if(model){
    filtered = filtered.filter(i=>i.model === model);
  }

  if(q){
    filtered = filtered.filter(i=>{
      const hay = (i.prompt + ' ' + (i.tags||[]).join(' ') + ' ' + (i.model||'')).toLowerCase();
      return hay.includes(q);
    });
  }

  render(filtered);
}

function attachEvents(){
  $('#searchInput').addEventListener('input', debounce(applyFilters, 180));
  $('#modelFilter').addEventListener('change', applyFilters);
  // keyboard focus
  document.addEventListener('keydown', e=>{
    if(e.key === '/' && document.activeElement.tagName !== 'INPUT'){
      e.preventDefault();
      $('#searchInput').focus();
    }
  });
}

function debounce(fn, wait=200){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

document.addEventListener('DOMContentLoaded', ()=>{
  attachEvents();
  loadData();
});