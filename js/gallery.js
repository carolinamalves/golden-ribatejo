// Gallery-specific scripts for ninhadas page
var puppyColors = [
  {id:'amarelo', hex:'#D9A62D'},
  {id:'cinzento', hex:'#8A8579'},
  {id:'verde', hex:'#6B7D4F'},
  {id:'vermelho', hex:'#9C3B3B'},
  {id:'azul', hex:'#4F6E80'},
  {id:'rosa', hex:'#C97B94'}
];

var stages = [
  {id:'0-2', label:'0–2 semanas', hint:'Recém-nascidos'},
  {id:'2-4', label:'2–4 semanas', hint:'A abrir os olhos'},
  {id:'4-6', label:'4–6 semanas', hint:'Primeiros passos'},
  {id:'6-8', label:'6–8 semanas', hint:'A ganhar caráter'},
  {id:'8-10', label:'8–10 semanas', hint:'Prontos para casa'}
];

var photos = [
  {src:"img/amarelo26.jpeg", w:1600, h:1200, stage:'0-2', puppy:'amarelo'},
  {src:"img/cinzento26.jpeg", w:1200, h:1600, stage:'0-2', puppy:'cinzento'},
  {src:"img/verde2026.jpeg", w:1200, h:1600, stage:'0-2', puppy:'verde'},
  {src:"img/vermelho26.jpeg", w:1600, h:1200, stage:'0-2', puppy:'vermelho'},
  {src:"img/azul26.jpeg", w:1200, h:1600, stage:'0-2', puppy:'azul'},
  {src:"img/rosa26.jpeg", w:1600, h:1200, stage:'0-2', puppy:'rosa'}
];

var activeStage = stages[0].id;
var tabsEl = document.getElementById('galleryTabs');
var grid = document.getElementById('galleryGrid');
var emptyEl = document.getElementById('galleryEmpty');

function countFor(stageId){
  return photos.filter(function(p){ return p.stage === stageId; }).length;
}

function renderTabs(){
  tabsEl.innerHTML = '';
  stages.forEach(function(s){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'g-tab' + (s.id === activeStage ? ' active' : '');
    btn.innerHTML = s.hint + ' <span class="count">' + countFor(s.id) + '</span>';
    btn.addEventListener('click', function(){
      activeStage = s.id;
      renderTabs();
      renderGrid();
    });
    tabsEl.appendChild(btn);
  });
}

function renderGrid(){
  grid.innerHTML = '';
  var filtered = photos.filter(function(p){ return p.stage === activeStage; });
  if(filtered.length === 0){
    grid.style.display = 'none';
    emptyEl.classList.add('show');
    return;
  }
  grid.style.display = '';
  emptyEl.classList.remove('show');
  filtered.forEach(function(p){
    var globalIndex = photos.indexOf(p);
    var item = document.createElement('div');
    item.className = 'g-item';
    item.setAttribute('data-index', globalIndex);
    item.setAttribute('data-puppy', p.puppy);
    var dot = document.createElement('span');
    dot.className = 'ribbon-dot';
    var colorInfo = puppyColors.find(function(c){ return c.id === p.puppy; });
    dot.style.background = colorInfo.hex;
    var img = document.createElement('img');
    img.src = p.src;
    img.width = p.w;
    img.height = p.h;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'Cachorro ' + p.puppy + ', ninhada de 2026';
    item.appendChild(img);
    item.appendChild(dot);
    grid.appendChild(item);
  });
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.1, rootMargin:'80px'});
  document.querySelectorAll('.g-item').forEach(function(el){ revealObserver.observe(el); });
}

renderTabs();
renderGrid();

var lightbox = document.getElementById('lightbox');
var lbImg = document.getElementById('lbImg');
var currentIndex = 0;

function currentSet(){
  return photos.filter(function(p){ return p.stage === activeStage; });
}

function openLightbox(globalIndex){
  var set = currentSet();
  currentIndex = set.findIndex(function(p){ return photos.indexOf(p) === globalIndex; });
  lbImg.src = set[currentIndex].src;
  lightbox.classList.add('open');
}

function closeLightbox(){ 
  lightbox.classList.remove('open'); 
}

function showNext(dir){
  var set = currentSet();
  currentIndex = (currentIndex + dir + set.length) % set.length;
  lbImg.src = set[currentIndex].src;
}

grid.addEventListener('click', function(e){
  var item = e.target.closest('.g-item');
  if(item){ openLightbox(parseInt(item.getAttribute('data-index'), 10)); }
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', function(){ showNext(-1); });
document.getElementById('lbNext').addEventListener('click', function(){ showNext(1); });
lightbox.addEventListener('click', function(e){ if(e.target === lightbox){ closeLightbox(); } });
document.addEventListener('keydown', function(e){
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowRight') showNext(1);
  if(e.key === 'ArrowLeft') showNext(-1);
});
