import fs from 'fs';

let appCode = fs.readFileSync('app.js', 'utf8');

// Localizar bloco do filteredCourses.map
const mapStartMarker = '${filteredCourses.map(c => {';
const mapEndMarker = "}).join('')}";

const startPos = appCode.indexOf(mapStartMarker);
const endPos = appCode.indexOf(mapEndMarker, startPos);

if (startPos === -1 || endPos === -1) {
  console.error('Marcadores de filteredCourses não encontrados em app.js');
  process.exit(1);
}

const newMapContent = `\${filteredCourses.map(c => {
            if (c.isCancelled) {
              return \`
                <div class="admin-course-row row-cancelled">
                  <div class="admin-course-top">
                    <div class="admin-course-main">
                      <div class="admin-course-title">\${c.title}</div>
                      <div class="admin-course-category">\${c.category || 'Curso Presencial'}\${c.instructor ? \` • \${c.instructor}\` : ''}</div>
                    </div>

                    <div class="admin-course-badges">
                      <span class="admin-confirm-badge status-cancelled">Cancelado pelo franqueado</span>
                      <span class="admin-status-pill status-cancelled">Cancelado</span>
                      <a href="\${c.symplaUrl}" target="_blank" rel="noopener noreferrer" class="admin-sympla-link" title="Abrir página no Sympla">
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
                      <span class="admin-bar-cap-text">\${c.cap} vagas</span>
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
              \`;
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

            const remainingText = c.isSoldOut ? 'Capacidade esgotada' : \`\${c.rem} \${c.rem === 1 ? 'vaga restante' : 'vagas restantes'}\`;
            const confirmBadgeClass = c.isConfirmed ? 'status-confirmed' : 'status-pending';
            const confirmBadgeLabel = c.isConfirmed ? '✓ Confirmado' : \`Faltam \${c.min - c.reg} para confirmar\`;
            const barFillClass = c.isConfirmed ? 'bar-confirmed' : 'bar-pending';

            // Percentual da meta e do preenchimento em relação à capacidade total da turma
            const metaPct = c.cap > 0 ? Math.min(100, Math.round((c.min / c.cap) * 100)) : 50;
            const fillPct = c.cap > 0 ? Math.min(100, Math.round((c.reg / c.cap) * 100)) : 0;

            const tooltipText = \`\${c.reg} inscritos de \${c.cap} vagas totais. Meta mínima para confirmar: \${c.min} alunos. (\${c.isConfirmed ? 'Confirmado' : 'Aguardando confirmação'})\`;

            const fillLabel = fillPct >= 16 ? \`<span class="admin-bar-fill-text">\${c.reg} \${c.reg === 1 ? 'inscrito' : 'inscritos'}</span>\` : '';

            const statusSummaryText = c.isConfirmed
              ? \`<span class="legend-confirmed">✅ Meta atingida (\${c.reg}/\${c.min} mín.)</span> • <strong>\${c.reg}</strong> de \${c.cap} inscritos\`
              : \`<span class="legend-pending">⏳ Faltam \${c.min - c.reg} para a meta (\${c.min} mín.)</span> • <strong>\${c.reg}</strong> de \${c.cap} inscritos\`;

            return \`
              <div class="admin-course-row">
                <div class="admin-course-top">
                  <div class="admin-course-main">
                    <div class="admin-course-title">\${c.title}</div>
                    <div class="admin-course-category">\${c.category || 'Curso Presencial'}\${c.instructor ? \` • \${c.instructor}\` : ''}</div>
                  </div>

                  <div class="admin-course-badges">
                    <span class="admin-confirm-badge \${confirmBadgeClass}">\${confirmBadgeLabel}</span>
                    <span class="admin-status-pill \${statusPillClass}">\${statusLabel}</span>

                    <a href="\${c.symplaUrl}" target="_blank" rel="noopener noreferrer" class="admin-sympla-link" title="Abrir página no Sympla">
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
                  <div class="admin-unified-bar-track" title="\${tooltipText}">
                    <!-- Preenchimento dos Inscritos -->
                    <div class="admin-unified-bar-fill \${barFillClass}" style="width: \${fillPct}%;">
                      \${fillLabel}
                    </div>

                    <!-- Marcador da META DENTRO DA BARRA -->
                    <div class="admin-unified-bar-meta-marker" style="left: \${metaPct}%;" title="Meta mínima: \${c.min} alunos para confirmar">
                      <div class="meta-line"></div>
                      <div class="meta-flag">Meta: \${c.min}</div>
                    </div>

                    <!-- Vagas Totais no canto direito da barra -->
                    <span class="admin-bar-cap-text">\${c.cap} vagas</span>
                  </div>

                  <!-- Legenda sob a barra -->
                  <div class="admin-unified-bar-legend">
                    <div class="legend-left">
                      \${statusSummaryText}
                    </div>
                    <div class="legend-right">
                      \${remainingText}
                    </div>
                  </div>
                </div>
              </div>
            \`;
          }`;

const updatedCode = appCode.substring(0, startPos) + newMapContent + appCode.substring(endPos);
fs.writeFileSync('app.js', updatedCode, 'utf8');
fs.writeFileSync('../app.js', updatedCode, 'utf8');

console.log('APP_ATUALIZADO_COM_SUCESSO');
