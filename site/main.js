// site/main.js — Minimal client-side JS for the book site
// Handles: sidebar toggle, reading progress, keyboard nav, active section tracking

(function () {
  'use strict'

  // ---- Reading Progress Bar ----
  const progressBar = document.getElementById('reading-progress')
  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      progressBar.style.width = `${Math.min(progress, 100)}%`
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
  }

  // ---- Mobile Sidebar Toggle ----
  const hamburger = document.getElementById('hamburger')
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')

  if (hamburger && sidebar && overlay) {
    function toggleSidebar() {
      hamburger.classList.toggle('active')
      sidebar.classList.toggle('open')
      overlay.classList.toggle('visible')
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : ''
    }

    function closeSidebar() {
      hamburger.classList.remove('active')
      sidebar.classList.remove('open')
      overlay.classList.remove('visible')
      document.body.style.overflow = ''
    }

    hamburger.addEventListener('click', toggleSidebar)
    overlay.addEventListener('click', closeSidebar)

    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('.sidebar-chapter').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeSidebar()
        }
      })
    })
  }

  // ---- Keyboard Navigation ----
  document.addEventListener('keydown', (e) => {
    // Don't interfere with input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    const prevLink = document.querySelector('.chapter-nav-link.prev')
    const nextLink = document.querySelector('.chapter-nav-link.next')

    if (e.key === 'ArrowLeft' && prevLink) {
      window.location.href = prevLink.href
    } else if (e.key === 'ArrowRight' && nextLink) {
      window.location.href = nextLink.href
    }
  })

  // ---- Active Section Highlighting (sidebar) ----
  const sidebarLinks = document.querySelectorAll('.sidebar-chapter')
  if (sidebarLinks.length > 0) {
    // Find current chapter link and ensure it's visible
    const activeLink = document.querySelector('.sidebar-chapter.active')
    if (activeLink) {
      activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const href = e.currentTarget.getAttribute('href')
      const target = href ? document.querySelector(href) : null
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })

})()
