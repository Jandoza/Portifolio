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

  // Project modal
  const modal = document.getElementById('projectModal')
  const modalTitle = document.getElementById('modalTitle')
  const modalDescription = document.getElementById('modalDescription')
  const modalGithub = document.getElementById('modalGithub')
  const modalCloseElements = Array.from(document.querySelectorAll('[data-modal-close]'))

  const projectsInfo = {
    'analise-vendas': {
      title: 'Análise de Vendas',
      description: 'Script em Python que simula dados, calcula indicadores e gera gráficos comparativos para análise rápida de desempenho.',
      github: 'https://github.com/Jandoza/Analise-vendas.git'
    },
    'calculadora': {
      title: 'Calculadora Científica',
      description: 'Calculadora web com suporte a operações científicas, combinações de teclas, histórico e validação de entrada.',
      github: 'https://github.com/Jandoza/Calculadora-.git'
    },
    'bot-redes-sociais': {
      title: 'Bot Redes Sociais',
      description: 'Automação em Python que agenda publicações, registra interações e organiza tudo em SQLite para acompanhamento posterior.',
      github: 'https://github.com/Jandoza/Bot-Redes-Sociais.git'
    },
    'gerenciador-tarefas': {
      title: 'Gerenciador de Tarefas',
      description: 'Aplicação Kanban com arrastar e soltar, filtros dinâmicos e persistência local para acompanhar o progresso das atividades.',
      github: 'https://github.com/Jandoza/Gerenciador-tarefas-.git'
    },
    'sistema-biblioteca': {
      title: 'Sistema de Biblioteca',
      description: 'CRUD completo para manter catálogo de livros, controlar empréstimos e emitir relatórios com interface desktop em Java Swing.',
      github: 'https://github.com/Jandoza/Sistema-biblioteca-.git'
    },
    'jogo-da-velha': {
      title: 'Jogo da Velha',
      description: 'Implementação do jogo da velha com modo para dois jogadores e inteligência artificial baseada no algoritmo Minimax.',
      github: 'https://github.com/Jandoza/Jogo-da-velha.git'
    }
  }

  const projectAliases = {
    'painel-monitoramento': 'analise-vendas',
    'landing-page': 'calculadora',
    'api-autenticacao': 'bot-redes-sociais'
  }

  let lastFocusedElement = null

  function openModal(projectId){
    if(!modal || !modalTitle || !modalDescription || !modalGithub) return
    const resolvedId = projectsInfo[projectId] ? projectId : projectAliases[projectId]
    const info = resolvedId ? projectsInfo[resolvedId] : undefined
    if(!info) return

    modalTitle.textContent = info.title
    modalDescription.textContent = info.description
    modalGithub.href = info.github || '#'
    modalGithub.classList.toggle('is-hidden', !info.github)
    modalGithub.setAttribute('aria-hidden', info.github ? 'false' : 'true')

    modal.classList.add('is-visible')
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.setProperty('overflow', 'hidden')

    const closeButton = modal.querySelector('.modal-close')
    ;(closeButton || modalGithub).focus()
  }

  function closeModal(){
    if(!modal) return
    modal.classList.remove('is-visible')
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.removeProperty('overflow')
    if(lastFocusedElement){
      lastFocusedElement.focus()
      lastFocusedElement = null
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.btn-project')
    if(!button) return
    event.preventDefault()
    lastFocusedElement = button
    openModal(button.getAttribute('data-project'))
  })

  modalCloseElements.forEach(element => {
    element.addEventListener('click', closeModal)
  })

  modal?.addEventListener('click', event => {
    if(event.target === modal) closeModal()
  })

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && modal?.classList.contains('is-visible')){
      closeModal()
    }
  })
})()

