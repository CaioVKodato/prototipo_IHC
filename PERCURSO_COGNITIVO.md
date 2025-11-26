# Percurso Cognitivo - Alerta Fumaça

## 1. Instruções de Acesso ao Protótipo

1. Baixe todos os arquivos do projeto (index.html, styles.css, app.js)
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge ou Safari)
3. O protótipo funcionará completamente offline, sem necessidade de servidor


### Observações Importantes

- **Permissão de Notificações**: Ao fazer login pela primeira vez, o navegador solicitará permissão para notificações. Aceite para testar todas as funcionalidades.
- **Dados Persistidos**: Os dados são salvos no localStorage do navegador e permanecem entre sessões.
- **Navegadores Suportados**: Chrome, Firefox, Edge, Safari (versões recentes)


## 2. Objetivo do Sistema

O **Alerta Fumaça** é um aplicativo web desenvolvido para proteger a saúde respiratória de usuários vulneráveis através de alertas proativos sobre riscos de fumaça de queimadas. O sistema:

- Calcula e exibe o **Índice de Risco Respiratório (IRR)** baseado na localização do usuário
- Emite **alertas proativos** com pelo menos 30 minutos de antecedência
- Permite o **registro de sintomas** para validação e melhoria do índice
- Facilita o **reporte e verificação de incêndios** na região
- Oferece **comunicação acessível** com alto contraste e alertas sonoros

O sistema foi projetado especialmente para idosos, pessoas com doenças respiratórias crônicas, cuidadores e moradores de áreas rurais, priorizando acessibilidade e simplicidade de uso.


## 3. Perfil do Usuário

## 4. Tarefas para Percurso Cognitivo

### Tarefa 1: Verificar o Risco Respiratório (IRR) na Minha Localização

**Objetivo:** O usuário deseja saber qual é o índice de risco respiratório na sua localização atual para decidir se deve sair de casa ou tomar medidas de proteção.

**Sequência de Ações Corretas:**

1. **Fazer Login no Sistema**
   - Abrir o arquivo `index.html` no navegador
   - Na tela de login, inserir email e senha
   - Clicar no botão "Login"
   - *Resultado esperado: Tela do mapa é exibida*

2. **Verificar/Adicionar Localização**
   - Na tela do mapa, verificar se o campo "Adicionar Localização" está preenchido
   - Se não estiver, digitar a localização desejada (ex: "Rua das Flores, 123")
   - *Resultado esperado: Localização é salva automaticamente ao digitar*

3. **Verificar o IRR**
   - Clicar no botão "Verificar IRR"
   - *Resultado esperado: Tela de detalhes do IRR é exibida*

4. **Visualizar Informações do IRR**
   - Na tela de detalhes, verificar:
     - O nível de IRR exibido em destaque (ex: "Muito Alto", "Alto", "Médio", "Baixo")
     - Os principais focos de incêndio na região
     - As ações sugeridas
     - As doenças e sintomas comuns na região
   - *Resultado esperado: Todas as informações são exibidas de forma clara e organizada*

5. **Voltar ao Mapa (Opcional)**
   - Clicar no botão "Voltar ao Mapa"
   - *Resultado esperado: Retorna à tela do mapa*

**Critérios de Sucesso:**
-  Usuário consegue acessar o sistema
-  Localização é salva corretamente
-  IRR é calculado e exibido
-  Informações são apresentadas de forma clara e acessível
-  Navegação entre telas funciona sem erros


### Tarefa 2: Registrar Sintomas no Diário

**Objetivo:** O usuário sentiu sintomas respiratórios e deseja registrá-los no diário para contribuir com os dados do sistema e acompanhar sua saúde.

**Sequência de Ações Corretas:**

1. **Acessar o Diário de Sintomas**
   - Na tela do mapa (ou qualquer tela), clicar no botão do menu (☰) no canto superior direito
   - No menu lateral, clicar em "Diário de Sintomas"
   - *Resultado esperado: Tela do diário de sintomas é exibida*

