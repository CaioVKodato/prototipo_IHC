// Estado da aplicação
const AppState = {
    currentUser: null,
    currentScreen: 'login-screen',
    userPreferences: {
        notifications: true,
        systemNotifications: true,
        soundAlerts: true,
        smokeAlerts: true,
        fireAlerts: true,
        economyMode: false
    },
    userLocation: '',
    currentIRR: null,
    symptomsHistory: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    setupEventListeners();
    checkForActiveAlerts();
    
    // Se usuário já está logado, mostrar tela principal
    if (AppState.currentUser) {
        showScreen('map-screen');
    }
});

// Carregar dados do localStorage
function loadStoredData() {
    const storedUser = localStorage.getItem('currentUser');
    const storedPreferences = localStorage.getItem('userPreferences');
    const storedLocation = localStorage.getItem('userLocation');
    const storedSymptoms = localStorage.getItem('symptomsHistory');
    
    if (storedUser) {
        AppState.currentUser = JSON.parse(storedUser);
    }
    
    if (storedPreferences) {
        AppState.userPreferences = { ...AppState.userPreferences, ...JSON.parse(storedPreferences) };
    }
    
    if (storedLocation) {
        AppState.userLocation = storedLocation;
    }
    
    if (storedSymptoms) {
        AppState.symptomsHistory = JSON.parse(storedSymptoms);
    }
}

// Salvar dados no localStorage
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Configurar event listeners
function setupEventListeners() {
    // Login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('go-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup-screen');
    });
    
    // Cadastro
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('go-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login-screen');
    });
    document.getElementById('open-preferences').addEventListener('click', openPreferencesModal);
    
    // Preferências
    document.getElementById('confirm-preferences').addEventListener('click', confirmPreferences);
    
    // Menu
    document.getElementById('menu-btn').addEventListener('click', openMenu);
    document.getElementById('menu-btn-irr').addEventListener('click', openMenu);
    document.getElementById('menu-btn-symptoms').addEventListener('click', openMenu);
    document.getElementById('close-menu').addEventListener('click', closeMenu);
    document.getElementById('menu-overlay').addEventListener('click', closeMenu);
    document.getElementById('open-preferences-menu').addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
        openPreferencesModal();
    });
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navegação do menu
    document.querySelectorAll('.menu-item[data-screen]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const screen = e.target.getAttribute('data-screen');
            showScreen(screen);
            closeMenu();
        });
    });
    
    // Mapa
    document.getElementById('check-irr-btn').addEventListener('click', checkIRR);
    document.getElementById('check-fires-btn').addEventListener('click', checkFires);
    document.getElementById('alert-fire-btn').addEventListener('click', alertFire);
    document.getElementById('add-location-input').addEventListener('input', (e) => {
        AppState.userLocation = e.target.value;
        saveToStorage('userLocation', AppState.userLocation);
    });
    document.getElementById('add-location-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (AppState.userLocation) {
                checkIRR();
            }
        }
    });
    
    // IRR Details
    document.getElementById('share-graph-btn').addEventListener('click', shareGraph);
    document.getElementById('back-to-map-btn').addEventListener('click', () => {
        showScreen('map-screen');
    });
    
    // Diário de Sintomas
    document.getElementById('symptoms-form').addEventListener('submit', handleSymptomsSubmit);
    
    // Alerta Emergencial
    document.getElementById('dismiss-alert').addEventListener('click', dismissEmergencyAlert);
    
    // Banner de Alerta
    document.getElementById('close-alert-banner').addEventListener('click', hideAlertBanner);
    
    // Modal de Verificação de Incêndios
    document.getElementById('close-fires-modal').addEventListener('click', () => {
        document.getElementById('fires-check-modal').classList.remove('active');
    });
    document.getElementById('fires-check-modal').addEventListener('click', (e) => {
        if (e.target.id === 'fires-check-modal') {
            document.getElementById('fires-check-modal').classList.remove('active');
        }
    });
    
    // Modal de Cadastro de Incêndio
    document.getElementById('alert-fire-form').addEventListener('submit', handleFireAlertSubmit);
    document.getElementById('cancel-fire-alert').addEventListener('click', () => {
        document.getElementById('alert-fire-modal').classList.remove('active');
        document.getElementById('alert-fire-form').reset();
    });
    document.getElementById('alert-fire-modal').addEventListener('click', (e) => {
        if (e.target.id === 'alert-fire-modal') {
            document.getElementById('alert-fire-modal').classList.remove('active');
            document.getElementById('alert-fire-form').reset();
        }
    });
}

