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
      if (!query) return true;
      const matchUnit = unit.name.toLowerCase().includes(query) || 
                        unit.state.toLowerCase().includes(query) ||
                        unit.fullName.toLowerCase().includes(query);
      
      const matchCourse = unit.courses.some(course => 
        course.title.toLowerCase().includes(query) || 
        course.category.toLowerCase().includes(query)
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
    if (!unit) {
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
      card.className = 'course-card';

      // Badge e Meta info
      const categoryHtml = course.category ? `
        <span class="course-category-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${course.category}
        </span>
      ` : '';

      const badgeHtml = course.badge ? `
        <span class="course-badge-pill">${course.badge}</span>
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
      const isAvailable = course.status !== 'soon';
      const btnText = isAvailable ? 'Garantir Vaga no Sympla' : 'Inscrições em Breve';

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
            class="btn-sympla" 
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
  // INICIALIZAÇÃO
  // =========================================================================
  handleUrlRouting();
});
