(function initPortfolioSite(){
  const revealElements = Array.from(document.querySelectorAll('.reveal'))
  const navLinks = Array.from(document.querySelectorAll('.nav-link'))
  const themeToggleButton = document.getElementById('themeToggle')
  const rootHtml = document.documentElement

  // Intersection Observer for reveal-on-scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in-view') } })
  }, { threshold: 0.15 })
  revealElements.forEach(el=>observer.observe(el))

  // Active section highlight in navbar
  const sectionIdsByLink = new Map(navLinks.map(link=>{
    const id = link.getAttribute('href').replace('#','')
    return [link, id]
  }))
  const sections = Array.from(sectionIdsByLink.values()).map(id=>document.getElementById(id)).filter(Boolean)

  function updateActiveNav(){
    const scrollPos = document.documentElement.scrollTop || document.body.scrollTop
    let currentId = null
    for(const section of sections){
      const top = section.offsetTop - 90
      if(scrollPos >= top) currentId = section.id
    }
    navLinks.forEach(link=>{
      const id = sectionIdsByLink.get(link)
      if(id === currentId) link.classList.add('active')
      else link.classList.remove('active')
    })
  }
  document.addEventListener('scroll', updateActiveNav, { passive: true })
  window.addEventListener('load', updateActiveNav)

  // Theme toggle with persistence
  const savedTheme = localStorage.getItem('theme')
  if(savedTheme === 'dark' || savedTheme === 'light') rootHtml.setAttribute('data-theme', savedTheme)
  themeToggleButton?.addEventListener('click', ()=>{
    const next = rootHtml.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    rootHtml.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  })

  // Footer year
  const yearSpan = document.getElementById('year')
  if(yearSpan) yearSpan.textContent = String(new Date().getFullYear())

  // Project details expand/collapse
  const detailButtons = Array.from(document.querySelectorAll('.btn-details'))
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.getAttribute('data-project')
      const detailsSection = document.getElementById(`details-${projectId}`)
      
      if (!detailsSection) return
      
      const isExpanded = detailsSection.classList.contains('expanded')
      
      if (isExpanded) {
        detailsSection.classList.remove('expanded')
        button.setAttribute('aria-expanded', 'false')
      } else {
        detailsSection.classList.add('expanded')
        button.setAttribute('aria-expanded', 'true')
      }
    })
    
    // Initialize aria-expanded
    button.setAttribute('aria-expanded', 'false')
  })
})()

