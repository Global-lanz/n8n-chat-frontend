const API_URL = window.API_BASE_URL + '/api';

const VERSION = window.VERSION;

let socket;
let token = localStorage.getItem('token');
let currentUser = null;
let botName = '';

// Inicialização
if (token) {
    validateToken();
} else {
    showAuthScreen();
}

loadVersions();

// Funções para carregar versões
async function loadVersions() {
    try {
        const response = await fetch(`${API_URL}/version`);
        const data = await response.json();
        const serverVersion = data.version;
        document.getElementById('version-info').textContent = `server: ${serverVersion} | chat: ${VERSION}`;
    } catch (error) {
        document.getElementById('version-info').textContent = `chat: ${VERSION}`;
    }
}

// Funções de Autenticação
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('auth-error').textContent = '';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('auth-error').textContent = '';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError('Preencha todos os campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Erro ao fazer login');
            return;
        }
        
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        
        showChatScreen();
    } catch (error) {
        showError('Erro de conexão');
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!username || !email || !password) {
        showError('Preencha todos os campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Erro ao criar conta');
            return;
        }
        
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        
        showChatScreen();
    } catch (error) {
        showError('Erro de conexão');
    }
}

async function validateToken() {
    try {
        const response = await fetch(`${API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showChatScreen();
        } else {
            localStorage.removeItem('token');
            showAuthScreen();
        }
    } catch (error) {
        localStorage.removeItem('token');
        showAuthScreen();
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    currentUser = null;
    if (socket) socket.disconnect();
    showAuthScreen();
}

function showError(message) {
    document.getElementById('auth-error').textContent = message;
}

// Funções de Configurações
function toggleSettings() {
    const menu = document.getElementById('settings-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function changeTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
}

async function updateName() {
    const newName = document.getElementById('name-input').value.trim();
    if (!newName) {
        alert('Nome não pode estar vazio');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/user/username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username: newName })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erro ao atualizar nome');
            return;
        }
        
        currentUser.username = data.user.username;
        alert('Nome atualizado com sucesso!');
    } catch (error) {
        alert('Erro de conexão');
    }
}

function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('chat-screen').style.display = 'none';
}

// Função para carregar dados do usuário
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            document.getElementById('name-input').value = currentUser.username;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

function showChatScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    document.getElementById('theme-toggle').value = savedTheme;
    
    // Mostrar botão admin se usuário for administrador
    if (currentUser && currentUser.is_admin) {
        document.getElementById('admin-btn').style.display = 'block';
    }
    
    // Carregar dados do usuário
    loadUserData();
    
    initializeChat();
}

// Funções do Chat
async function initializeChat() {
    // Carregar configuração
    await loadConfig();
    
    // Conectar WebSocket
    const socketUrl = window.API_BASE_URL;
    
    socket = io(socketUrl);
    
    socket.on('connect', () => {
        socket.emit('authenticate', token);
    });
    
    socket.on('new_message', (message) => {
        if (message.sender === 'bot') {
            displayMessage(message.content, 'bot', message.timestamp);
        }
    });
    
    // Carregar histórico
    await loadMessages();
    
    // Configurar input
    const input = document.getElementById('message-input');
    
    // Detectar se é desktop (largura > 768px)
    const isDesktop = window.innerWidth > 768;
    
    if (isDesktop) {
        // Desktop: Enter envia, Shift+Enter quebra linha
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    } else {
        // Mobile: Enter quebra linha, botão envia
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    input.addEventListener('input', autoResize);
}

async function loadConfig() {
    try {
        const response = await fetch(`${API_URL}/config`);
        if (response.ok) {
            const config = await response.json();
            botName = config.botName || 'NorteIA';
        } else {
            botName = 'NorteIA'; // Fallback
        }
        // Atualizar o header com o nome do bot
        document.getElementById('bot-name').textContent = botName;
    } catch (error) {
        console.error('Erro ao carregar configuração:', error);
        botName = 'NorteIA'; // Fallback
        loadChatName(botName);
    }
}

async function loadChatName(botName) {
    document.getElementById('bot-name').textContent = botName;
    document.getElementById('title-bot-name').textContent = '💬 ' + botName;
}


async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return;
        
        const messages = await response.json();
        
        const container = document.getElementById('messages');
        container.innerHTML = '';
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <h3>👋 Bem-vindo!</h3>
                    <p>Como posso ajudar você hoje?</p>
                </div>
            `;
        } else {
            messages.forEach(msg => {
                displayMessage(msg.content, msg.sender, msg.timestamp);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content) return;
    
    // Limpar input
    input.value = '';
    autoResize();
    
    // Mostrar mensagem do usuário imediatamente
    displayMessage(content, 'user', new Date());
    
    // Enviar para o servidor
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            displayMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'bot', new Date());
        }
    } catch (error) {
        displayMessage('Erro de conexão. Tente novamente.', 'bot', new Date());
    }
}

