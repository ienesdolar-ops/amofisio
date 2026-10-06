import fs from 'fs';

let app = fs.readFileSync('app.js', 'utf8');

// Código adicional para gerenciamento das últimas inscrições
const recentLogic = `
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
      opt.textContent = \`\${u.name} - \${u.state}\`;
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
      adminRecentCounter.textContent = \`\${filtered.length} \${filtered.length === 1 ? 'inscrição exibida' : 'inscrições exibidas'}\`;
    }

    if (filtered.length === 0) {
      adminRecentList.innerHTML = \`
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: rgba(18, 30, 49, 0.4); border-radius: 12px;">
          <p>Nenhuma inscrição encontrada para os filtros selecionados.</p>
        </div>
      \`;
      return;
    }

    adminRecentList.innerHTML = filtered.map(item => {
      let statusClass = 'recent-status-confirmed';
      if (item.isSoldOut) {
        statusClass = 'recent-status-soldout';
      } else if (item.isUrgent) {
        statusClass = 'recent-status-urgent';
      }

      return \`
        <div class="admin-recent-card">
          <div class="recent-card-top">
            <span class="recent-time-badge">
              <span class="recent-pulse-dot"></span>
              \${item.timeAgoText}
            </span>
            <span class="recent-unit-pill">\${item.unitName} - \${item.state}</span>
          </div>

          <div class="recent-card-body">
            <div class="recent-course-title">\${item.courseTitle}</div>
            <div class="recent-attendee-info">
              <span>Aluno(a): <strong>\${item.attendeeName}</strong></span>
              \${item.instructor ? \`<span>• Prof. \${item.instructor}</span>\` : ''}
            </div>
          </div>

          <div class="recent-card-footer">
            <span class="recent-status-pill \${statusClass}">
              \${item.statusBadge} • \${item.registeredCount}/\${item.capacity} vagas
            </span>

            <a href="\${item.symplaUrl}" target="_blank" rel="noopener noreferrer" class="recent-sympla-btn" title="Abrir página no Sympla">
              <span>Ver no Sympla</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      \`;
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
      publicRecentList.innerHTML = \`
        <div style="text-align: center; padding: 30px 16px; color: var(--text-muted);">
          <p>Nenhuma inscrição recente encontrada para esta busca.</p>
        </div>
      \`;
      return;
    }

    publicRecentList.innerHTML = filtered.map(item => {
      let statusClass = 'recent-status-confirmed';
      if (item.isSoldOut) {
        statusClass = 'recent-status-soldout';
      } else if (item.isUrgent) {
        statusClass = 'recent-status-urgent';
      }

      return \`
        <div class="public-recent-card">
          <div class="recent-card-top">
            <span class="recent-time-badge">
              <span class="recent-pulse-dot"></span>
              \${item.timeAgoText}
            </span>
            <span class="recent-unit-pill">\${item.unitName} - \${item.state}</span>
          </div>

          <div class="recent-card-body">
            <div class="recent-course-title">\${item.courseTitle}</div>
            <div class="recent-attendee-info">
              <span>Nova vaga garantida por <strong>\${item.attendeeName}</strong></span>
            </div>
          </div>

          <div class="recent-card-footer">
            <span class="recent-status-pill \${statusClass}">
              \${item.statusBadge}
            </span>

            <a href="\${item.symplaUrl}" target="_blank" rel="noopener noreferrer" class="recent-sympla-btn">
              <span>Garantir Vaga no Sympla</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      \`;
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
`;

// Inserir antes da verificação de hash '#admin'
const targetAnchor = "if (window.location.hash === '#admin') {";
if (app.includes(targetAnchor) && !app.includes('renderAdminRecentFeed')) {
  app = app.replace(targetAnchor, recentLogic + '\n  ' + targetAnchor);
  
  // Atualizar hash check para cobrir '#inscricoes' e '#recentes'
  app = app.replace(
    "if (window.location.hash === '#admin') {\n    openAdmin();\n  }",
    "if (window.location.hash === '#admin') {\n    openAdmin();\n  } else if (window.location.hash === '#inscricoes' || window.location.hash === '#recentes') {\n    openRecentModal();\n  }"
  );

  fs.writeFileSync('app.js', app, 'utf8');
  if (fs.existsSync('../app.js')) {
    fs.writeFileSync('../app.js', app, 'utf8');
  }
  console.log('app.js atualizado com sucesso com suporte a últimas inscrições!');
} else {
  console.log('Lógica já presente ou âncora não encontrada em app.js');
}