2. **Selecionar Sintomas**
   - Na lista de sintomas, marcar os checkboxes correspondentes aos sintomas sentidos:
     - Falta de ar
     - Tosse
     - Ardência nos olhos
     - Cansaço excessivo
     - Dor de cabeça
     - Crise de asma
     - Crise de rinite
   - *Resultado esperado: Checkboxes são marcados visualmente*

3. **Adicionar Observação (Opcional)**
   - No campo "Observação:", digitar informações adicionais sobre os sintomas
   - Exemplo: "Sintomas começaram após sair de casa pela manhã"
   - *Resultado esperado: Texto é digitado no campo*

4. **Registrar os Sintomas**
   - Clicar no botão "Registrar sintomas +"
   - *Resultado esperado: Mensagem de confirmação é exibida e formulário é limpo*

**Critérios de Sucesso:**
-  Menu lateral abre corretamente
-  Navegação para diário de sintomas funciona
-  Checkboxes podem ser marcados
-  Campo de observação aceita texto
-  Registro é salvo com sucesso
-  Feedback visual é fornecido ao usuário

---

### Tarefa 3: Reportar um Incêndio e Verificar Incêndios na Região

**Objetivo:** O usuário observou um incêndio e deseja reportá-lo, além de verificar se há outros incêndios reportados na sua região.

**Sequência de Ações Corretas - Parte A: Reportar Incêndio**

1. **Abrir Modal de Alerta de Incêndio**
   - Na tela do mapa, clicar no botão "Alertar Incêndio +"
   - *Resultado esperado: Modal de cadastro de incêndio é exibido*

2. **Preencher Informações do Incêndio**
   - No campo "Localização do Incêndio", digitar o endereço ou localização (ex: "Rua Principal, 500")
   - No campo "Descrição (opcional)", adicionar detalhes sobre o que foi observado
   - No campo "Gravidade", selecionar o nível de gravidade (Baixa, Média, Alta, Crítica)
   - *Resultado esperado: Campos são preenchidos corretamente*

3. **Enviar o Alerta**
   - Clicar no botão "Enviar Alerta"
   - *Resultado esperado: Modal fecha, mensagem de confirmação é exibida, alerta é salvo*

**Sequência de Ações Corretas - Parte B: Verificar Incêndios**

4. **Verificar Incêndios na Região**
   - Na tela do mapa, verificar se a localização está preenchida no campo "Adicionar Localização"
   - Clicar no botão "Verificar Incêndios"
   - *Resultado esperado: Modal de verificação é exibido*

5. **Visualizar Resultados**
   - No modal, verificar:
     - A localização verificada
     - Lista de incêndios reportados próximos (se houver)
     - Para cada incêndio: localização, descrição, gravidade, quem reportou e data
   - Se não houver incêndios, mensagem de segurança é exibida
   - *Resultado esperado: Informações são apresentadas de forma clara*

6. **Fechar o Modal**
   - Clicar no botão "Fechar" ou clicar fora do modal
   - *Resultado esperado: Modal fecha e retorna à tela do mapa*

**Critérios de Sucesso:**
-  Modal de alerta de incêndio abre corretamente
-  Formulário aceita todos os campos
-  Validação funciona (localização obrigatória)
-  Alerta é salvo com sucesso
-  Verificação de incêndios retorna resultados corretos
-  Informações são exibidas de forma organizada
-  Navegação entre modais funciona sem problemas

---

## Observações para Avaliadores

- **Dados Persistidos**: Os dados são salvos no localStorage. Para testar do zero, limpe os dados do navegador ou use modo anônimo.
- **Notificações**: Se o navegador solicitar permissão de notificações, aceite para testar todas as funcionalidades.
- **Simulação de Dados**: O cálculo do IRR e a verificação de incêndios usam dados simulados para fins de prototipação.
- **Responsividade**: O protótipo é responsivo e funciona em diferentes tamanhos de tela.

---

**Data de Criação:** 26/11/2024  
**Grupo:** Arthur Mendes, Caio Kodato, Vitor Hugo  
**Disciplina:** IHC - Interação Humano-Computador