// Navegação entre telas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenId;
        
        // Atualizar dados específicos da tela
        if (screenId === 'map-screen') {
            updateMapScreen();
        } else if (screenId === 'irr-details-screen') {
            updateIRRDetailsScreen();
        } else if (screenId === 'symptoms-screen') {
            updateSymptomsScreen();
        }
    }
}

// Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Verificar se usuário existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        AppState.currentUser = user;
        saveToStorage('currentUser', user);
        showScreen('map-screen');
        requestNotificationPermission();
        checkForActiveAlerts();
    } else {
        alert('Email ou senha incorretos!');
    }
}

// Cadastro
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const location = document.getElementById('signup-location').value;
    const riskProfile = document.getElementById('signup-risk-profile').value;
    
    // Verificar se email já existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('Este email já está cadastrado!');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        location,
        riskProfile,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    AppState.currentUser = newUser;
    AppState.userLocation = location;
    saveToStorage('currentUser', newUser);
    saveToStorage('userLocation', location);
    
    // Salvar preferências
    saveToStorage('userPreferences', AppState.userPreferences);
    
    alert('Cadastro realizado com sucesso!');
    showScreen('map-screen');
    requestNotificationPermission();
    checkForActiveAlerts();
}

// Modal de Preferências
function openPreferencesModal() {
    const modal = document.getElementById('preferences-modal');
    document.getElementById('pref-notifications').checked = AppState.userPreferences.notifications;
    document.getElementById('pref-system-notifications').checked = AppState.userPreferences.systemNotifications;
    document.getElementById('pref-sound-alerts').checked = AppState.userPreferences.soundAlerts;
    document.getElementById('pref-smoke-alerts').checked = AppState.userPreferences.smokeAlerts;
    document.getElementById('pref-fire-alerts').checked = AppState.userPreferences.fireAlerts;
    document.getElementById('pref-economy-mode').checked = AppState.userPreferences.economyMode;
    modal.classList.add('active');
}

function confirmPreferences() {
    const systemNotificationsEnabled = document.getElementById('pref-system-notifications').checked;
    const wasSystemNotificationsEnabled = AppState.userPreferences.systemNotifications;
    
    AppState.userPreferences = {
        notifications: document.getElementById('pref-notifications').checked,
        systemNotifications: systemNotificationsEnabled,
        soundAlerts: document.getElementById('pref-sound-alerts').checked,
        smokeAlerts: document.getElementById('pref-smoke-alerts').checked,
        fireAlerts: document.getElementById('pref-fire-alerts').checked,
        economyMode: document.getElementById('pref-economy-mode').checked
    };
    
    saveToStorage('userPreferences', AppState.userPreferences);
    document.getElementById('preferences-modal').classList.remove('active');
    
    // Se ativou notificações do sistema e ainda não tem permissão, solicitar
    if (systemNotificationsEnabled && !wasSystemNotificationsEnabled) {
        requestNotificationPermission();
    }
    
    alert('Preferências salvas!');
}

// Menu Lateral
function openMenu() {
    document.getElementById('side-menu').classList.add('active');
    document.getElementById('menu-overlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('side-menu').classList.remove('active');
    document.getElementById('menu-overlay').classList.remove('active');
}

// Logout
function handleLogout(e) {
    e.preventDefault();
    if (confirm('Deseja realmente sair?')) {
        AppState.currentUser = null;
        localStorage.removeItem('currentUser');
        closeMenu();
        showScreen('login-screen');
    }
}

// Atualizar tela do mapa
function updateMapScreen() {
    const locationInput = document.getElementById('add-location-input');
    if (AppState.userLocation) {
        locationInput.value = AppState.userLocation;
    }
}

// Verificar IRR
function checkIRR() {
    if (!AppState.userLocation) {
        alert('Por favor, adicione uma localização primeiro!');
        return;
    }
    
    // Simular cálculo do IRR (em produção, isso viria de uma API)
    const irrData = calculateIRR(AppState.userLocation);
    AppState.currentIRR = irrData;
    
    showScreen('irr-details-screen');
    updateIRRDetailsScreen();
    
    // Verificar se precisa mostrar alerta
    if (irrData.level === 'Muito Alto' || irrData.level === 'Alto') {
        showEmergencyAlert(irrData);
    }
}

// Calcular IRR (simulação)
function calculateIRR(location) {
    // Simulação baseada em dados aleatórios
    // Em produção, isso usaria dados reais de queimadas, vento, qualidade do ar, etc.
    const levels = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];
    const randomLevel = levels[Math.floor(Math.random() * 3) + 1]; // Tendência para níveis mais altos
    
    const fireFoci = [
        'Rua Alfredo Neves 15',
        'Rua São Paulo 1200',
        'Avenida Principal 500',
        'Estrada Rural Km 12'
    ];
    
    const actions = [
        'Utilizar máscara',
        'Se Afastar da Região',
        'Fechar janelas',
        'Evitar atividades ao ar livre'
    ];
    
    const diseases = ['Rinite', 'Asma', 'Bronquite', 'Alergias respiratórias'];
    
    return {
        level: randomLevel,
        location: location,
        fireFoci: fireFoci.slice(0, Math.floor(Math.random() * 2) + 2),
        suggestedActions: actions.slice(0, Math.floor(Math.random() * 2) + 2),
        diseases: diseases.slice(0, Math.floor(Math.random() * 2) + 2),
        timestamp: new Date().toISOString()
    };
}

