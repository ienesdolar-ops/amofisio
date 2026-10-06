/**
 * AMO FISIO - FACULDADE INSPIRAR
 * Controlador da Aplicação e Interações
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const unitsView = document.getElementById('view-units');
  const coursesView = document.getElementById('view-courses');
  const unitsListContainer = document.getElementById('units-list-container');
  const coursesListContainer = document.getElementById('courses-list-container');
  const backToUnitsBtn = document.getElementById('back-to-units-btn');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const emptyState = document.getElementById('empty-state');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const currentYearSpan = document.getElementById('current-year');

  // Elementos de cabeçalho da unidade ativa
  const activeUnitName = document.getElementById('active-unit-name');
  const activeUnitBadge = document.getElementById('active-unit-badge');
  const activeUnitAddress = document.getElementById('active-unit-address');

  // Estado atual
  let currentUnitId = null;
  let currentSearchQuery = '';

  // Configurar ano atual no footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // RENDERIZAÇÃO: NÍVEL 1 (LISTA DE UNIDADES)
  // =========================================================================
  function renderUnits(filterQuery = '') {
    if (!AMO_FISIO_DATA || !AMO_FISIO_DATA.units) return;

    unitsListContainer.innerHTML = '';
    const query = filterQuery.toLowerCase().trim();

    // Filtra unidades pelo nome, estado ou cursos contidos
    const filteredUnits = AMO_FISIO_DATA.units.filter(unit => {
      // REGRA OBRIGATÓRIA: Unidades canceladas pelo franqueado (ex: São José dos Campos)
      // NÃO devem aparecer na listagem pública para os alunos
      if (unit.cancelledByFranchisee) return false;

      if (!query) return true;
      const matchUnit = unit.name.toLowerCase().includes(query) || 
                        unit.state.toLowerCase().includes(query) ||
                        unit.fullName.toLowerCase().includes(query);
      
      const matchCourse = unit.courses.some(course => 
        course.title.toLowerCase().includes(query) || 
        course.category.toLowerCase().includes(query) ||
        (course.instructor && course.instructor.toLowerCase().includes(query))
      );

      return matchUnit || matchCourse;
    });

    // REGRA DE NEGÓCIO: Ordenação alfabética obrigatória das cidades (A-Z)
    filteredUnits.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

    if (filteredUnits.length === 0) {
      unitsListContainer.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    unitsListContainer.style.display = 'flex';
    emptyState.style.display = 'none';

    filteredUnits.forEach(unit => {
      const card = document.createElement('div');
      card.className = 'unit-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver cursos da unidade ${unit.name}`);

      const totalCourses = unit.courses ? unit.courses.length : 0;
      let countLabel = totalCourses === 1 ? '1 Aula' : `${totalCourses} Aulas`;
      
      if (unit.id === 'campo-grande') {
        countLabel = 'Passaporte Combo (4 Cursos)';
      }

      card.innerHTML = `
        <div class="unit-info-left">
          <div class="unit-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="unit-details">
            <div class="unit-name-row">
              <span class="unit-title">${unit.name}</span>
              <span class="unit-state-badge">${unit.state}</span>
            </div>
            <span class="unit-subtitle">${unit.fullName}</span>
          </div>
        </div>
        <div class="unit-card-right">
          <span class="courses-count-pill">${countLabel}</span>
          <svg class="unit-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      `;

      // Evento de clique para abrir os cursos da unidade
      const selectAction = () => {
        selectUnit(unit.id);
      };

      card.addEventListener('click', selectAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectAction();
        }
      });

      unitsListContainer.appendChild(card);
    });
  }

  // =========================================================================
  // RENDERIZAÇÃO: NÍVEL 2 (CURSOS DA UNIDADE SELECIONADA)
  // =========================================================================
  function renderCourses(unitId, filterQuery = '') {
    const unit = AMO_FISIO_DATA.units.find(u => u.id === unitId);
    if (!unit || unit.cancelledByFranchisee) {
      showUnitsView();
      return;
    }

    // Atualiza cabeçalho da unidade
    activeUnitName.textContent = unit.name;
    activeUnitBadge.textContent = unit.state;
    activeUnitAddress.textContent = unit.address || unit.fullName;

    coursesListContainer.innerHTML = '';
    const query = filterQuery.toLowerCase().trim();

    // Se a unidade tiver um aviso especial (ex: Campo Grande combo)
    if (unit.bannerNotice) {
      const noticeBox = document.createElement('div');
      noticeBox.className = 'unit-notice-banner';
      noticeBox.innerHTML = `
        <div class="notice-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="notice-text">${unit.bannerNotice}</div>
      `;
      coursesListContainer.appendChild(noticeBox);
    }

    const filteredCourses = unit.courses.filter(course => {
      if (!query) return true;
      return course.title.toLowerCase().includes(query) || 
             course.category.toLowerCase().includes(query) ||
             (course.instructor && course.instructor.toLowerCase().includes(query)) ||
             (course.description && course.description.toLowerCase().includes(query));
    });

    if (filteredCourses.length === 0) {
      if (!unit.bannerNotice) {
        coursesListContainer.style.display = 'none';
      }
      emptyState.style.display = 'block';
      return;
    }

    coursesListContainer.style.display = 'flex';
    emptyState.style.display = 'none';

    filteredCourses.forEach(course => {
      const card = document.createElement('article');
      
      const badgeText = course.badge || '';
      const isSoldOut = course.status === 'sold_out' || badgeText.toLowerCase().includes('esgotad');
      const isUrgent = course.status === 'last_spots' || badgeText.toLowerCase().includes('última') || badgeText.toLowerCase().includes('ultima');

      card.className = `course-card${isSoldOut ? ' is-sold-out' : ''}`;

      // Badge e Meta info
      const categoryHtml = course.category ? `
        <span class="course-category-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${course.category}
        </span>
      ` : '';

      let badgeClass = '';
      if (isSoldOut) {
        badgeClass = 'badge-sold-out';
      } else if (isUrgent) {
        badgeClass = 'badge-urgent';
      }

      const badgeHtml = badgeText ? `
        <span class="course-badge-pill ${badgeClass}">
          ${isSoldOut ? `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>` : ''}
          ${isUrgent ? `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>` : ''}
          ${badgeText}
        </span>
      ` : '';

      const descHtml = course.description ? `
        <p class="course-desc">${course.description}</p>
      ` : '';

      // Ministrante e data se existirem
      let metaItemsHtml = '';
      if (course.instructor) {
        metaItemsHtml += `
          <div class="course-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${course.instructor}</span>
          </div>
        `;
      }
      if (course.priceInfo) {
        metaItemsHtml += `
          <div class="course-meta-item highlight-price">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <strong>${course.priceInfo}</strong>
          </div>
        `;
      }
      if (course.date) {
        metaItemsHtml += `
          <div class="course-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${course.date} ${course.time ? `• ${course.time}` : ''}</span>
          </div>
        `;
      }

      const metaRowHtml = metaItemsHtml ? `
        <div class="course-meta-row">${metaItemsHtml}</div>
      ` : '';

      // Botão Sympla
      const symplaUrl = course.symplaUrl || 'https://www.sympla.com.br';
      let btnText = 'Garantir Vaga no Sympla';
      let btnClass = 'btn-sympla';

      if (isSoldOut) {
        btnText = 'Turma Esgotada (Ver no Sympla)';
        btnClass = 'btn-sympla btn-sold-out';
      } else if (course.status === 'soon') {
        btnText = 'Inscrições em Breve';
      }

      card.innerHTML = `
        <div class="course-header-row">
          ${categoryHtml}
          ${badgeHtml}
        </div>

        <h3 class="course-title">${course.title}</h3>
        ${descHtml}
        ${metaRowHtml}

        <div class="course-actions-row">
          <a 
            href="${symplaUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="${btnClass}" 
            aria-label="Inscrever-se no curso ${course.title} no Sympla"
          >
            <span>${btnText}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <button 
            class="btn-icon-action share-course-btn" 
            title="Copiar link do curso" 
            aria-label="Copiar link da aula"
            data-url="${symplaUrl}"
            data-title="${course.title}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        </div>
      `;

      // Botão de compartilhar / copiar link da aula
      const shareBtn = card.querySelector('.share-course-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const urlToShare = shareBtn.getAttribute('data-url');
          copyToClipboard(urlToShare, 'Link do curso copiado para a área de transferência!');
        });
      }

      coursesListContainer.appendChild(card);
    });
  }

  // =========================================================================
  // CONTROLE DE NAVEGAÇÃO ENTRE TELAS
  // =========================================================================
  function selectUnit(unitId, updateHash = true) {
    const unit = AMO_FISIO_DATA.units.find(u => u.id === unitId);
    if (!unit) return;

    currentUnitId = unitId;
    if (updateHash) {
      window.location.hash = unitId;
    }

    unitsView.classList.remove('active');
    coursesView.classList.add('active');

    renderCourses(unitId, currentSearchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showUnitsView(updateHash = true) {
    currentUnitId = null;
    if (updateHash && window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    coursesView.classList.remove('active');
    unitsView.classList.add('active');

    renderUnits(currentSearchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // ROTEAMENTO VIA HASH E URL PARAMS
  // =========================================================================
  function handleUrlRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramUnit = urlParams.get('unidade') || urlParams.get('unit');
    const hash = window.location.hash.replace('#', '').trim();

    if (hash === 'inscricoes' || hash === 'recentes') {
      openRecentModal();
      return;
    }

    const targetUnitId = paramUnit || hash;

    if (targetUnitId && AMO_FISIO_DATA.units.some(u => u.id.toLowerCase() === targetUnitId.toLowerCase())) {
      selectUnit(targetUnitId.toLowerCase(), false);
    } else {
      showUnitsView(false);
    }
  }

  window.addEventListener('hashchange', handleUrlRouting);
  window.addEventListener('popstate', handleUrlRouting);

  // Botão Voltar
  backToUnitsBtn.addEventListener('click', () => {
    showUnitsView(true);
  });

  // =========================================================================
  // SISTEMA DE BUSCA EM TEMPO REAL
  // =========================================================================
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    clearSearchBtn.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';

    if (currentUnitId) {
      renderCourses(currentUnitId, currentSearchQuery);
    } else {
      renderUnits(currentSearchQuery);
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();

    if (currentUnitId) {
      renderCourses(currentUnitId, '');
    } else {
      renderUnits('');
    }
  });

  // =========================================================================
  // UTILITÁRIOS: TOAST E CLIPBOARD
  // =========================================================================
  let toastTimeout = null;

  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function copyToClipboard(text, successMsg = 'Link copiado com sucesso!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(successMsg))
        .catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(textArea);
  }

  // =========================================================================
  // ÁREA ADMINISTRATIVA (GESTÃO E OCUPAÇÃO DE TURMAS)
  // =========================================================================
  const adminTriggerBtn = document.getElementById('admin-trigger-btn');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPasswordInput = document.getElementById('admin-password-input');
  const adminTogglePwd = document.getElementById('admin-toggle-pwd');
  const adminLoginError = document.getElementById('admin-login-error');
  const adminLoginClose = document.getElementById('admin-login-close');

  const adminDashboardModal = document.getElementById('admin-dashboard-modal');
  const adminDashboardClose = document.getElementById('admin-dashboard-close');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const adminFilterInput = document.getElementById('admin-filter-input');
  const adminUnitsContainer = document.getElementById('admin-units-container');

  const adminKpiTotalReg = document.getElementById('admin-kpi-total-reg');
  const adminKpiTotalCap = document.getElementById('admin-kpi-total-cap');
  const adminKpiOccupancyRate = document.getElementById('admin-kpi-occupancy-rate');
  const adminKpiRemainingSpots = document.getElementById('admin-kpi-remaining-spots');
  const adminKpiSoldOut = document.getElementById('admin-kpi-sold-out');
  const adminKpiUrgent = document.getElementById('admin-kpi-urgent');
  const adminKpiConfirmed = document.getElementById('admin-kpi-confirmed');
  const adminKpiConfirmedRate = document.getElementById('admin-kpi-confirmed-rate');
  const adminCountUnits = document.getElementById('admin-count-units');

  let currentAdminFilterStatus = 'all';
  let currentAdminSearch = '';

  const ADMIN_PWD_CORRECT = 'CampeãoInspirar';

  function isValidAdminPassword(val) {
    if (!val) return false;
    const clean = val.trim();
    if (clean === ADMIN_PWD_CORRECT) return true;
    const norm = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return norm === 'campeaoinspirar';
  }

  function isAdminAuthenticated() {
    return sessionStorage.getItem('amofisio_admin_auth') === 'true';
  }

  function openAdmin() {
    if (isAdminAuthenticated()) {
      showAdminDashboard();
    } else {
      showAdminLogin();
    }
  }

  function showAdminLogin() {
    if (adminLoginModal) {
      adminLoginModal.style.display = 'flex';
      if (adminPasswordInput) {
        adminPasswordInput.value = '';
        setTimeout(() => adminPasswordInput.focus(), 100);
      }
      if (adminLoginError) adminLoginError.style.display = 'none';
    }
  }

  function closeAdminLogin() {
    if (adminLoginModal) adminLoginModal.style.display = 'none';
  }

  function showAdminDashboard() {
    closeAdminLogin();
    if (adminDashboardModal) {
      adminDashboardModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      renderAdminDashboard();
    }
  }

  function closeAdminDashboard() {
    if (adminDashboardModal) {
      adminDashboardModal.style.display = 'none';
      document.body.style.overflow = '';
      if (window.location.hash === '#admin') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }

  function logoutAdmin() {
    sessionStorage.removeItem('amofisio_admin_auth');
    closeAdminDashboard();
    showToast('Sessão administrativa bloqueada.');
  }

  // Toggle visualização de senha
  if (adminTogglePwd && adminPasswordInput) {
    adminTogglePwd.addEventListener('click', () => {
      const isPwd = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPwd ? 'text' : 'password';
    });
  }

  // Submissão do formulário de login
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasswordInput ? adminPasswordInput.value : '';
      if (isValidAdminPassword(entered)) {
        sessionStorage.setItem('amofisio_admin_auth', 'true');
        showAdminDashboard();
      } else {
        if (adminLoginError) adminLoginError.style.display = 'flex';
        if (adminPasswordInput) {
          adminPasswordInput.select();
          adminPasswordInput.focus();
        }
      }
    });
  }

  // Botões de fechar e logout
  if (adminLoginClose) adminLoginClose.addEventListener('click', closeAdminLogin);
  if (adminDashboardClose) adminDashboardClose.addEventListener('click', closeAdminDashboard);
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', logoutAdmin);

  // Trigger discreto no rodapé
  if (adminTriggerBtn) {
    adminTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdmin();
    });
  }

  // Atalho de teclado: Alt + A ou Ctrl + Shift + A
  document.addEventListener('keydown', (e) => {
    if ((e.altKey && (e.key === 'a' || e.key === 'A')) || 
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
      e.preventDefault();
      openAdmin();
    }
    if (e.key === 'Escape') {
      if (adminDashboardModal && adminDashboardModal.style.display === 'block') {
        closeAdminDashboard();
      } else if (adminLoginModal && adminLoginModal.style.display === 'flex') {
        closeAdminLogin();
      }
    }
  });

  // Busca no painel administrativo
  if (adminFilterInput) {
    adminFilterInput.addEventListener('input', (e) => {
      currentAdminSearch = e.target.value.toLowerCase().trim();
      renderAdminDashboard();
    });
  }

  // Pílulas de filtro
  const filterPillBtns = document.querySelectorAll('.admin-filter-pills .admin-pill');
  filterPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAdminFilterStatus = btn.getAttribute('data-filter') || 'all';
      renderAdminDashboard();
    });
  });

  // RENDERIZAÇÃO DO PAINEL ADMINISTRATIVO
  function renderAdminDashboard() {
    if (!AMO_FISIO_DATA || !AMO_FISIO_DATA.units || !adminUnitsContainer) return;

    let totalBrazilRegistered = 0;
    let totalBrazilCapacity = 0;
    let totalSoldOutCourses = 0;
    let totalUrgentCourses = 0;
    let totalConfirmedCourses = 0;
    let totalActiveCourses = 0;
    let matchingUnitsCount = 0;

    adminUnitsContainer.innerHTML = '';

    // Mapear métricas por unidade e por curso
    const unitsData = AMO_FISIO_DATA.units.map(unit => {
      let unitReg = 0;
      let unitCap = 0;
      let unitConfirmedCount = 0;
      let unitActiveCoursesCount = 0;
      const isUnitCancelled = Boolean(unit.cancelledByFranchisee);

      const coursesWithStats = unit.courses.map(course => {
        const isCancelled = Boolean(isUnitCancelled || course.cancelledByFranchisee);
        const reg = typeof course.registered === 'number' ? course.registered : 0;
        const cap = typeof course.capacity === 'number' ? course.capacity : 40;
        const min = typeof course.minParticipants === 'number' ? course.minParticipants : 10;
        const rem = Math.max(0, cap - reg);
        const pct = cap > 0 ? Math.min(100, Math.round((reg / cap) * 100)) : 0;
        
        const isSoldOut = !isCancelled && (course.status === 'sold_out' || (course.badge && course.badge.toLowerCase().includes('esgotad')));
        const isUrgent = !isCancelled && !isSoldOut && (rem <= 5 || (course.badge && (course.badge.toLowerCase().includes('última') || course.badge.toLowerCase().includes('ultima'))));
        const isConfirmed = !isCancelled && (reg >= min);
        const confirmPct = isCancelled ? 0 : (isConfirmed ? 100 : Math.min(100, Math.round((reg / min) * 100)));

        if (!isCancelled) {
          unitReg += reg;
          unitCap += cap;
          totalBrazilRegistered += reg;
          totalBrazilCapacity += cap;
          totalActiveCourses++;
          unitActiveCoursesCount++;
          if (isConfirmed) {
            totalConfirmedCourses++;
            unitConfirmedCount++;
          }
          if (isSoldOut) totalSoldOutCourses++;
          if (isUrgent) totalUrgentCourses++;
        }

        return {
          ...course,
          reg,
          cap,
          min,
          rem,
          pct,
          confirmPct,
          isConfirmed,
          isSoldOut,
          isUrgent,
          isCancelled
        };
      });

      return {
        ...unit,
        unitReg,
        unitCap,
        unitConfirmedCount,
        unitActiveCoursesCount,
        isCancelled: isUnitCancelled,
        unitPct: unitCap > 0 ? Math.min(100, Math.round((unitReg / unitCap) * 100)) : 0,
        coursesStats: coursesWithStats
      };
    });

    // Atualizar KPIs no topo
    if (adminKpiTotalReg) adminKpiTotalReg.textContent = totalBrazilRegistered.toLocaleString('pt-BR');
    if (adminKpiTotalCap) adminKpiTotalCap.textContent = totalBrazilCapacity.toLocaleString('pt-BR');
    if (adminKpiConfirmed) adminKpiConfirmed.textContent = totalConfirmedCourses;
    if (adminKpiConfirmedRate) {
      const confirmedRate = totalActiveCourses > 0 ? Math.round((totalConfirmedCourses / totalActiveCourses) * 100) : 0;
      adminKpiConfirmedRate.textContent = `${totalConfirmedCourses} de ${totalActiveCourses} turmas (${confirmedRate}%)`;
    }

    const generalOccupancy = totalBrazilCapacity > 0 ? ((totalBrazilRegistered / totalBrazilCapacity) * 100).toFixed(1) : 0;
    if (adminKpiOccupancyRate) adminKpiOccupancyRate.textContent = `${generalOccupancy}% de ocupação geral`;
    if (adminKpiRemainingSpots) adminKpiRemainingSpots.textContent = `${Math.max(0, totalBrazilCapacity - totalBrazilRegistered)} vagas disponíveis`;
    if (adminKpiSoldOut) adminKpiSoldOut.textContent = totalSoldOutCourses;
    if (adminKpiUrgent) adminKpiUrgent.textContent = totalUrgentCourses;
    if (adminRecentBadge && AMO_FISIO_DATA.recentRegistrations) {
      adminRecentBadge.textContent = AMO_FISIO_DATA.recentRegistrations.length;
    }

    // Filtrar unidades e cursos de acordo com busca e filtro selecionado
    unitsData.forEach(unit => {
      // Filtrar cursos dentro da unidade
      const filteredCourses = unit.coursesStats.filter(c => {
        // Filtro de status
        if (currentAdminFilterStatus === 'confirmed' && (!c.isConfirmed || c.isCancelled)) return false;
        if (currentAdminFilterStatus === 'pending' && (c.isConfirmed || c.isCancelled)) return false;
        if (currentAdminFilterStatus === 'cancelled' && !c.isCancelled) return false;
        if (currentAdminFilterStatus === 'sold_out' && !c.isSoldOut) return false;
        if (currentAdminFilterStatus === 'urgent' && !c.isUrgent) return false;

        // Filtro de busca de texto
        if (currentAdminSearch) {
          const matchUnit = unit.name.toLowerCase().includes(currentAdminSearch) || unit.state.toLowerCase().includes(currentAdminSearch);
          const matchCourse = c.title.toLowerCase().includes(currentAdminSearch) || (c.category && c.category.toLowerCase().includes(currentAdminSearch));
          return matchUnit || matchCourse;
        }
        return true;
      });

      if (filteredCourses.length === 0) return;

      matchingUnitsCount++;

      // Card da Unidade
      const unitCard = document.createElement('div');
      unitCard.className = `admin-unit-card ${unit.isCancelled ? 'unit-cancelled' : ''}`;

      let pctClass = '';
      if (unit.unitPct >= 90) pctClass = 'pct-high';
      else if (unit.unitPct >= 65) pctClass = 'pct-med';

      let unitHeaderHTML = '';
      if (unit.isCancelled) {
        unitHeaderHTML = `
          <div class="admin-unit-header">
            <div class="admin-unit-title-group">
              <h3>${unit.name}</h3>
              <span class="admin-unit-state">${unit.state}</span>
              <span class="admin-unit-cancelled-badge">Cancelado pelo Franqueado</span>
            </div>
            <div class="admin-unit-meta">
              <span class="admin-unit-stats-text" style="color: #F87171;">
                Aulas canceladas a pedido do franqueado (oculto no site público)
              </span>
              <span class="admin-unit-percent-badge pct-cancelled">Cancelado</span>
            </div>
          </div>
        `;
      } else {
        unitHeaderHTML = `
          <div class="admin-unit-header">
            <div class="admin-unit-title-group">
              <h3>${unit.name}</h3>
              <span class="admin-unit-state">${unit.state}</span>
            </div>
            <div class="admin-unit-header-right">
              <div class="admin-unit-meta">
                <span class="admin-unit-stats-text">
                  Total da Unidade: <strong>${unit.unitReg} / ${unit.unitCap}</strong> inscritos
                </span>
                <span class="admin-unit-confirmed-summary" title="${unit.unitConfirmedCount} turmas atingiram o mínimo para confirmação">
                  <span class="dot-green"></span> ${unit.unitConfirmedCount}/${unit.courses.length} confirmadas
                </span>
                <span class="admin-unit-percent-badge ${pctClass}">${unit.unitPct}%</span>
              </div>
              <button class="admin-copy-report-btn" data-unit-id="${unit.id}" title="Copiar resumo de turmas desta unidade">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copiar
              </button>
            </div>
          </div>
        `;
      }

      unitCard.innerHTML = `
        ${unitHeaderHTML}
        <div class="admin-courses-table">
          ${filteredCourses.map(c => {
            if (c.isCancelled) {
              return `
                <div class="admin-course-row row-cancelled">
                  <div class="admin-course-top">
                    <div class="admin-course-main">
                      <div class="admin-course-title">${c.title}</div>
                      <div class="admin-course-category">${c.category || 'Curso Presencial'}${c.instructor ? ` • ${c.instructor}` : ''}</div>
                    </div>

                    <div class="admin-course-badges">
                      <span class="admin-confirm-badge status-cancelled">Cancelado pelo franqueado</span>
                      <span class="admin-status-pill status-cancelled">Cancelado</span>
                      <a href="${c.symplaUrl}" target="_blank" rel="noopener noreferrer" class="admin-sympla-link" title="Abrir página no Sympla">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div class="admin-unified-bar-container">
                    <div class="admin-unified-bar-track bar-track-cancelled" title="Aulas canceladas na unidade">
                      <div class="admin-unified-bar-fill bar-cancelled" style="width: 0%;"></div>
                      <div class="admin-cancelled-text-overlay">Aulas canceladas pelo franqueado local</div>
                      <span class="admin-bar-cap-text">${c.cap} vagas</span>
                    </div>

                    <div class="admin-unified-bar-legend">
                      <div class="legend-left">
                        <span class="legend-cancelled">❌ Cancelado pelo franqueado local</span>
                      </div>
                      <div class="legend-right">
                        Vagas canceladas
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }

            // Curso Normal
            let statusPillClass = 'status-normal';
            let statusLabel = c.badge || 'Disponível';

            if (c.isSoldOut) {
              statusPillClass = 'status-soldout';
              statusLabel = 'Esgotado';
            } else if (c.isUrgent) {
              statusPillClass = 'status-urgent';
              statusLabel = c.rem === 1 ? 'Última vaga' : 'Últimas vagas';
            }

            const remainingText = c.isSoldOut ? 'Capacidade esgotada' : `${c.rem} ${c.rem === 1 ? 'vaga restante' : 'vagas restantes'}`;
            const confirmBadgeClass = c.isConfirmed ? 'status-confirmed' : 'status-pending';
            const confirmBadgeLabel = c.isConfirmed ? '✓ Confirmado' : `Faltam ${c.min - c.reg} para confirmar`;
            const barFillClass = c.isConfirmed ? 'bar-confirmed' : 'bar-pending';

            // Percentual da meta e do preenchimento em relação à capacidade total da turma
            const metaPct = c.cap > 0 ? Math.min(100, Math.round((c.min / c.cap) * 100)) : 50;
            const fillPct = c.cap > 0 ? Math.min(100, Math.round((c.reg / c.cap) * 100)) : 0;

            const tooltipText = `${c.reg} inscritos de ${c.cap} vagas totais. Meta mínima para confirmar: ${c.min} alunos. (${c.isConfirmed ? 'Confirmado' : 'Aguardando confirmação'})`;

            const fillLabel = fillPct >= 16 ? `<span class="admin-bar-fill-text">${c.reg} ${c.reg === 1 ? 'inscrito' : 'inscritos'}</span>` : '';

            const statusSummaryText = c.isConfirmed
              ? `<span class="legend-confirmed">✅ Meta atingida (${c.reg}/${c.min} mín.)</span> • <strong>${c.reg}</strong> de ${c.cap} inscritos`
              : `<span class="legend-pending">⏳ Faltam ${c.min - c.reg} para a meta (${c.min} mín.)</span> • <strong>${c.reg}</strong> de ${c.cap} inscritos`;

            return `
              <div class="admin-course-row">
                <div class="admin-course-top">
                  <div class="admin-course-main">
                    <div class="admin-course-title">${c.title}</div>
                    <div class="admin-course-category">${c.category || 'Curso Presencial'}${c.instructor ? ` • ${c.instructor}` : ''}</div>
                  </div>

                  <div class="admin-course-badges">
                    <span class="admin-confirm-badge ${confirmBadgeClass}">${confirmBadgeLabel}</span>
                    <span class="admin-status-pill ${statusPillClass}">${statusLabel}</span>

                    <a href="${c.symplaUrl}" target="_blank" rel="noopener noreferrer" class="admin-sympla-link" title="Abrir página no Sympla">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- A BARRINHA ÚNICA GRANDE E SUPER VISÍVEL COM A META DENTRO -->
                <div class="admin-unified-bar-container">
                  <div class="admin-unified-bar-track" title="${tooltipText}">
                    <!-- Preenchimento dos Inscritos -->
                    <div class="admin-unified-bar-fill ${barFillClass}" style="width: ${fillPct}%;">
                      ${fillLabel}
                    </div>

                    <!-- Marcador da META DENTRO DA BARRA -->
                    <div class="admin-unified-bar-meta-marker" style="left: ${metaPct}%;" title="Meta mínima: ${c.min} alunos para confirmar">
                      <div class="meta-line"></div>
                      <div class="meta-flag">Meta: ${c.min}</div>
                    </div>

                    <!-- Vagas Totais no canto direito da barra -->
                    <span class="admin-bar-cap-text">${c.cap} vagas</span>
                  </div>

                  <!-- Legenda sob a barra -->
                  <div class="admin-unified-bar-legend">
                    <div class="legend-left">
                      ${statusSummaryText}
                    </div>
                    <div class="legend-right">
                      ${remainingText}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      adminUnitsContainer.appendChild(unitCard);
    });

    if (adminCountUnits) adminCountUnits.textContent = matchingUnitsCount;

    if (matchingUnitsCount === 0) {
      adminUnitsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <p>Nenhuma turma encontrada com os filtros selecionados.</p>
        </div>
      `;
    }

    // Configurar botões de cópia de relatório por unidade
    adminUnitsContainer.querySelectorAll('.admin-copy-report-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uId = btn.getAttribute('data-unit-id');
        const unit = AMO_FISIO_DATA.units.find(u => u.id === uId);
        if (!unit) return;

        let reportText = `📋 *RELATÓRIO DE TURMAS - ${unit.name.toUpperCase()}*\n`;
        reportText += `Faculdade Inspirar • Amo Fisio\n`;
        if (unit.cancelledByFranchisee) {
          reportText += `⚠️ Aulas canceladas pelo franqueado.\n`;
        } else {
          reportText += `Total da Unidade: ${unit.courses.reduce((acc, c) => acc + (c.registered || 0), 0)} inscritos\n\n`;
          unit.courses.forEach(c => {
            const min = c.minParticipants || 10;
            const reg = c.registered || 0;
            const cap = c.capacity || 40;
            const isConf = reg >= min;
            const statusTxt = isConf ? `✅ CONFIRMADO (${reg}/${min} mín.)` : `⏳ AGUARDANDO (Faltam ${min - reg} para ${min} mín.)`;
            reportText += `• ${c.title}\n  Inscritos: ${reg}/${cap} vagas | ${statusTxt}\n\n`;
          });
        }

        navigator.clipboard.writeText(reportText.trim()).then(() => {
          showToast(`Relatório de ${unit.name} copiado!`);
        }).catch(() => {
          showToast('Erro ao copiar relatório.');
        });
      });
    });
  }

  // =========================================================================
  // GESTÃO DE ÚLTIMAS INSCRIÇÕES REALIZADAS (ADMIN FEED & MODAL PÚBLICO)
  // =========================================================================

  // Elementos das Abas do Admin
  const adminTabUnits = document.getElementById('admin-tab-units');
  const adminTabRecent = document.getElementById('admin-tab-recent');
  const adminUnitsTabContent = document.getElementById('admin-units-tab-content');
  const adminRecentFeedView = document.getElementById('admin-recent-feed-view');
  const adminRecentList = document.getElementById('admin-recent-list');
  const adminRecentSearch = document.getElementById('admin-recent-search');
  const adminRecentUnitSelect = document.getElementById('admin-recent-unit-select');
  const adminRecentCounter = document.getElementById('admin-recent-counter');
  const adminRecentBadge = document.getElementById('admin-recent-badge');

  // Elementos do Modal Público
  const btnPublicRecent = document.getElementById('btn-public-recent');
  const modalRecentRegistrations = document.getElementById('modal-recent-registrations');
  const modalRecentClose = document.getElementById('modal-recent-close');
  const publicRecentSearch = document.getElementById('public-recent-search');
  const publicRecentList = document.getElementById('public-recent-list');

  let currentRecentUnitFilter = 'all';
  let currentRecentSearchQuery = '';

  // Ocultar botão público se a lista de inscrições recentes estiver vazia
  if (btnPublicRecent && btnPublicRecent.parentElement) {
    const hasRecent = Boolean(AMO_FISIO_DATA && AMO_FISIO_DATA.recentRegistrations && AMO_FISIO_DATA.recentRegistrations.length > 0);
    btnPublicRecent.parentElement.style.display = hasRecent ? 'block' : 'none';
  }

  // Inicializar opções de unidades no filtro de inscrições recentes
  function initRecentUnitSelect() {
    if (!adminRecentUnitSelect || !AMO_FISIO_DATA || !AMO_FISIO_DATA.units) return;
    
    // Preservar primeira opção "Todas as Cidades"
    adminRecentUnitSelect.innerHTML = '<option value="all">Todas as Cidades</option>';
    
    // Obter unidades ativas em ordem alfabética
    const activeUnits = AMO_FISIO_DATA.units
      .filter(u => !u.cancelledByFranchisee)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    activeUnits.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `${u.name} - ${u.state}`;
      adminRecentUnitSelect.appendChild(opt);
    });
  }

  // Renderizar Feed de Inscrições Recentes no Painel Admin
  function renderAdminRecentFeed(unitFilter = 'all', query = '') {
    if (!adminRecentList || !AMO_FISIO_DATA) return;

    const list = AMO_FISIO_DATA.recentRegistrations || [];
    if (adminRecentBadge) {
      adminRecentBadge.textContent = list.length;
    }

    const q = query.toLowerCase().trim();

    const filtered = list.filter(item => {
      if (unitFilter && unitFilter !== 'all' && item.unitId !== unitFilter) {
        return false;
      }
      if (q) {
        const matchTitle = item.courseTitle.toLowerCase().includes(q);
        const matchUnit = item.unitName.toLowerCase().includes(q);
        const matchAttendee = item.attendeeName.toLowerCase().includes(q);
        const matchInstructor = item.instructor ? item.instructor.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchUnit && !matchAttendee && !matchInstructor) return false;
      }
      return true;
    });

    if (adminRecentCounter) {
      adminRecentCounter.textContent = `${filtered.length} ${filtered.length === 1 ? 'inscrição exibida' : 'inscrições exibidas'}`;
    }

    if (filtered.length === 0) {
      if (list.length === 0) {
        if (adminRecentCounter) {
          adminRecentCounter.textContent = '0 inscrições registradas';
        }
        adminRecentList.innerHTML = `
          <div style="text-align: center; padding: 45px 20px; color: var(--text-muted); background: rgba(18, 30, 49, 0.4); border: 1px dashed rgba(255, 255, 255, 0.12); border-radius: 14px;">
            <div style="width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%; background: rgba(123, 224, 248, 0.08); display: flex; align-items: center; justify-content: center; color: var(--cyan-bright);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h4 style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 6px; font-weight: 700;">Aguardando Novas Inscrições</h4>
            <p style="font-size: 0.85rem; max-width: 460px; margin: 0 auto; line-height: 1.5; color: var(--text-secondary);">
              Nenhuma inscrição recente registrada no momento. Conforme os alunos garantirem suas vagas no Sympla, as confirmações reais aparecerão aqui automaticamente.
            </p>
          </div>
        `;
      } else {
        adminRecentList.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: rgba(18, 30, 49, 0.4); border-radius: 12px;">
            <p>Nenhuma inscrição encontrada para os filtros selecionados.</p>
          </div>
        `;
      }
      return;
    }

    // Ocultar banner público se a lista estiver vazia
    if (btnPublicRecent && btnPublicRecent.parentElement) {
      const hasRecent = Boolean(AMO_FISIO_DATA.recentRegistrations && AMO_FISIO_DATA.recentRegistrations.length > 0);
      btnPublicRecent.parentElement.style.display = hasRecent ? 'block' : 'none';
    }

    adminRecentList.innerHTML = filtered.map(item => {
      let statusClass = 'recent-status-confirmed';
      if (item.isSoldOut) {
        statusClass = 'recent-status-soldout';
      } else if (item.isUrgent) {
        statusClass = 'recent-status-urgent';
      }

      return `
        <div class="admin-recent-card">
          <div class="recent-card-top">
            <span class="recent-time-badge">
              <span class="recent-pulse-dot"></span>
              ${item.timeAgoText}
            </span>
            <span class="recent-unit-pill">${item.unitName} - ${item.state}</span>
          </div>

          <div class="recent-card-body">
            <div class="recent-course-title">${item.courseTitle}</div>
            <div class="recent-attendee-info">
              <span>Aluno(a): <strong>${item.attendeeName}</strong></span>
              ${item.instructor ? `<span>• Prof. ${item.instructor}</span>` : ''}
            </div>
          </div>

          <div class="recent-card-footer">
            <span class="recent-status-pill ${statusClass}">
              ${item.statusBadge} • ${item.registeredCount}/${item.capacity} vagas
            </span>

            <a href="${item.symplaUrl}" target="_blank" rel="noopener noreferrer" class="recent-sympla-btn" title="Abrir página no Sympla">
              <span>Ver no Sympla</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // Alternância de Abas no Painel Administrativo
  if (adminTabUnits && adminTabRecent) {
    adminTabUnits.addEventListener('click', () => {
      adminTabUnits.classList.add('active');
      adminTabRecent.classList.remove('active');
      if (adminUnitsTabContent) adminUnitsTabContent.style.display = 'block';
      if (adminRecentFeedView) adminRecentFeedView.style.display = 'none';
    });

    adminTabRecent.addEventListener('click', () => {
      adminTabRecent.classList.add('active');
      adminTabUnits.classList.remove('active');
      if (adminUnitsTabContent) adminUnitsTabContent.style.display = 'none';
      if (adminRecentFeedView) adminRecentFeedView.style.display = 'block';
      initRecentUnitSelect();
      renderAdminRecentFeed(currentRecentUnitFilter, currentRecentSearchQuery);
    });
  }

  // Filtros no Feed Admin
  if (adminRecentSearch) {
    adminRecentSearch.addEventListener('input', (e) => {
      currentRecentSearchQuery = e.target.value;
      renderAdminRecentFeed(currentRecentUnitFilter, currentRecentSearchQuery);
    });
  }

  if (adminRecentUnitSelect) {
    adminRecentUnitSelect.addEventListener('change', (e) => {
      currentRecentUnitFilter = e.target.value;
      renderAdminRecentFeed(currentRecentUnitFilter, currentRecentSearchQuery);
    });
  }

  // Renderização do Modal Público de Últimas Inscrições
  function renderPublicRecentList(query = '') {
    if (!publicRecentList || !AMO_FISIO_DATA) return;

    const list = AMO_FISIO_DATA.recentRegistrations || [];
    const q = query.toLowerCase().trim();

    const filtered = list.filter(item => {
      if (q) {
        const matchTitle = item.courseTitle.toLowerCase().includes(q);
        const matchUnit = item.unitName.toLowerCase().includes(q);
        const matchAttendee = item.attendeeName.toLowerCase().includes(q);
        if (!matchTitle && !matchUnit && !matchAttendee) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      if (list.length === 0) {
        publicRecentList.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: var(--text-muted);">
            <div style="width: 48px; height: 48px; margin: 0 auto 12px; border-radius: 50%; background: rgba(123, 224, 248, 0.08); display: flex; align-items: center; justify-content: center; color: var(--cyan-bright);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <p style="color: var(--text-primary); font-weight: 600; margin-bottom: 4px;">Nenhuma nova inscrição registrada no momento.</p>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Escolha sua unidade na página inicial para garantir a sua vaga!</p>
          </div>
        `;
      } else {
        publicRecentList.innerHTML = `
          <div style="text-align: center; padding: 30px 16px; color: var(--text-muted);">
            <p>Nenhuma inscrição recente encontrada para esta busca.</p>
          </div>
        `;
      }
      return;
    }

    publicRecentList.innerHTML = filtered.map(item => {
      let statusClass = 'recent-status-confirmed';
      if (item.isSoldOut) {
        statusClass = 'recent-status-soldout';
      } else if (item.isUrgent) {
        statusClass = 'recent-status-urgent';
      }

      return `
        <div class="public-recent-card">
          <div class="recent-card-top">
            <span class="recent-time-badge">
              <span class="recent-pulse-dot"></span>
              ${item.timeAgoText}
            </span>
            <span class="recent-unit-pill">${item.unitName} - ${item.state}</span>
          </div>

          <div class="recent-card-body">
            <div class="recent-course-title">${item.courseTitle}</div>
            <div class="recent-attendee-info">
              <span>Nova vaga garantida por <strong>${item.attendeeName}</strong></span>
            </div>
          </div>

          <div class="recent-card-footer">
            <span class="recent-status-pill ${statusClass}">
              ${item.statusBadge}
            </span>

            <a href="${item.symplaUrl}" target="_blank" rel="noopener noreferrer" class="recent-sympla-btn">
              <span>Garantir Vaga no Sympla</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  function openRecentModal() {
    if (modalRecentRegistrations) {
      modalRecentRegistrations.style.display = 'block';
      document.body.style.overflow = 'hidden';
      renderPublicRecentList();
      if (publicRecentSearch) publicRecentSearch.value = '';
    }
  }

  function closeRecentModal() {
    if (modalRecentRegistrations) {
      modalRecentRegistrations.style.display = 'none';
      document.body.style.overflow = '';
      if (window.location.hash === '#inscricoes' || window.location.hash === '#recentes') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }

  if (btnPublicRecent) {
    btnPublicRecent.addEventListener('click', openRecentModal);
  }

  if (modalRecentClose) {
    modalRecentClose.addEventListener('click', closeRecentModal);
  }

  if (modalRecentRegistrations) {
    modalRecentRegistrations.addEventListener('click', (e) => {
      if (e.target === modalRecentRegistrations) {
        closeRecentModal();
      }
    });
  }

  if (publicRecentSearch) {
    publicRecentSearch.addEventListener('input', (e) => {
      renderPublicRecentList(e.target.value);
    });
  }

  // Verificar se acessou diretamente com hash #admin
  if (window.location.hash === '#admin') {
    openAdmin();
  } else if (window.location.hash === '#inscricoes' || window.location.hash === '#recentes') {
    openRecentModal();
  }

  // =========================================================================
  // INICIALIZAÇÃO
  // =========================================================================
  handleUrlRouting();
});

