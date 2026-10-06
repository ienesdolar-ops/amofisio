import fs from 'fs';

const cssContent = fs.readFileSync('style.css', 'utf8');
const lines = cssContent.split(/\r?\n/);

const startIdx = lines.findIndex(l => l.trim() === '.admin-course-row {');
if (startIdx === -1) {
  console.error('Ponto inicial .admin-course-row não encontrado');
  process.exit(1);
}

const before = lines.slice(0, startIdx).join('\n');

const newCSS = `.admin-course-row {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: background 0.15s ease;
}

.admin-course-row:last-child {
  border-bottom: none;
}

.admin-course-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.admin-course-top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (min-width: 768px) {
  .admin-course-top {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.admin-course-main {
  flex: 1;
}

.admin-course-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
  margin-bottom: 3px;
}

.admin-course-category {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.admin-course-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Badges Status */
.admin-status-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.status-soldout {
  background: rgba(239, 68, 68, 0.18);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.status-urgent {
  background: rgba(245, 158, 11, 0.18);
  color: #FBBF24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.status-normal {
  background: rgba(52, 211, 153, 0.14);
  color: #34D399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.admin-confirm-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.status-confirmed {
  background: rgba(16, 185, 129, 0.18);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.45);
}

.status-pending {
  background: rgba(245, 158, 11, 0.16);
  color: #FBBF24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.18);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.admin-sympla-link {
  color: var(--cyan-bright);
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: rgba(123, 224, 248, 0.08);
}

.admin-sympla-link:hover {
  background: rgba(123, 224, 248, 0.18);
  transform: scale(1.05);
}

/* =========================================================================
   BARRA ÚNICA COM META INTERNA (ALTA VISIBILIDADE)
   ========================================================================= */

.admin-unified-bar-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 4px;
}

.admin-unified-bar-track {
  width: 100%;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.4);
  overflow: visible;
}

.admin-unified-bar-track.bar-track-cancelled {
  background: repeating-linear-gradient(
    45deg,
    rgba(239, 68, 68, 0.08),
    rgba(239, 68, 68, 0.08) 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
  border-color: rgba(239, 68, 68, 0.25);
}

/* Preenchimento dos Inscritos */
.admin-unified-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  transition: width 0.4s ease;
  z-index: 2;
  overflow: hidden;
}

.admin-unified-bar-fill.bar-confirmed {
  background: linear-gradient(90deg, #059669 0%, #10B981 60%, #34D399 100%);
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.55);
}

.admin-unified-bar-fill.bar-pending {
  background: linear-gradient(90deg, #D97706 0%, #F59E0B 100%);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
}

.admin-unified-bar-fill.bar-cancelled {
  background: #475569;
  opacity: 0.35;
}

.admin-bar-fill-text {
  font-size: 0.78rem;
  font-weight: 800;
  color: #FFFFFF;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  padding-left: 10px;
  white-space: nowrap;
}

/* Marcador da Meta DENTRO da Barra */
.admin-unified-bar-meta-marker {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 0;
  transform: translateX(-50%);
  z-index: 5;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.meta-line {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 2.5px;
  background: #FFFFFF;
  box-shadow: 0 0 6px #FFFFFF, 0 0 2px rgba(0, 0, 0, 0.9);
  border-radius: 1px;
}

.meta-flag {
  position: relative;
  background: #0F172A;
  color: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  letter-spacing: 0.02em;
  z-index: 6;
}

/* Capacidade Total no canto direito */
.admin-bar-cap-text {
  position: absolute;
  right: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  pointer-events: none;
  z-index: 3;
}

.admin-cancelled-text-overlay {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 0.76rem;
  font-weight: 700;
  color: #F87171;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  pointer-events: none;
  z-index: 3;
}

/* Legenda sob a barra */
.admin-unified-bar-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.74rem;
  color: var(--text-muted);
  padding: 0 2px;
  flex-wrap: wrap;
  gap: 6px;
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-left strong {
  color: var(--text-primary);
}

.legend-right {
  font-weight: 600;
  color: var(--text-secondary);
}

.legend-confirmed {
  color: #34D399;
  font-weight: 700;
}

.legend-pending {
  color: #FBBF24;
  font-weight: 700;
}

.legend-cancelled {
  color: #F87171;
  font-weight: 700;
}

/* Unidade e Cursos Cancelados (São José dos Campos) */
.admin-unit-card.unit-cancelled {
  border-color: rgba(239, 68, 68, 0.25);
  background: rgba(30, 20, 25, 0.6);
}

.admin-unit-cancelled-badge {
  background: rgba(239, 68, 68, 0.18);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
  font-size: 0.70rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-left: 8px;
}

.admin-unit-percent-badge.pct-cancelled {
  background: rgba(239, 68, 68, 0.16);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.admin-course-row.row-cancelled {
  opacity: 0.85;
  background: rgba(239, 68, 68, 0.02);
}

.admin-unit-confirmed-summary {
  font-size: 0.76rem;
  color: #34D399;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.dot-green {
  width: 6px;
  height: 6px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10B981;
}

.admin-unit-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-copy-report-btn {
  background: rgba(123, 224, 248, 0.08);
  color: var(--cyan-bright);
  border: 1px solid rgba(123, 224, 248, 0.2);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.admin-copy-report-btn:hover {
  background: rgba(123, 224, 248, 0.18);
  border-color: var(--cyan-bright);
}
`;

const finalCSS = before + '\n' + newCSS;
fs.writeFileSync('style.css', finalCSS, 'utf8');
fs.writeFileSync('../style.css', finalCSS, 'utf8');

console.log('STYLE_ATUALIZADO_COM_SUCESSO');
