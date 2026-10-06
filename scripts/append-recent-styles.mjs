import fs from 'fs';

const cssContent = `
/* =========================================================================
   FEED E MODAL DE ÚLTIMAS INSCRIÇÕES (TEMPO REAL)
   ========================================================================= */

/* Pulse dot animado */
.recent-pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-green 1.8s infinite cubic-bezier(0.66, 0, 0, 1);
  flex-shrink: 0;
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Botão Banner Público */
.public-recent-banner-wrapper {
  margin: 12px auto 6px;
  width: 100%;
  max-width: 580px;
}

.btn-public-recent {
  width: 100%;
  background: rgba(18, 30, 49, 0.85);
  border: 1px solid rgba(123, 224, 248, 0.3);
  border-radius: 12px;
  padding: 10px 16px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.btn-public-recent:hover {
  background: rgba(26, 42, 68, 0.95);
  border-color: var(--cyan-bright);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(123, 224, 248, 0.15);
}

.recent-bolt-icon {
  color: #FBBF24;
  flex-shrink: 0;
}

.recent-banner-text {
  font-size: 0.84rem;
  color: var(--text-secondary);
  flex: 1;
  text-align: left;
}

.recent-banner-text strong {
  color: var(--cyan-bright);
  font-weight: 700;
}

.recent-arrow-icon {
  color: var(--text-muted);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.btn-public-recent:hover .recent-arrow-icon {
  transform: translateX(3px);
  color: var(--cyan-bright);
}

/* Navegação de Abas no Admin */
.admin-tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.admin-tab-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  color: var(--text-secondary);
  padding: 9px 16px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.admin-tab-btn.active {
  background: rgba(123, 224, 248, 0.14);
  border-color: rgba(123, 224, 248, 0.45);
  color: var(--cyan-bright);
  box-shadow: 0 0 12px rgba(123, 224, 248, 0.1);
}

.admin-tab-badge {
  background: #10B981;
  color: #FFFFFF;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 10px;
  line-height: 1.2;
}

/* Feed de Inscrições Recentes no Admin */
.admin-recent-controls-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

@media (min-width: 640px) {
  .admin-recent-controls-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.admin-recent-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 380px;
}

.admin-recent-search-wrap svg {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.admin-recent-search-wrap input {
  width: 100%;
  background: rgba(18, 30, 49, 0.7);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 9px 12px 9px 36px;
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.admin-recent-search-wrap input:focus {
  border-color: var(--cyan-main);
}

.admin-recent-filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-recent-select {
  background: rgba(18, 30, 49, 0.8);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 0.84rem;
  outline: none;
  cursor: pointer;
}

.admin-recent-counter-pill {
  font-size: 0.76rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Lista do Feed de Inscrições */
.admin-recent-list,
.public-recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-recent-card,
.public-recent-card {
  background: rgba(18, 30, 49, 0.75);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.admin-recent-card:hover,
.public-recent-card:hover {
  background: rgba(24, 38, 62, 0.85);
  border-color: rgba(123, 224, 248, 0.3);
  transform: translateY(-1px);
}

.admin-recent-card::before,
.public-recent-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3.5px;
  background: linear-gradient(180deg, var(--cyan-bright) 0%, #10B981 100%);
}

.recent-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.recent-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.recent-unit-pill {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(123, 224, 248, 0.12);
  color: var(--cyan-bright);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(123, 224, 248, 0.25);
}

.recent-card-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.recent-course-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.recent-attendee-info {
  font-size: 0.78rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-attendee-info strong {
  color: #34D399;
}

.recent-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 2px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.recent-status-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.recent-status-confirmed {
  background: rgba(16, 185, 129, 0.16);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.recent-status-urgent {
  background: rgba(245, 158, 11, 0.18);
  color: #FBBF24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.recent-status-soldout {
  background: rgba(239, 68, 68, 0.18);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.recent-sympla-btn {
  background: rgba(123, 224, 248, 0.1);
  color: var(--cyan-bright);
  border: 1px solid rgba(123, 224, 248, 0.25);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.74rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.recent-sympla-btn:hover {
  background: rgba(123, 224, 248, 0.22);
  border-color: var(--cyan-bright);
}

/* Modal Público de Últimas Inscrições */
.modal-recent-card {
  max-width: 640px !important;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.public-recent-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
  text-align: left;
}

.public-recent-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.public-recent-icon-wrap .recent-pulse-dot {
  position: absolute;
  top: 6px;
  right: 6px;
}

.public-recent-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.public-recent-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.public-recent-filter-bar {
  margin-bottom: 14px;
}

.public-recent-search-input {
  width: 100%;
  background: rgba(7, 16, 29, 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 0.86rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.public-recent-search-input:focus {
  border-color: var(--cyan-main);
}

.public-recent-list {
  overflow-y: auto;
  max-height: 52vh;
  padding-right: 4px;
}
`;

const curCss = fs.readFileSync('style.css', 'utf8');
if (!curCss.includes('admin-tabs-nav')) {
  fs.writeFileSync('style.css', curCss + '\n' + cssContent, 'utf8');
  if (fs.existsSync('../style.css')) {
    fs.writeFileSync('../style.css', curCss + '\n' + cssContent, 'utf8');
  }
  console.log('Estilos adicionados com sucesso ao style.css!');
} else {
  console.log('Estilos já existem em style.css.');
}
