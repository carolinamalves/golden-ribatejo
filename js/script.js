// Load navbar from components/navbar.html
document.addEventListener('DOMContentLoaded', function(){
  var navbarContainer = document.getElementById('navbar-container');
  if(navbarContainer){
    fetch('components/navbar.html')
      .then(function(response){ return response.text(); })
      .then(function(html){
        navbarContainer.outerHTML = html;
        initializeHeader();
      })
      .catch(function(err){ 
        console.error('Erro ao carregar navbar:', err); 
      });
  } else {
    // If no container, try to initialize immediately (for backward compatibility)
    initializeHeader();
  }
});

function initializeHeader(){
  // Header scroll effect
  var siteHeader = document.querySelector('header.site-header');
  
  function updateHeaderShadow(){
    if(window.scrollY > 8){ 
      siteHeader.classList.add('scrolled'); 
    } else { 
      siteHeader.classList.remove('scrolled'); 
    }
  }
  
  window.addEventListener('scroll', updateHeaderShadow, {passive:true});
  updateHeaderShadow();
  
  // Mobile menu toggle
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var menuIcons = menuToggle.querySelectorAll('svg');
  
  menuToggle.addEventListener('click', function(){
    var isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuIcons[0].style.display = isOpen ? 'none' : 'block';
    menuIcons[1].style.display = isOpen ? 'block' : 'none';
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuIcons[0].style.display = 'block';
      menuIcons[1].style.display = 'none';
    });
  });
  
  // Update active link based on current page
  var currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'inicial';
  navLinks.querySelectorAll('[data-page]').forEach(function(a){
    var page = a.getAttribute('data-page');
    if(page === currentPage){
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}