// Atualizar tela de detalhes do IRR
function updateIRRDetailsScreen() {
    if (!AppState.currentIRR) {
        // Se não há IRR calculado, calcular um
        if (AppState.userLocation) {
            AppState.currentIRR = calculateIRR(AppState.userLocation);
        } else {
            AppState.currentIRR = calculateIRR('Localização padrão');
        }
    }
    
    const irr = AppState.currentIRR;
    
    document.getElementById('irr-location-input').value = irr.location;
    document.getElementById('irr-level-display').textContent = irr.level;
    
    // Atualizar lista de focos
    const fireFociList = document.getElementById('fire-foci-list');
    fireFociList.innerHTML = '';
    irr.fireFoci.forEach(foco => {
        const li = document.createElement('li');
        li.textContent = foco;
        fireFociList.appendChild(li);
    });
    
    // Atualizar ações sugeridas
    const actionsList = document.getElementById('suggested-actions-list');
    actionsList.innerHTML = '';
    irr.suggestedActions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = action;
        actionsList.appendChild(li);
    });
    
    // Atualizar doenças
    const diseasesList = document.getElementById('diseases-list');
    diseasesList.innerHTML = '';
    irr.diseases.forEach(disease => {
        const li = document.createElement('li');
        li.textContent = disease;
        diseasesList.appendChild(li);
    });
}

