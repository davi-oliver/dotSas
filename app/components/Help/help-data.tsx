import {
    FileText,
    Settings,
    Users,
    ShoppingCart,
    CreditCard,
    BarChart,
    RefreshCcw,
    type LucideIcon,
  } from "lucide-react"
  
  export interface Article {
    id: string
    title: string
    description: string
    content: string
    updatedAt: string
    readTime: string
    relatedArticles?: string[]
  }
  
  export interface Category {
    id: string
    name: string
    icon: LucideIcon
    articles: Article[]
  }
  
  export interface FAQ {
    id: string
    category: string
    question: string
    answer: string
  }
  
  export const helpData = {
    categories: [
      {
        id: "getting-started",
        name: "Primeiros Passos",
        icon: FileText,
        articles: [
          {
            id: "welcome-guide",
            title: "Guia de Boas-vindas",
            description: "Aprenda a configurar sua conta e dar os primeiros passos no sistema.",
            content: `Bem-vindo ao nosso sistema! Este guia irá ajudá-lo a começar a usar nossa plataforma de forma eficiente e produtiva.
  
  ## Configurando sua Conta
  
  Após fazer o login pela primeira vez, recomendamos que você personalize sua conta para melhorar sua experiência. Siga estas etapas simples:
  
  1. Acesse seu perfil no canto superior direito da tela
  2. Complete suas  Siga estas etapas simples:
  
  1. Acesse seu perfil no canto superior direito da tela
  2. Complete suas informações pessoais
  3. Atualize sua foto de perfil
  4. Defina suas preferências de notificação
  
  ## Navegação Básica
  
  Nossa interface foi projetada para ser intuitiva e fácil de usar. A barra lateral esquerda contém todas as principais seções do sistema:
  
  - Dashboard: Visão geral das suas atividades e métricas
  - Produtos: Gerenciamento de catálogo de produtos
  - Clientes: Base de dados de clientes e histórico
  - Pagamentos: Processamento de transações e histórico financeiro
  - Relatórios: Análise de dados e desempenho
  
  ## Recursos Principais
  
  Nossa plataforma oferece diversos recursos para otimizar seu trabalho diário:
  
  - Cadastro de produtos com descrições detalhadas e imagens
  - Gerenciamento de estoque com alertas automáticos
  - Base de clientes centralizada com histórico de compras
  - Sistema de faturamento integrado com múltiplas formas de pagamento
  - Relatórios personalizáveis para análise de desempenho
  
  ## Próximos Passos
  
  Agora que você conhece o básico, sugerimos explorar os tutoriais específicos para cada área do sistema. Confira nossa seção de vídeos tutoriais ou entre em contato com nossa equipe de suporte se precisar de ajuda adicional.`,
            updatedAt: "10/03/2024",
            readTime: "5 min",
            relatedArticles: ["Configuração de Perfil", "Guia da Dashboard", "Primeiros Clientes"],
          },
          {
            id: "account-setup",
            title: "Configuração de Conta",
            description: "Como configurar sua conta para maximizar a produtividade no sistema.",
            content: `A configuração adequada da sua conta é essencial para aproveitar ao máximo os recursos do nosso sistema. Este guia abrange todas as etapas para você personalizar sua experiência.
  
  ## Informações de Perfil
  
  É importante manter seus dados atualizados para facilitar a comunicação e personalizar sua experiência:
  
  - Nome completo e foto de perfil para fácil identificação
  - Email e telefone para contato
  - Fuso horário para exibição correta de datas e horários
  - Idioma preferido para a interface
  
  ## Preferências de Segurança
  
  A segurança da sua conta é nossa prioridade:
  
  - Configure a autenticação de dois fatores (2FA) para maior proteção
  - Defina uma senha forte e única
  - Gerencie dispositivos conectados e sessões ativas
  - Configure perguntas de segurança para recuperação de conta
  
  ## Notificações
  
  Personalize quais notificações você deseja receber e como:
  
  - Notificações de sistema (atualizações, manutenções)
  - Alertas de segurança
  - Notificações de processos (novos pedidos, pagamentos)
  - Comunicações de marketing e novidades
  
  ## Integrações
  
  Conecte sua conta a outros serviços para expandir funcionalidades:
  
  - Serviços de armazenamento em nuvem
  - Ferramentas de comunicação
  - Sistemas de CRM
  - Plataformas de marketing
  
  ## Usuários e Permissões
  
  Se você é administrador, configure o acesso de outros usuários:
  
  - Adicione novos membros à sua organização
  - Defina funções e permissões específicas
  - Configure hierarquias e estruturas de equipe
  - Monitore atividades de usuários`,
            updatedAt: "05/03/2024",
            readTime: "4 min",
            relatedArticles: ["Segurança da Conta", "Perfil de Administrador", "Gerenciamento de Equipe"],
          },
        ],
      },
      {
        id: "products",
        name: "Produtos",
        icon: ShoppingCart,
        articles: [
          {
            id: "product-management",
            title: "Gerenciamento de Produtos",
            description: "Como adicionar, editar e gerenciar seu catálogo de produtos.",
            content: `O gerenciamento eficiente do seu catálogo de produtos é fundamental para o sucesso do seu negócio. Este guia mostra como utilizar todas as ferramentas disponíveis para administrar seus produtos.
  
  ## Adicionando Novos Produtos
  
  Para adicionar um novo produto ao catálogo:
  
  1. Acesse a seção "Produtos" no menu lateral
  2. Clique no botão "Adicionar Produto"
  3. Preencha as informações básicas (nome, preço, categoria)
  4. Adicione descrições detalhadas e especificações técnicas
  5. Faça upload de imagens de alta qualidade
  6. Configure opções de estoque e disponibilidade
  7. Defina variações do produto (tamanhos, cores, etc.)
  8. Salve o produto
  
  ## Organização do Catálogo
  
  Mantenha seu catálogo organizado para facilitar a navegação:
  
  - Crie categorias e subcategorias lógicas
  - Utilize tags para agrupar produtos semelhantes
  - Destaque produtos populares ou em promoção
  - Organize por marcas ou fornecedores
  
  ## Gestão de Estoque
  
  O controle de estoque preciso evita problemas de vendas:
  
  - Configure níveis mínimos de estoque para alertas automáticos
  - Registre entradas e saídas de mercadorias
  - Realize contagens físicas periódicas
  - Configure regras para produtos esgotados
  
  ## Precificação e Promoções
  
  Estratégias de preço eficientes aumentam suas vendas:
  
  - Defina preços base para todos os produtos
  - Configure descontos por volume ou período
  - Crie pacotes e combos promocionais
  - Programe campanhas sazonais
  
  ## Análise de Desempenho
  
  Monitore o desempenho do seu catálogo:
  
  - Acompanhe vendas por produto e categoria
  - Identifique produtos mais lucrativos
  - Analise tendências de vendas por período
  - Avalie o desempenho de promoções`,
            updatedAt: "12/03/2024",
            readTime: "6 min",
            relatedArticles: ["Cadastro em Massa", "Importação de Produtos", "Estratégias de Precificação"],
          },
          {
            id: "inventory-control",
            title: "Controle de Estoque",
            description: "Métodos e ferramentas para gerenciar seu inventário com eficiência.",
            content: `Um controle de estoque eficiente é essencial para evitar vendas perdidas e capital imobilizado. Este guia apresenta as melhores práticas para gerenciar seu inventário.
  
  ## Configuração Inicial
  
  Para configurar corretamente seu controle de estoque:
  
  1. Defina unidades de medida para seus produtos
  2. Configure locais de armazenamento (depósitos, prateleiras)
  3. Estabeleça políticas de estoque mínimo e máximo
  4. Defina métodos de avaliação de estoque (FIFO, LIFO, etc.)
  
  ## Movimentações de Estoque
  
  Registre todas as movimentações para manter o controle:
  
  - Entradas (compras, devoluções, ajustes)
  - Saídas (vendas, transferências, perdas)
  - Reservas (pedidos em processamento)
  - Separação e expedição
  
  ## Alertas e Notificações
  
  Configure o sistema para alertar sobre situações críticas:
  
  - Produtos abaixo do estoque mínimo
  - Itens próximos ao vencimento
  - Discrepâncias de inventário
  - Produtos sem movimentação
  
  ## Inventário Físico
  
  Realize contagens físicas para garantir precisão:
  
  - Inventários completos periódicos
  - Contagens cíclicas por amostragem
  - Reconciliação de diferenças
  - Documentação de ajustes
  
  ## Relatórios de Estoque
  
  Utilize relatórios para tomar decisões informadas:
  
  - Posição atual de estoque
  - Produtos mais e menos vendidos
  - Giro de estoque por período
  - Previsão de demanda
  - Valorização de inventário`,
            updatedAt: "01/03/2024",
            readTime: "5 min",
            relatedArticles: ["Previsão de Demanda", "Gestão de Fornecedores", "Logística de Entrega"],
          },
        ],
      },
      {
        id: "customers",
        name: "Clientes",
        icon: Users,
        articles: [
          {
            id: "customer-management",
            title: "Gerenciamento de Clientes",
            description: "Como cadastrar e gerenciar informações de clientes no sistema.",
            content: `Um bom gerenciamento de clientes é essencial para construir relacionamentos duradouros. Este guia mostra como utilizar nosso sistema para administrar informações de clientes de forma eficiente.
  
  ## Cadastro de Clientes
  
  Para adicionar um novo cliente:
  
  1. Acesse a seção "Clientes" no menu lateral
  2. Clique no botão "Novo Cliente"
  3. Preencha os dados básicos (nome, contato, endereço)
  4. Adicione informações fiscais quando aplicável
  5. Configure preferências de comunicação
  6. Defina condições comerciais específicas
  7. Salve o cadastro
  
  ## Organização de Clientes
  
  Mantenha sua base de clientes organizada:
  
  - Segmente por tipo (pessoa física, jurídica)
  - Classifique por volume de compras ou frequência
  - Agrupe por região geográfica
  - Categorize por setor de atuação
  
  ## Histórico de Interações
  
  Registre todas as interações para um atendimento personalizado:
  
  - Histórico completo de compras
  - Registro de contatos e comunicações
  - Anotações sobre preferências e necessidades
  - Documentos compartilhados
  
  ## Análise de Clientes
  
  Utilize dados para entender melhor seus clientes:
  
  - Valor médio de compra por cliente
  - Frequência de compras
  - Produtos mais adquiridos
  - Sazonalidade de compras
  
  ## Fidelização e Campanhas
  
  Desenvolva estratégias para fidelização:
  
  - Segmente clientes para campanhas direcionadas
  - Configure programas de fidelidade
  - Defina regras para descontos especiais
  - Crie lembretes para datas importantes`,
            updatedAt: "08/03/2024",
            readTime: "4 min",
            relatedArticles: ["Segmentação de Clientes", "Estratégias de Retenção", "Automação de Marketing"],
          },
          {
            id: "customer-support",
            title: "Suporte ao Cliente",
            description: "Ferramentas e melhores práticas para oferecer suporte excepcional.",
            content: `Um suporte ao cliente eficiente é crucial para a satisfação e retenção de clientes. Este guia apresenta as ferramentas disponíveis em nosso sistema para oferecer um atendimento excepcional.
  
  ## Canais de Atendimento
  
  Nosso sistema oferece múltiplos canais para comunicação:
  
  - Chat ao vivo para atendimento em tempo real
  - Sistema de tickets para acompanhamento de solicitações
  - Email integrado para comunicações formais
  - Integração com telefonia para registros de chamadas
  
  ## Gerenciamento de Tickets
  
  Para um controle eficiente de solicitações:
  
  1. Classifique tickets por tipo e urgência
  2. Estabeleça prazos de atendimento por categoria
  3. Direcione automaticamente para especialistas
  4. Acompanhe tempos de resposta e resolução
  
  ## Base de Conhecimento
  
  Construa uma biblioteca de soluções:
  
  - Crie artigos para problemas comuns
  - Organize por categorias e tópicos
  - Mantenha conteúdo atualizado
  - Permita avaliações dos usuários
  
  ## Automações de Suporte
  
  Aumente a eficiência com automações:
  
  - Respostas automáticas para questões frequentes
  - Fluxos de trabalho predefinidos
  - Notificações de acompanhamento
  - Escalação automática de casos não resolvidos
  
  ## Métricas e Avaliações
  
  Monitore a qualidade do atendimento:
  
  - Índice de satisfação do cliente (CSAT)
  - Tempo médio de resolução
  - Taxa de primeira resolução
  - Análise de feedback de clientes`,
            updatedAt: "15/03/2024",
            readTime: "5 min",
            relatedArticles: ["Gestão de Reclamações", "Scripts de Atendimento", "Métricas de Satisfação"],
          },
        ],
      },
      {
        id: "payments",
        name: "Pagamentos",
        icon: CreditCard,
        articles: [
          {
            id: "payment-processing",
            title: "Processamento de Pagamentos",
            description: "Como configurar e gerenciar métodos de pagamento no sistema.",
            content: `Um sistema de processamento de pagamentos eficiente é fundamental para qualquer negócio. Este guia explica como configurar e gerenciar diferentes métodos de pagamento em nossa plataforma.
  
  ## Configuração de Gateways
  
  Para configurar um gateway de pagamento:
  
  1. Acesse "Configurações" > "Pagamentos"
  2. Selecione o gateway desejado (ex: Stripe, PayPal, Mercado Pago)
  3. Insira as credenciais de API fornecidas pelo gateway
  4. Configure as taxas e comissões
  5. Defina o ambiente (sandbox/produção)
  6. Teste a conexão
  
  ## Métodos de Pagamento
  
  Configure os métodos aceitos pelo seu negócio:
  
  - Cartões de crédito e débito
  - Transferências bancárias
  - Boletos e outros métodos locais
  - Carteiras digitais
  - Pagamentos recorrentes para assinaturas
  
  ## Fluxo de Transações
  
  Entenda o ciclo de vida de uma transação:
  
  1. Autorização: verificação dos dados de pagamento
  2. Captura: confirmação da cobrança
  3. Liquidação: recebimento efetivo dos valores
  4. Estorno/reembolso: devolução de valores quando necessário
  
  ## Segurança de Pagamentos
  
  Garanta a segurança das transações:
  
  - Conformidade com PCI DSS
  - Autenticação 3D Secure
  - Detecção de fraudes e comportamentos suspeitos
  - Criptografia de dados sensíveis
  
  ## Relatórios Financeiros
  
  Monitore sua saúde financeira:
  
  - Relatórios de transações por período
  - Conciliação bancária
  - Projeção de recebimentos
  - Análise de taxas e custos operacionais`,
            updatedAt: "11/03/2024",
            readTime: "6 min",
            relatedArticles: ["Prevenção de Fraudes", "Integração com ERP", "Gestão de Recebimentos"],
          },
          {
            id: "invoicing",
            title: "Faturamento e Notas Fiscais",
            description: "Como gerar e gerenciar documentos fiscais através do sistema.",
            content: `Um processo de faturamento eficiente é essencial para o fluxo financeiro e conformidade fiscal. Este guia explica como utilizar nosso sistema para emissão e gestão de documentos fiscais.
  
  ## Emissão de Notas Fiscais
  
  Para emitir uma nota fiscal:
  
  1. Acesse a seção "Faturamento"
  2. Clique em "Nova Nota Fiscal"
  3. Selecione o cliente destinatário
  4. Adicione os produtos ou serviços
  5. Verifique impostos e alíquotas aplicáveis
  6. Preencha informações adicionais necessárias
  7. Envie para autorização junto à Secretaria da Fazenda
  8. Após autorizada, envie ao cliente
  
  ## Configuração Fiscal
  
  Configure o sistema de acordo com suas obrigações fiscais:
  
  - Cadastro de tributos e alíquotas
  - Regras fiscais por tipo de operação
  - Configurações de CFOP
  - Parâmetros específicos por estado ou município
  
  ## Gestão de Documentos Fiscais
  
  Organize seus documentos para fácil acesso:
  
  - Armazenamento de XMLs e PDFs
  - Histórico por cliente e período
  - Status de cada documento (emitido, cancelado, rejeitado)
  - Controle de numeração sequencial
  
  ## Cancelamentos e Correções
  
  Procedimentos para ajustes em documentos emitidos:
  
  - Cancelamento dentro do prazo legal
  - Emissão de carta de correção
  - Notas fiscais complementares
  - Documentos de ajuste
  
  ## Relatórios Fiscais
  
  Mantenha-se em conformidade com obrigações acessórias:
  
  - Relatórios por período fiscal
  - Resumos de operações por tributo
  - Exportação para contabilidade
  - Preparação para declarações (SPED, GIA, etc.)`,
            updatedAt: "07/03/2024",
            readTime: "5 min",
            relatedArticles: ["Obrigações Fiscais", "Integrações Contábeis", "Regimes Tributários"],
          },
        ],
      },
      {
        id: "reports",
        name: "Relatórios",
        icon: BarChart,
        articles: [
          {
            id: "sales-reports",
            title: "Relatórios de Vendas",
            description: "Como gerar e interpretar relatórios de performance de vendas.",
            content: `Relatórios de vendas bem estruturados são essenciais para tomada de decisões estratégicas. Este guia mostra como utilizar nossa plataforma para gerar relatórios detalhados sobre seu desempenho comercial.
  
  ## Visão Geral de Vendas
  
  Para acessar uma visão geral do desempenho:
  
  1. Acesse a seção "Relatórios" no menu lateral
  2. Selecione "Desempenho de Vendas"
  3. Defina o período desejado (diário, semanal, mensal, anual)
  4. Personalize os filtros conforme necessário
  
  ## Análises Detalhadas
  
  Explore diferentes dimensões de suas vendas:
  
  - Vendas por produto ou categoria
  - Desempenho por região geográfica
  - Análise por cliente ou segmento
  - Comparação entre períodos
  - Eficiência por canal de venda
  
  ## Métricas Principais
  
  Entenda os indicadores mais importantes:
  
  - Receita total e média por venda
  - Ticket médio e unidades por venda
  - Margens de lucro por produto/categoria
  - Taxa de conversão de leads
  - Ciclo de vendas e sazonalidade
  
  ## Visualizações Gráficas
  
  Utilize diferentes visualizações para melhor compreensão:
  
  - Gráficos de tendência ao longo do tempo
  - Comparativos entre períodos
  - Mapas de calor para análise regional
  - Diagramas de Pareto para identificar concentrações
  - Funis de conversão para análise de processo
  
  ## Exportação e Compartilhamento
  
  Diversas opções para usar os dados em outros contextos:
  
  - Exportação em formatos comuns (PDF, Excel, CSV)
  - Agendamento de relatórios periódicos por email
  - Compartilhamento com equipe via link ou dashboard
  - Integração com ferramentas de BI`,
            updatedAt: "09/03/2024",
            readTime: "4 min",
            relatedArticles: ["KPIs de Vendas", "Análise de Tendências", "Previsão de Vendas"],
          },
          {
            id: "financial-reports",
            title: "Relatórios Financeiros",
            description: "Como analisar a saúde financeira do seu negócio através dos relatórios.",
            content: `Relatórios financeiros precisos são fundamentais para monitorar a saúde do seu negócio. Este guia explica como utilizar nosso sistema para gerar e analisar informações financeiras relevantes.
  
  ## Demonstrativos Financeiros
  
  Acesse os principais demonstrativos:
  
  1. DRE (Demonstrativo de Resultado do Exercício)
  2. Fluxo de Caixa
  3. Balanço Patrimonial
  4. Análise de Contas a Pagar e Receber
  
  ## Indicadores Financeiros
  
  Monitore a saúde financeira através de índices:
  
  - Margem de contribuição
  - Ponto de equilíbrio
  - ROI (Retorno sobre Investimento)
  - Liquidez e endividamento
  - EBITDA e outros indicadores relevantes
  
  ## Análise de Custos
  
  Entenda a estrutura de custos do seu negócio:
  
  - Custos fixos e variáveis
  - Análise por centro de custo
  - Comparativo de despesas entre períodos
  - Identificação de oportunidades de redução
  
  ## Projeções e Orçamentos
  
  Planeje o futuro financeiro:
  
  - Projeção de receitas e despesas
  - Orçamento por departamento
  - Cenários financeiros (pessimista, realista, otimista)
  - Acompanhamento de realizado vs. orçado
  
  ## Relatórios Personalizados
  
  Crie análises específicas para sua necessidade:
  
  - Combinação de diferentes métricas e períodos
  - Visualizações personalizadas
  - Análises comparativas
  - Exportação para ferramentas externas`,
            updatedAt: "14/03/2024",
            readTime: "5 min",
            relatedArticles: ["Gestão de Capital de Giro", "Análise de Lucratividade", "Planejamento Financeiro"],
          },
        ],
      },
      {
        id: "settings",
        name: "Configurações",
        icon: Settings,
        articles: [
          {
            id: "system-settings",
            title: "Configurações do Sistema",
            description: "Como personalizar o sistema de acordo com as necessidades do seu negócio.",
            content: `Configurações adequadas garantem que o sistema funcione alinhado às necessidades do seu negócio. Este guia mostra como personalizar diferentes aspectos da plataforma.
  
  ## Configurações Gerais
  
  Personalize os parâmetros básicos:
  
  1. Informações da empresa (nome, logo, endereço)
  2. Formatação regional (moeda, data, números)
  3. Idioma e fuso horário
  4. Políticas de privacidade e termos de uso
  
  ## Personalização de Interface
  
  Adapte a experiência de usuário:
  
  - Esquema de cores e tema (claro/escuro)
  - Layout da dashboard principal
  - Widgets e elementos visíveis
  - Ordenação de menus e seções
  
  ## Configurações de Usuários
  
  Gerencie o acesso ao sistema:
  
  - Criação e gerenciamento de contas
  - Definição de funções e permissões
  - Políticas de senha e segurança
  - Histórico de atividades e auditoria
  
  ## Integrações e APIs
  
  Configure conexões com outros sistemas:
  
  - Serviços de email e comunicação
  - Sistemas contábeis e ERPs
  - Plataformas de e-commerce
  - Ferramentas de marketing e CRM
  
  ## Backups e Segurança
  
  Proteja seus dados:
  
  - Configuração de backups automáticos
  - Políticas de retenção de dados
  - Criptografia e segurança
  - Plano de recuperação de desastres`,
            updatedAt: "03/03/2024",
            readTime: "4 min",
            relatedArticles: ["Segurança de Dados", "Customização Avançada", "Automações de Sistema"],
          },
          {
            id: "integrations",
            title: "Integrações com Outros Sistemas",
            description: "Como conectar nossa plataforma com outros serviços e ferramentas.",
            content: `Integrações bem configuradas podem aumentar significativamente a eficiência operacional. Este guia explica como conectar nossa plataforma a outros sistemas e serviços.
  
  ## Tipos de Integração
  
  Nossa plataforma suporta diferentes métodos:
  
  - APIs REST para comunicação bidirecional
  - Webhooks para notificações em tempo real
  - Importação/exportação de arquivos
  - Conexões diretas com bancos de dados
  - Single Sign-On (SSO) para autenticação
  
  ## Integrações Pré-configuradas
  
  Conecte-se facilmente a serviços populares:
  
  - Sistemas ERP (SAP, Oracle, Totvs)
  - Plataformas de e-commerce (Shopify, WooCommerce)
  - Serviços de marketing (Mailchimp, HubSpot)
  - Sistemas de CRM (Salesforce, Pipedrive)
  - Ferramentas financeiras (QuickBooks, Xero)
  
  ## Configuração de API
  
  Para configurar uma integração via API:
  
  1. Acesse "Configurações" > "Integrações"
  2. Selecione "Nova Integração" ou o serviço específico
  3. Gere chaves de API e tokens de acesso
  4. Configure endpoints e permissões necessárias
  5. Teste a conexão antes de ativar
  
  ## Sincronização de Dados
  
  Defina como os dados serão compartilhados:
  
  - Intervalos de sincronização (tempo real, agendada)
  - Mapeamento de campos entre sistemas
  - Regras de prioridade para conflitos
  - Histórico e logs de sincronização
  
  ## Monitoramento de Integrações
  
  Garanta o funcionamento contínuo:
  
  - Dashboard de status de conexões
  - Alertas para falhas de comunicação
  - Logs detalhados de transações
  - Ferramentas de depuração e diagnóstico`,
            updatedAt: "13/03/2024",
            readTime: "5 min",
            relatedArticles: ["API Developer Guide", "Webhooks Avançados", "Automação Entre Sistemas"],
          },
        ],
      },
      {
        id: "updates",
        name: "Atualizações",
        icon: RefreshCcw,
        articles: [
          {
            id: "latest-features",
            title: "Novos Recursos e Funcionalidades",
            description: "Conheça as atualizações mais recentes do sistema.",
            content: `Nosso sistema evolui constantemente para atender às necessidades dos nossos usuários. Este artigo apresenta as melhorias e novos recursos adicionados recentemente.
  
  ## Versão 3.5.0 (Março 2024)
  
  Nesta atualização, focamos em melhorias de desempenho e novos recursos:
  
  - **Dashboard Personalizada**: Agora você pode personalizar completamente sua dashboard, escolhendo quais widgets exibir e reorganizando-os conforme sua preferência.
  
  - **Sistema de Notificações Avançado**: Implementamos notificações em tempo real para eventos importantes, permitindo configurações granulares por tipo de evento.
  
  - **Relatórios Interativos**: Os relatórios agora permitem interações dinâmicas, filtragens e visualizações personalizadas diretamente na interface.
  
  - **App Mobile**: Lançamos nosso aplicativo para iOS e Android, permitindo acesso às principais funcionalidades em qualquer lugar.
  
  - **Integração com Marketplaces**: Adicionamos suporte nativo para os principais marketplaces do mercado.
  
  ## Versão 3.4.0 (Janeiro 2024)
  
  Esta atualização trouxe melhorias significativas:
  
  - **Modo Escuro**: Atendendo a pedidos frequentes, implementamos o modo escuro em toda a plataforma.
  
  - **Automações Avançadas**: O novo sistema de automação permite criar fluxos de trabalho personalizados sem necessidade de código.
  
  - **Melhorias de Segurança**: Implementamos autenticação de dois fatores (2FA) para todas as contas.
  
  - **Expansão de APIs**: Ampliamos nossa API pública com novos endpoints e melhor documentação.
  
  ## Próximas Atualizações
  
  Estamos trabalhando nas seguintes melhorias para os próximos meses:
  
  - Sistema avançado de gestão de estoque multi-localização
  - Inteligência artificial para previsão de vendas
  - Novas opções de personalização de relatórios
  - Melhorias na interface de usuário
  - Suporte para mais idiomas e regiões`,
            updatedAt: "15/03/2024",
            readTime: "3 min",
            relatedArticles: ["Histórico de Versões", "Roadmap de Produto", "Política de Atualizações"],
          },
          {
            id: "update-guides",
            title: "Guias de Atualização",
            description: "Como atualizar para novas versões e adaptar-se às mudanças.",
            content: `Manter seu sistema atualizado garante acesso às últimas funcionalidades e correções de segurança. Este guia explica o processo de atualização e como se adaptar às mudanças.
  
  ## Preparação para Atualização
  
  Antes de atualizar, siga estas etapas preparatórias:
  
  1. Faça backup completo dos seus dados
  2. Revise as notas da versão para entender as mudanças
  3. Verifique requisitos de sistema atualizados
  4. Planeje a atualização para um horário de baixo uso
  5. Informe sua equipe sobre o período de manutenção
  
  ## Processo de Atualização
  
  Nossa plataforma em nuvem é atualizada automaticamente, mas você deve:
  
  - Aguardar a notificação de atualização disponível
  - Agendar a atualização para o horário mais conveniente
  - Monitorar o processo de migração de dados
  - Verificar a conclusão bem-sucedida da atualização
  
  ## Verificações Pós-atualização
  
  Após a atualização, certifique-se de:
  
  - Verificar se todas as funcionalidades críticas estão operacionais
  - Validar integrações com sistemas externos
  - Confirmar acesso de todos os usuários
  - Testar processos de negócio essenciais
  
  ## Adaptação às Mudanças
  
  Para se adaptar às novas funcionalidades:
  
  - Revise os tutoriais e documentação atualizados
  - Participe de webinars de treinamento quando disponíveis
  - Explore as novas funcionalidades em ambiente de teste
  - Treine sua equipe nas mudanças relevantes
  
  ## Solução de Problemas
  
  Se encontrar problemas após a atualização:
  
  - Consulte nossa base de conhecimento para problemas conhecidos
  - Verifique logs de erro para diagnóstico
  - Contate o suporte através dos canais oficiais
  - Tenha informações de diagnóstico prontas ao relatar problemas`,
            updatedAt: "10/03/2024",
            readTime: "4 min",
            relatedArticles: ["Política de Versões", "Backup e Restauração", "Resolução de Problemas Comuns"],
          },
        ],
      },
    ],
    faqs: [
      {
        id: "faq-1",
        category: "Conta e Acesso",
        question: "Como recuperar minha senha?",
        answer:
          "Para recuperar sua senha, clique no link 'Esqueceu a senha?' na tela de login. Você receberá um email com instruções para criar uma nova senha. Certifique-se de verificar sua pasta de spam caso o email não apareça na caixa de entrada.",
      },
      {
        id: "faq-2",
        category: "Conta e Acesso",
        question: "Como adicionar um novo usuário à minha conta?",
        answer:
          "Para adicionar um novo usuário, acesse a seção 'Configurações' > 'Usuários e Permissões' e clique em 'Adicionar Usuário'. Preencha as informações necessárias e defina o nível de permissão apropriado. O novo usuário receberá um email de convite com instruções para completar o cadastro.",
      },
      {
        id: "faq-3",
        category: "Conta e Acesso",
        question: "Posso acessar o sistema em dispositivos móveis?",
        answer:
          "Sim, nosso sistema é completamente responsivo e funciona em smartphones e tablets. Além disso, oferecemos aplicativos nativos para iOS e Android que podem ser baixados nas respectivas lojas de aplicativos. Os aplicativos móveis permitem acesso às principais funcionalidades mesmo quando você está em movimento.",
      },
      {
        id: "faq-4",
        category: "Produtos",
        question: "Como importar produtos em massa?",
        answer:
          "Para importar múltiplos produtos de uma vez, acesse 'Produtos' > 'Importação em Massa'. Baixe nosso modelo de planilha, preencha com seus dados e faça o upload. O sistema validará os dados antes de importar e mostrará um relatório com possíveis erros ou inconsistências para correção.",
      },
      {
        id: "faq-5",
        category: "Produtos",
        question: "Como configurar variações de um produto?",
        answer:
          "Para criar variações (como tamanhos ou cores), edite o produto desejado e navegue até a seção 'Variações'. Clique em 'Adicionar Variação', defina os atributos (ex: cor, tamanho) e valores possíveis para cada atributo. Você pode configurar preços e quantidades específicas para cada combinação de variações.",
      },
      {
        id: "faq-6",
        category: "Pagamentos",
        question: "Quais formas de pagamento são suportadas?",
        answer:
          "Nosso sistema suporta diversas formas de pagamento, incluindo cartões de crédito/débito, boletos bancários, transferências PIX, carteiras digitais (Apple Pay, Google Pay) e pagamentos recorrentes para assinaturas. A disponibilidade exata depende da sua região e dos gateways de pagamento configurados na sua conta.",
      },
      {
        id: "faq-7",
        category: "Pagamentos",
        question: "Como emitir reembolsos para clientes?",
        answer:
          "Para processar um reembolso, acesse 'Pagamentos' > 'Transações', localize a transação desejada e clique em 'Reembolsar'. Você pode escolher entre reembolso total ou parcial, e dependendo do método de pagamento original, o sistema processará automaticamente o estorno ou fornecerá instruções para completar o processo.",
      },
      {
        id: "faq-8",
        category: "Relatórios",
        question: "Posso exportar relatórios para Excel?",
        answer:
          "Sim, todos os relatórios podem ser exportados em diversos formatos, incluindo Excel (.xlsx), CSV, PDF e JSON. Ao visualizar qualquer relatório, procure o botão 'Exportar' no canto superior direito da tela e selecione o formato desejado. Relatórios complexos ou muito grandes podem ser agendados para geração em segundo plano.",
      },
      {
        id: "faq-9",
        category: "Relatórios",
        question: "Como criar relatórios personalizados?",
        answer:
          "Para criar um relatório personalizado, acesse 'Relatórios' > 'Relatórios Personalizados' e clique em 'Novo Relatório'. Selecione as fontes de dados desejadas, arraste os campos que deseja incluir, aplique filtros e agrupamentos, e escolha a visualização preferida (tabelas, gráficos, etc). Os relatórios podem ser salvos para uso futuro e compartilhados com outros usuários.",
      },
      {
        id: "faq-10",
        category: "Integrações",
        question: "O sistema integra com plataformas de e-commerce?",
        answer:
          "Sim, oferecemos integrações nativas com as principais plataformas de e-commerce como Shopify, WooCommerce, Magento, VTEX e Mercado Livre. Estas integrações sincronizam produtos, estoque, pedidos e clientes automaticamente. Para configurar, acesse 'Configurações' > 'Integrações' e selecione a plataforma desejada.",
      },
      {
        id: "faq-11",
        category: "Integrações",
        question: "Como conectar com meu sistema contábil?",
        answer:
          "Temos integrações com os principais sistemas contábeis do mercado. Acesse 'Configurações' > 'Integrações' > 'Sistemas Contábeis', selecione seu provedor e siga o assistente de configuração. A integração permite o envio automático de notas fiscais, lançamentos contábeis e conciliação financeira, reduzindo a necessidade de entrada manual de dados.",
      },
      {
        id: "faq-12",
        category: "Suporte Técnico",
        question: "Como entrar em contato com o suporte?",
        answer:
          "Oferecemos múltiplos canais de suporte: chat ao vivo disponível em dias úteis (9h às 18h), sistema de tickets (24/7), email de suporte (suporte@sistema.com.br) e base de conhecimento com tutoriais e guias. Para problemas críticos, clientes com planos Premium têm acesso a uma linha telefônica dedicada.",
      },
    ],
  }
  
  