function displayMessage(content, sender, timestamp) {
    const container = document.getElementById('messages');
    
    // Remover mensagem de boas-vindas se existir
    const welcome = container.querySelector('.welcome-message');
    if (welcome) welcome.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const time = new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Remover espaços extras e linhas vazias antes de renderizar Markdown
    const cleanContent = content.split('\n').map(line => line.trim()).filter(line => line).join('\n').trim();
    const htmlContent = marked.parse(cleanContent);
    messageDiv.innerHTML = `
        <div class="message-content">
            ${htmlContent}
            <div class="message-time">${time}</div>
        </div>
    `;

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function autoResize() {
    const input = document.getElementById('message-input');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funções de Configurações
function toggleSettings() {
    const menu = document.getElementById('settings-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function changeTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
}

async function updateName() {
    const newName = document.getElementById('name-input').value.trim();
    
    if (!newName) {
        alert('Por favor, digite um nome válido.');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/user/username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username: newName })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erro ao atualizar nome');
            return;
        }
        
        currentUser.username = data.user.username;
        alert('Nome atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar nome:', error);
        alert('Erro de conexão');
    }
}

// Configurar atalhos de teclado baseados no dispositivo
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    if (input) {
        const isDesktop = window.innerWidth > 768;
        
        if (isDesktop) {
            // Desktop: Enter envia, Shift+Enter quebra linha
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        } else {
            // Mobile: Enter quebra linha, botão envia
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }
});

// ===== FUNÇÕES DE ADMINISTRAÇÃO =====

function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        loadUsers();
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            alert('Erro ao carregar usuários');
            return;
        }
        
        const data = await response.json();
        displayUsers(data.users);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro de conexão');
    }
}

function displayUsers(users) {
    const table = document.getElementById('users-table');
    
    if (users.length === 0) {
        table.innerHTML = '<p class="no-users">Nenhum usuário cadastrado</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuário</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Status</th>
                    <th>Licença Expira</th>
                    <th>Criado Em</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        const expiresAt = user.license_expires_at 
            ? new Date(user.license_expires_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Sem limite';
            
        const createdAt = new Date(user.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const isExpired = user.license_expires_at && new Date(user.license_expires_at) < new Date();
        const licenseClass = isExpired ? 'expired' : '';
        const isActive = user.is_active !== false;
        const statusEmoji = isActive ? '✅' : '🔴';
        const statusText = isActive ? 'Ativo' : 'Desabilitado';
        
        html += `
            <tr class="${!isActive ? 'disabled-user' : ''}">
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.is_admin ? '✅' : '❌'}</td>
                <td title="${statusText}">${statusEmoji}</td>
                <td class="${licenseClass}">${expiresAt}</td>
                <td>${createdAt}</td>
                <td class="actions">
                    <button onclick="editUser(${user.id})" class="btn-edit" title="Editar">✏️</button>
                    <button onclick="deleteUser(${user.id})" class="btn-delete" title="Deletar">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    table.innerHTML = html;
}

function showCreateUserForm() {
    document.getElementById('form-title').textContent = 'Criar Novo Usuário';
    document.getElementById('edit-user-id').value = '';
    document.getElementById('form-username').value = '';
    document.getElementById('form-email').value = '';
    document.getElementById('form-password').value = '';
    document.getElementById('form-license-expires').value = '';
    document.getElementById('form-is-admin').checked = false;
    document.getElementById('form-is-active').checked = true;
    document.getElementById('password-group').style.display = 'block';
    document.getElementById('user-form').style.display = 'block';
}

async function editUser(userId) {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        const user = data.users.find(u => u.id === userId);
        
        if (!user) return;
        
        document.getElementById('form-title').textContent = 'Editar Usuário';
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('form-username').value = user.username;
        document.getElementById('form-email').value = user.email;
        document.getElementById('password-group').style.display = 'none';
        
        if (user.license_expires_at) {
            const date = new Date(user.license_expires_at);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            document.getElementById('form-license-expires').value = localDate.toISOString().slice(0, 16);
        } else {
            document.getElementById('form-license-expires').value = '';
        }
        
        document.getElementById('form-is-admin').checked = user.is_admin || false;
        document.getElementById('form-is-active').checked = user.is_active !== false;
        document.getElementById('user-form').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        alert('Erro ao carregar usuário');
    }
}

async function saveUser() {
    const userId = document.getElementById('edit-user-id').value;
    const username = document.getElementById('form-username').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const password = document.getElementById('form-password').value;
    const licenseExpires = document.getElementById('form-license-expires').value;
    const isAdmin = document.getElementById('form-is-admin').checked;
    const isActive = document.getElementById('form-is-active').checked;
    
    if (!username || !email) {
        alert('Nome de usuário e email são obrigatórios');
        return;
    }
    
    if (!userId && !password) {
        alert('Senha é obrigatória para novos usuários');
        return;
    }
    
    try {
        const body = {
            username,
            email,
            license_expires_at: licenseExpires || null,
            is_admin: isAdmin,
            is_active: isActive
        };
        
        if (!userId) {
            body.password = password;
        }
        
        const url = userId 
            ? `${API_URL}/admin/users/${userId}`
            : `${API_URL}/admin/users`;
            
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erro ao salvar usuário');
            return;
        }
        
        alert(data.message || 'Usuário salvo com sucesso!');
        cancelUserForm();
        loadUsers();
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro de conexão');
    }
}

async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erro ao deletar usuário');
            return;
        }
        
        alert(data.message || 'Usuário deletado com sucesso!');
        loadUsers();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro de conexão');
    }
}

function cancelUserForm() {
    document.getElementById('user-form').style.display = 'none';
}