// Compartilhar gráfico
function shareGraph() {
    if (!AppState.currentIRR) {
        alert('Nenhum dado de IRR disponível para compartilhar!');
        return;
    }
    
    // Simular compartilhamento
    const shareData = {
        text: `IRR: ${AppState.currentIRR.level} - ${AppState.currentIRR.location}`,
        title: 'Alerta Fumaça - Gráfico de Dispersão',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(err => {
            console.log('Erro ao compartilhar:', err);
            copyToClipboard(JSON.stringify(AppState.currentIRR, null, 2));
        });
    } else {
        copyToClipboard(JSON.stringify(AppState.currentIRR, null, 2));
        alert('Dados do IRR copiados para a área de transferência!');
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Abrir modal de alerta de incêndio
function alertFire() {
    if (!AppState.currentUser) {
        alert('Por favor, faça login primeiro!');
        return;
    }
    
    // Preencher localização padrão se disponível
    const locationInput = document.getElementById('fire-location-input');
    if (AppState.userLocation && !locationInput.value) {
        locationInput.value = AppState.userLocation;
    }
    
    // Abrir modal
    document.getElementById('alert-fire-modal').classList.add('active');
    locationInput.focus();
}

// Submeter alerta de incêndio
function handleFireAlertSubmit(e) {
    e.preventDefault();
    
    const location = document.getElementById('fire-location-input').value.trim();
    const description = document.getElementById('fire-description-input').value.trim();
    const severity = document.getElementById('fire-severity-select').value;
    
    if (!location) {
        alert('Por favor, informe a localização do incêndio!');
        return;
    }
    
    // Criar alerta de incêndio
    const fireAlert = {
        id: Date.now(),
        location: location,
        description: description || null,
        severity: severity,
        reportedBy: AppState.currentUser?.name || 'Usuário',
        userId: AppState.currentUser?.id || null,
        timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage
    const fireAlerts = JSON.parse(localStorage.getItem('fireAlerts') || '[]');
    fireAlerts.push(fireAlert);
    localStorage.setItem('fireAlerts', JSON.stringify(fireAlerts));
    
    // Fechar modal e limpar formulário
    document.getElementById('alert-fire-modal').classList.remove('active');
    document.getElementById('alert-fire-form').reset();
    
    // Mostrar confirmação
    alert('Alerta de incêndio registrado com sucesso! Obrigado por contribuir.');
    
    // Se houver notificações ativas, mostrar notificação do sistema
    if (AppState.userPreferences.systemNotifications && Notification.permission === 'granted') {
        showSystemNotification('Alerta de Incêndio Registrado', `Localização: ${location}`, () => {
            // Focar na janela ao clicar na notificação
            window.focus();
        });
    }
}

// Verificar incêndios na localização
function checkFires() {
    // Obter localização atual ou do input
    const locationInput = document.getElementById('add-location-input');
    const locationToCheck = locationInput.value.trim() || AppState.userLocation;
    
    if (!locationToCheck) {
        alert('Por favor, informe uma localização para verificar!');
        locationInput.focus();
        return;
    }
    
    // Atualizar localização se foi alterada
    if (locationToCheck !== AppState.userLocation) {
        AppState.userLocation = locationToCheck;
        saveToStorage('userLocation', AppState.userLocation);
    }
    
    // Buscar incêndios reportados
    const fireAlerts = JSON.parse(localStorage.getItem('fireAlerts') || '[]');
    
    // Filtrar incêndios próximos à localização (simulação - em produção usaria coordenadas)
    const nearbyFires = fireAlerts.filter(fire => {
        // Simulação: considera "próximo" se a localização contém palavras similares
        const locationLower = locationToCheck.toLowerCase();
        const fireLocationLower = fire.location.toLowerCase();
        
        // Verifica se há palavras em comum ou se a localização está contida
        return fireLocationLower.includes(locationLower) || 
               locationLower.includes(fireLocationLower) ||
               fireLocationLower.split(' ').some(word => 
                   word.length > 3 && locationLower.includes(word)
               );
    });
    
    // Mostrar resultados no modal
    showFiresCheckResults(locationToCheck, nearbyFires);
}

// Mostrar resultados da verificação de incêndios
function showFiresCheckResults(location, fires) {
    const modal = document.getElementById('fires-check-modal');
    const locationElement = document.getElementById('fires-check-location');
    const resultsContainer = document.getElementById('fires-list-container');
    
    locationElement.textContent = `Localização: ${location}`;
    
    if (fires.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-fires-message">
                <div class="no-fires-icon">✅</div>
                <p>Nenhum incêndio reportado próximo a esta localização.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">A área está segura no momento.</p>
            </div>
        `;
    } else {
        const firesList = document.createElement('ul');
        firesList.className = 'fires-list';
        
        fires.forEach(fire => {
            const li = document.createElement('li');
            const fireDate = new Date(fire.timestamp);
            const formattedDate = fireDate.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const severityLabels = {
                'baixa': 'Baixa',
                'media': 'Média',
                'alta': 'Alta',
                'critica': 'Crítica'
            };
            
            const severityColors = {
                'baixa': '#4CAF50',
                'media': '#FF9800',
                'alta': '#F44336',
                'critica': '#9C27B0'
            };
            
            const severity = fire.severity || 'media';
            const severityLabel = severityLabels[severity] || 'Média';
            const severityColor = severityColors[severity] || '#FF9800';
            
            li.innerHTML = `
                <div class="fire-item">
                    <div class="fire-location">🔥 ${fire.location}</div>
                    <div class="fire-details">
                        ${fire.description ? `<p class="fire-description">${fire.description}</p>` : ''}
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                            <span class="fire-severity" style="background-color: ${severityColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">
                                Gravidade: ${severityLabel}
                            </span>
                            <span class="fire-reported-by">Reportado por: ${fire.reportedBy}</span>
                        </div>
                        <span class="fire-time">Data: ${formattedDate}</span>
                    </div>
                </div>
            `;
            firesList.appendChild(li);
        });
        
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(firesList);
    }
    
    modal.classList.add('active');
}

// Solicitar permissão de notificações
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Este navegador não suporta notificações');
        return;
    }
    
    if (Notification.permission === 'default' && AppState.userPreferences.systemNotifications) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permissão de notificações concedida');
            } else {
                console.log('Permissão de notificações negada');
            }
        });
    }
}

// Mostrar notificação do sistema
function showSystemNotification(title, body, onClickCallback) {
    if (!('Notification' in window)) {
        return;
    }
    
    if (Notification.permission !== 'granted' || !AppState.userPreferences.systemNotifications) {
        return;
    }
    
    const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☁️📖</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☁️📖</text></svg>',
        tag: 'alerta-fumaca', // Tag para agrupar notificações
        requireInteraction: false,
        silent: false
    });
    
    // Quando o usuário clicar na notificação, executar callback e fechar
    notification.onclick = function() {
        if (onClickCallback) {
            onClickCallback();
        }
        notification.close();
        // Focar na janela do aplicativo
        window.focus();
    };
    
    // Fechar notificação automaticamente após 5 segundos
    setTimeout(() => {
        notification.close();
    }, 5000);
    
    return notification;
}

// Mostrar alerta emergencial
function showEmergencyAlert(irrData) {
    if (!AppState.userPreferences.notifications) {
        return;
    }
    
    const modal = document.getElementById('emergency-alert-modal');
    const message = document.getElementById('emergency-message');
    
    message.textContent = `Risco ${irrData.level.toLowerCase()}! Fumaça em 30 minutos`;
    modal.classList.add('active');
    
    // Alerta sonoro (se habilitado)
    if (AppState.userPreferences.soundAlerts) {
        playAlertSound();
    }
    
    // Mostrar banner de alerta (sem notificação duplicada)
    showAlertBanner(irrData.level, false);
    
    // Mostrar notificação do sistema
    showSystemNotification('Alerta Emergencial!', `Risco ${irrData.level.toLowerCase()}! Fumaça em 30 minutos`, () => {
        dismissEmergencyAlert();
        hideAlertBanner();
    });
}

function dismissEmergencyAlert() {
    document.getElementById('emergency-alert-modal').classList.remove('active');
}

// Mostrar banner de alerta
function showAlertBanner(irrLevel, showNotification = true) {
    const banner = document.getElementById('alert-banner');
    document.getElementById('alert-irr-level').textContent = irrLevel;
    banner.classList.remove('hidden');
    
    // Mostrar notificação do sistema para o banner (se não for chamado de showEmergencyAlert)
    if (showNotification) {
        showSystemNotification('Fumaça Próxima!', `Nível de IRR: ${irrLevel}`, () => {
            hideAlertBanner();
        });
    }
    
    // Fechar automaticamente após 10 segundos
    setTimeout(() => {
        hideAlertBanner();
    }, 10000);
}

// Esconder banner de alerta
function hideAlertBanner() {
    const banner = document.getElementById('alert-banner');
    banner.classList.add('hidden');
}

// Verificar alertas ativos
function checkForActiveAlerts() {
    if (!AppState.currentUser || !AppState.userLocation) {
        return;
    }
    
    // Simular verificação de alertas
    // Em produção, isso consultaria uma API
    const shouldShowAlert = Math.random() > 0.7; // 30% de chance
    
    if (shouldShowAlert && AppState.userPreferences.smokeAlerts) {
        const irrData = calculateIRR(AppState.userLocation);
        if (irrData.level === 'Muito Alto' || irrData.level === 'Alto') {
            showAlertBanner(irrData.level);
        }
    }
}

// Tocar som de alerta
function playAlertSound() {
    // Criar um som de alerta simples usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Não foi possível reproduzir o som de alerta:', e);
    }
}

// Atualizar tela de sintomas
function updateSymptomsScreen() {
    // Limpar formulário
    document.getElementById('symptoms-form').reset();
}

// Submeter sintomas
function handleSymptomsSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const selectedSymptoms = formData.getAll('symptom');
    const observation = document.getElementById('symptoms-observation').value;
    
    if (selectedSymptoms.length === 0 && !observation) {
        alert('Por favor, selecione pelo menos um sintoma ou adicione uma observação.');
        return;
    }
    
    const symptomEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        symptoms: selectedSymptoms,
        observation: observation,
        location: AppState.userLocation || 'Não informado',
        userId: AppState.currentUser?.id || null
    };
    
    // Adicionar ao histórico
    AppState.symptomsHistory.push(symptomEntry);
    saveToStorage('symptomsHistory', AppState.symptomsHistory);
    
    // Limpar formulário
    e.target.reset();
    
    alert('Sintomas registrados com sucesso! Obrigado por contribuir com os dados.');
}

// Simular verificação periódica de alertas (a cada 5 minutos)
setInterval(() => {
    if (AppState.currentUser && AppState.userPreferences.notifications) {
        checkForActiveAlerts();
    }
}, 5 * 60 * 1000);

