/**
 * BASE DE DADOS DO EVENTO AMO FISIO - FACULDADE INSPIRAR
 * Todas as unidades, cursos e links oficiais do Sympla.
 */

const AMO_FISIO_DATA = {
  eventInfo: {
    title: "Amo Fisio",
    subtitle: "Faculdade Inspirar",
    tagline: "O maior evento de Fisioterapia da Faculdade Inspirar",
    description: "Selecione a sua unidade para conferir os cursos disponíveis e garantir sua vaga presencial.",
    instagramUrl: "https://www.instagram.com/faculdadeinspirar/",
    websiteUrl: "https://www.inspirar.com.br",
    whatsappUrl: "https://api.whatsapp.com/send?phone=558000000000&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20evento%20Amo%20Fisio"
  },

  units: [
    {
      id: "vitoria",
      name: "Vitória",
      state: "ES",
      fullName: "Faculdade Inspirar Vitória",
      address: "Vitória - ES",
      featured: true,
      courses: [
        {
          id: "limpeza-de-pele",
          title: "Limpeza de Pele Personalizada - Protocolos para Peles Young & Old",
          category: "Dermatofuncional & Estética",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-limpeza-de-pele-personalizada-protocolos-para-peles-young-old/3557069",
          status: "available",
          description: "Protocolos avançados e personalizados para diferentes faixas etárias e tipos de pele."
        },
        {
          id: "somatotopias-reflexologias-mtc",
          title: "Somatotopias e Reflexologias na MTC - Mapas do corpo para o cuidado integral",
          category: "Medicina Tradicional Chinesa & Acupuntura",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-somatotopias-e-reflexologias-na-mtc-mapas-do-corpo-para-o-cuidado-integral/3556990",
          status: "available",
          description: "Mapas corporais, somatotopias e técnicas de reflexologia para o cuidado integral."
        },
        {
          id: "ventosoterapia",
          title: "Como avaliar e aplicar a técnica de Ventosoterapia",
          category: "Terapia Manual & MTC",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-como-avaliar-e-aplicar-a-tecnica-de-ventosoterapia/3556996",
          status: "available",
          description: "Fundamentos práticos de avaliação e aplicação clínica da ventosoterapia."
        },
        {
          id: "saude-mental-acupuntura",
          title: "Saúde Mental e Acupuntura - Fundamentos e ferramentas da MTC para o cuidado da mente",
          category: "MTC & Saúde Mental",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-saude-mental-e-acupuntura-fundamentos-e-ferramentas-da-mtc-para-o-cuidado-da-mente/3556987",
          status: "available",
          description: "Fundamentos e ferramentas práticas da MTC para o cuidado da mente e saúde emocional."
        },
        {
          id: "manipulacao-fascias",
          title: "Manipulação das Fáscias: Da Avaliação ao Tratamento",
          category: "Terapia Manual & Fáscias",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-manipulacao-das-fascias-da-avaliacao-ao-tratamento/3557045",
          status: "available",
          description: "Avaliação fascial e técnicas práticas de manipulação miofascial para reabilitação."
        },
        {
          id: "tuina-atletas",
          title: "Tuiná no Tratamento de Atletas",
          category: "MTC & Fisioterapia Esportiva",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-tuina-no-tratamento-de-atletas/3556968",
          status: "available",
          description: "Aplicação das técnicas milenares do Tuiná na recuperação e alta performance de atletas."
        },
        {
          id: "lipedema-vitoria",
          title: "Atuação do Fisioterapeuta no Tratamento do Lipedema – Do diagnóstico ao Tratamento",
          category: "Dermatofuncional & Vascular",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-atuacao-do-fisioterapeuta-no-tratamento-do-lipedema-do-diagnostico-ao-tratamento/3557056",
          status: "available",
          description: "Condutas terapêuticas completas para diagnóstico, manejo clínico e tratamento do Lipedema."
        }
      ]
    },

    {
      id: "sorocaba",
      name: "Sorocaba",
      state: "SP",
      fullName: "Faculdade Inspirar Sorocaba",
      address: "Sorocaba - SP",
      featured: false,
      courses: [
        {
          id: "neurodegenerativas-sorocaba",
          title: "Atuação do Fisioterapeuta nas Doenças Neurodegenerativas e Demências na Pessoa Idosa",
          category: "Neurofuncional & Gerontologia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-atuacao-do-fisioterapeuta-nas-doencas-neurodegenerativas-e-demencias-na-pessoa-idosa/3555397",
          status: "available",
          description: "Estratégias de intervenção fisioterapêutica e reabilitação em demências e doenças neurodegenerativas."
        },
        {
          id: "raciocinio-pelvica-sorocaba",
          title: "Construção do Raciocínio Clínico na Fisioterapia Pélvica",
          category: "Fisioterapia Pélvica & Saúde da Mulher",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-construcao-do-raciocinio-clinico-na-fisioterapia-pelvica/3555390",
          status: "available",
          description: "Metodologia prática para diagnóstico assertivo e estruturação de condutas em fisioterapia pélvica."
        }
      ]
    },

    {
      id: "sp-vila-mariana",
      name: "São Paulo - Vila Mariana",
      state: "SP",
      fullName: "Faculdade Inspirar São Paulo (Vila Mariana)",
      address: "Vila Mariana, São Paulo - SP",
      featured: false,
      courses: [
        {
          id: "fotobiomodulacao-vila-mariana",
          title: "Fotobiomodulação: Ampliando Possibilidades na Prática Clínica",
          category: "Eletroterapia & Prática Clínica",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fotobiomodulacao-ampliando-possibilidades-na-pratica-clinica/3555403",
          status: "available",
          description: "Laserterapia e fotobiomodulação aplicada com evidências para acelerar a regeneração e modular a dor."
        },
        {
          id: "fisioterapia-domiciliar-vila-mariana",
          title: "O Paciente Está em Casa. E Agora? Desafios e Decisões da Fisioterapia Domiciliar",
          category: "Home Care & Atendimento Domiciliar",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-o-paciente-esta-em-casa-e-agora-desafios-e-decisoes-da-fisioterapia-domiciliar/3555399",
          status: "available",
          description: "Tomada de decisão clínica, biossegurança, adaptação de ambiente e condutas no atendimento domiciliar."
        }
      ]
    },

    {
      id: "sp-borba-gato",
      name: "São Paulo - Borba Gato",
      state: "SP",
      fullName: "Faculdade Inspirar São Paulo (Borba Gato)",
      address: "Borba Gato, Santo Amaro, São Paulo - SP",
      featured: false,
      courses: [
        {
          id: "como-tratar-lipedema-borba-gato",
          title: "Como Tratar Lipedema",
          category: "Dermatofuncional & Vascular",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-como-tratar-lipedema/3555339",
          status: "available",
          description: "Protocolos baseados em evidência para avaliação, descompressão tecidual e tratamento do lipedema."
        },
        {
          id: "fisiotech-tcar-ondas-choque",
          title: "FisioTech Experience: TCAR e Ondas de Choque na Prática Clínica",
          category: "Tecnologias Avançadas & Ortopedia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisiotech-experience-tcar-e-ondas-de-choque-na-pratica-clinica/3555369",
          status: "available",
          description: "Experiência prática de alta tecnologia com Tecarterapia e Ondas de Choque na recuperação musculoesquelética."
        }
      ]
    },

    {
      id: "sao-luis",
      name: "São Luís",
      state: "MA",
      fullName: "Faculdade Inspirar São Luís",
      address: "Rua dos Lotus, 11 quadra 01, Jardim Renascença 2 - São Luís/MA",
      featured: false,
      courses: [
        {
          id: "lca-pratica-sao-luis",
          title: "LCA na prática - da lesão ao retorno ao esporte",
          category: "Fisioterapia Esportiva & Ortopedia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-lca-na-pratica-da-lesao-ao-retorno-ao-esporte/3552163",
          status: "available",
          description: "Reabilitação completa de Ligamento Cruzado Anterior: critérios de progressão e testes de Return to Play."
        },
        {
          id: "injetaveis-dermato-sao-luis",
          title: "Do raciocínio clínico à prática com injetáveis na Fisioterapia Dermatofuncional",
          category: "Dermatofuncional & Injetáveis",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-do-raciocinio-clinico-a-pratica-com-injetaveis-na-fisioterapia-dermatofuncional/3552138",
          status: "available",
          description: "Fundamentos, segurança, indicações e técnicas injetáveis na estética e reabilitação tegumentar."
        },
        {
          id: "exercicios-funcionais-idosos-sao-luis",
          title: "Exercícios Funcionais em Grupo para Idosos",
          category: "Gerontologia & Cinesioterapia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-exercicios-funcionais-em-grupo-para-idosos/3557081",
          status: "available",
          description: "Dinâmicas de treinamento funcional coletivo para melhora do equilíbrio, força e autonomia na terceira idade."
        },
        {
          id: "mobilizacao-paciente-critico-sao-luis",
          title: "Domine a Mobilização do Paciente Crítico com Segurança",
          category: "Fisioterapia Hospitalar & UTI",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-domine-a-mobilizacao-do-paciente-critico-com-seguranca/3552149",
          status: "available",
          description: "Critérios de segurança, monitorização hemodinâmica e mobilização precoce em Unidade de Terapia Intensiva."
        },
        {
          id: "tea-pediatria-sao-luis",
          title: "Intervenções Fisioterapêuticas, Diagnósticas e Terapêuticas na Criança TEA",
          category: "Fisioterapia Pediátrica & Neurodesenvolvimento",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-intervencoes-fisioterapeuticas-diagnosticas-e-terapeuticas-na-crianca-tea/3552156",
          status: "available",
          description: "Avaliação motora, integração sensorial e condutas terapêuticas lúdicas no Transtorno do Espectro Autista."
        },
        {
          id: "reabilitacao-cancer-mama-sao-luis",
          title: "Reabilitação funcional no câncer de mama",
          category: "Fisioterapia Oncológica",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-reabilitacao-funcional-no-cancer-de-mama/3557073",
          status: "available",
          description: "Do pós-operatório imediato ao manejo do linfedema e retorno às atividades de vida diária."
        },
        {
          id: "neonatologia-critica-sao-luis",
          title: "Boas práticas em neonatologia em situações críticas",
          category: "Neonatologia & Pediatria Crítica",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-boas-praticas-em-neonatologia-em-situacoes-criticas/3557098",
          status: "available",
          description: "Posicionamento terapêutico, ventilação mecânica neonatal e assistência integral ao recém-nascido crítico."
        }
      ]
    },

    {
      id: "sao-jose-dos-campos",
      name: "São José dos Campos",
      state: "SP",
      fullName: "Faculdade Inspirar São José dos Campos",
      address: "São José dos Campos - SP",
      featured: false,
      courses: [
        {
          id: "pelvica-promissora-sjc",
          title: "Fisioterapia Pélvica é uma área promissora. Entenda o porquê!",
          category: "Fisioterapia Pélvica & Carreira",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-pelvica-e-uma-area-promissora-entenda-o-porque/3553362",
          status: "available",
          description: "Panorama de mercado, diferenciais de atuação e oportunidades clínicas da fisioterapia pélvica."
        },
        {
          id: "atm-repercussoes-sjc",
          title: "Disfunções na ATM e suas repercussões no corpo humano",
          category: "Terapia Manual & DTM",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-disfuncoes-na-atm-e-suas-repercussoes-no-corpo-humano/3553401",
          status: "available",
          description: "Conexões biomecânicas entre a Articulação Temporomandibular, coluna cervical e postura corporal."
        }
      ]
    },

    {
      id: "londrina",
      name: "Londrina",
      state: "PR",
      fullName: "Faculdade Inspirar Londrina",
      address: "Londrina - PR",
      featured: false,
      courses: [
        {
          id: "estrategias-nutricionais-londrina",
          title: "Estratégias Nutricionais na Prevenção e Tratamento de Lesões no Esporte",
          category: "Nutrição Esportiva & Fisioterapia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-estrategias-nutricionais-na-prevencao-e-tratamento-de-lesoes-no-esporte/3555278",
          status: "available",
          description: "Abordagem interdisciplinar entre suporte nutricional e fisioterapia na recuperação e prevenção de lesões."
        },
        {
          id: "lesoes-musculares-londrina",
          title: "Lesões Musculares em Atletas: Diagnóstico e Tratamento Baseado em Evidências",
          category: "Fisioterapia Esportiva",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-lesoes-musculares-em-atletas-diagnostico-e-tratamento-baseado-em-evidencias/3555322",
          status: "available",
          description: "Classificação ecográfica/clínica, dosagem de carga e reabilitação baseada nas melhores evidências mundiais."
        },
        {
          id: "introducao-quiropraxia-londrina",
          title: "Introdução à Quiropraxia",
          category: "Quiropraxia & Terapia Manual",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-introducao-a-quiropraxia/3555299",
          status: "available",
          description: "Fundamentos teóricos e princípios dos ajustes articulares quiropráticos para alinhamento vertebral."
        }
      ]
    },

    {
      id: "guarulhos",
      name: "Guarulhos",
      state: "SP",
      fullName: "Faculdade Inspirar Guarulhos",
      address: "Guarulhos - SP",
      featured: false,
      courses: [
        {
          id: "traumato-esportiva-quiro-guarulhos",
          title: "Fisioterapia Traumato-Ortopédica, Esportiva e Quiropraxia",
          category: "Ortopedia & Quiropraxia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-traumato-ortopedica-esportiva-e-quiropraxia/3552221",
          status: "available",
          description: "Integração prática da reabilitação ortopédica com ajustes de quiropraxia para rápida recuperação funcional."
        },
        {
          id: "respiratoria-guarulhos",
          title: "Técnicas e Manobras de Fisioterapia Respiratória – Adulto e Pediátrico",
          category: "Fisioterapia Respiratória",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-tecnicas-e-manobras-de-fisioterapia-respiratoria-adulto-e-pediatrico/3552255",
          status: "available",
          description: "Manobras de desobstrução brônquica e reexpansão pulmonar em pacientes adultos e pediátricos."
        },
        {
          id: "disfuncoes-sexuais-guarulhos",
          title: "Fisioterapia nas Disfunções Sexuais",
          category: "Fisioterapia Pélvica & Sexologia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-nas-disfuncoes-sexuais/3552239",
          status: "available",
          description: "Manejo fisioterapêutico de vaginismo, dispareunia, disfunção erétil e dores pélvicas crônicas."
        },
        {
          id: "urgencia-emergencia-guarulhos",
          title: "Atuação na Urgência, Emergência e Terapia Intensiva",
          category: "Fisioterapia Hospitalar & UTI",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-atuacao-na-urgencia-emergencia-e-terapia-intensiva/3552251",
          status: "available",
          description: "Atuação ágil e segura em pronto-socorro, paradas cardiorrespiratórias e suporte ventilatório avançado."
        },
        {
          id: "esporte-performance-guarulhos",
          title: "Fisioterapia no Esporte – Prevenção, Reabilitação e Performance",
          category: "Fisioterapia Esportiva",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-no-esporte-prevencao-reabilitacao-e-performance/3552228",
          status: "available",
          description: "Avaliação funcional do movimento, controle de sobrecarga e estratégias de ganho de rendimento atlético."
        },
        {
          id: "microagulhamento-guarulhos",
          title: "Microagulhamento – da teoria à prática",
          category: "Dermatofuncional & Estética",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-microagulhamento-da-teoria-a-pratica/3552207",
          status: "available",
          description: "Técnica de indução percutânea de colágeno, drug delivery e protocolos para rejuvenescimento e cicatrizes."
        }
      ]
    },

    {
      id: "cuiaba",
      name: "Cuiabá",
      state: "MT",
      fullName: "Faculdade Inspirar Cuiabá",
      address: "Cuiabá - MT",
      featured: false,
      courses: [
        {
          id: "recuperacao-uti-cuiaba",
          title: "Recuperação Funcional da Criança na UTI",
          category: "Fisioterapia Pediátrica & UTI",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-recuperacao-funcional-da-crianca-na-uti/3552045",
          status: "available",
          description: "Estratégias de reabilitação e desmame ventilatório na UTI Pediátrica para preservação funcional da criança."
        },
        {
          id: "corrida-inteligente-cuiaba",
          title: "Corrida Inteligente - Atuação da Fisioterapia",
          category: "Fisioterapia Esportiva & Corrida",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-corrida-inteligente-atuacao-da-fisioterapia/3552122",
          status: "available",
          description: "Análise biomecânica do padrão de corrida, calçados e prevenção de lesões comuns em corredores."
        },
        {
          id: "harmonizacao-facial-cuiaba",
          title: "Fisioterapia Dermato Funcional - Full Face Estratégico na Harmonização Facial",
          category: "Dermatofuncional & Harmonização Facial",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-dermato-funcional-full-face-estrategico-na-harmonizacao-facial/3552028",
          status: "available",
          description: "Abordagem anatômica global da face para tratamentos estéticos e regenerativos integrados."
        },
        {
          id: "gestacao-parto-cuiaba",
          title: "Atuação da Fisioterapia na Gestação e Parto",
          category: "Saúde da Mulher & Obstetrícia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-atuacao-da-fisioterapia-na-gestacao-e-parto/3552112",
          status: "available",
          description: "Preparação corporal no pré-natal, alívio não farmacológico da dor e condução biomecânica no trabalho de parto."
        },
        {
          id: "neurofuncional-pediatrica-cuiaba",
          title: "Fisioterapia Neurofuncional Pediátrica e seu Campo de Atuação",
          category: "Neurofuncional Pediátrica",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-neurofuncional-pediatrica-e-seu-campo-de-atuacao/3552098",
          status: "available",
          description: "Conceitos neurológicos, escalas de desenvolvimento e estimulação precoce na neuropediatria."
        },
        {
          id: "biomecanica-cinesioterapia-cuiaba",
          title: "Biomecânica e Cinesioterapia - Aplicação Perfeita de Exercícios",
          category: "Cinesioterapia & Biomecânica",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-biomecanica-e-cinesioterapia-aplicacao-perfeita-de-exercicios/3552076",
          status: "available",
          description: "Braço de momento, linhas de ação muscular e prescrição precisa de exercícios terapêuticos."
        }
      ]
    },

    {
      id: "campo-grande",
      name: "Campo Grande",
      state: "MS",
      fullName: "Faculdade Inspirar Campo Grande",
      address: "Campo Grande - MS",
      featured: false,
      bannerNotice: "🔥 Valor Promocional: R$ 30,00 garante acesso aos 4 cursos da unidade!",
      courses: [
        {
          id: "home-care-campo-grande",
          title: "Fisioterapia Além da Clínica - Home Care",
          category: "Passaporte Especial • 4 Cursos por R$ 30",
          badge: "Combo R$ 30 (4 Cursos)",
          priceInfo: "R$ 30,00 (Acesso a 4 cursos)",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-fisioterapia-alem-da-clinica-home-care/3555189",
          status: "available",
          description: "Inscrição com valor único de R$ 30,00 que dá acesso completo aos 4 cursos diferentes da unidade Campo Grande."
        }
      ]
    },

    {
      id: "bauru",
      name: "Bauru",
      state: "SP",
      fullName: "Faculdade Inspirar Bauru",
      address: "Bauru - SP",
      featured: false,
      courses: [
        {
          id: "canetas-emagrecedoras-bauru",
          title: "Abordagem Estética e Cosmetológica ao Paciente em Uso de Canetas Emagrecedoras",
          category: "Dermatofuncional & Cosmetologia",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-abordagem-estetica-e-cosmetologica-ao-paciente-em-uso-de-canetas-emagrecedoras/3552261",
          status: "available",
          description: "Manejo da flacidez tissular e protocolos estéticos adaptados aos efeitos do emagrecimento rápido."
        },
        {
          id: "neuropediatria-cif-bauru",
          title: "Neuropediatria – usando a CIF e escalas para planejar intervenções",
          category: "Neuropediatria & CIF",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-neuropediatria-usando-a-cif-e-escalas-para-planejar-intervencoes/3552294",
          status: "available",
          description: "Utilização prática da Classificação Internacional de Funcionalidade para mensuração de metas clínicas."
        },
        {
          id: "pbe-esportiva-bauru",
          title: "Como a PBE pode auxiliar o fisioterapeuta esportivo?",
          category: "Prática Baseada em Evidências",
          badge: "Presencial",
          priceInfo: "",
          symplaUrl: "https://www.sympla.com.br/evento/amofisio-como-a-pbe-pode-auxiliar-o-fisioterapeuta-esportivo/3552282",
          status: "available",
          description: "Como aplicar artigos científicos de alta qualidade para fundamentar tratamentos e condutas no esporte."
        }
      ]
    }
  ]
};
