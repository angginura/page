<?php
// --- KEAMANAN: SESSION & LOGIN ---
session_start();

// Ganti dengan password yang sangat kuat dan unik
define('ADMIN_PASSWORD', '25122011');

 $error = '';
 $logoutSuccess = false;

// Proses logout
if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
    session_destroy();
    $logoutSuccess = true;
}

// Proses login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        // Redirect untuk menghindari pengiriman ulang formulir
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Password salah! Silakan coba lagi.';
    }
}

// Cek apakah user sudah login
 $isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Pesan Ulang Tahun</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Great+Vibes&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* ... Gaya CSS Anda tetap sama di sini ... */
        :root {
            --primary-pink: #ffcce6;
            --rose-pink: #ff99cc;
            --peach: #ffccdd;
            --gold: #ffd700;
            --text-dark: #555;
            --error-red: #ff4757;
            --success-green: #4CAF50;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(to bottom, var(--primary-pink), var(--peach));
            color: var(--text-dark);
            min-height: 100vh;
            padding: 20px;
        }
        
        /* Gaya untuk halaman login */
        .login-page {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.5s ease;
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .login-container h2 {
            font-family: 'Great Vibes', cursive;
            font-size: 2.5rem;
            color: var(--rose-pink);
            margin-bottom: 10px;
        }
        
        .login-container p {
            color: var(--text-dark);
            margin-bottom: 30px;
            font-size: 1rem;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .login-input {
            padding: 15px;
            border: 2px solid var(--rose-pink);
            border-radius: 10px;
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
        }
        
        .login-input:focus {
            outline: none;
            border-color: var(--primary-pink);
            box-shadow: 0 0 10px rgba(255, 153, 204, 0.3);
        }
        
        .login-btn {
            background: var(--rose-pink);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }
        
        .login-btn:hover {
            background: var(--primary-pink);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 153, 204, 0.4);
        }
        
        .login-error {
            color: var(--error-red);
            font-size: 0.9rem;
            margin-top: 10px;
            display: none;
        }
        
        .login-error.show {
            display: block;
            animation: shake 0.5s ease;
        }
        
        .login-success {
            color: var(--success-green);
            font-size: 0.9rem;
            margin-top: 10px;
            display: block;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        /* Gaya untuk halaman admin (jika sudah login) */
        .admin-page {
            max-width: 1000px;
            margin: 0 auto;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .admin-page.show {
            opacity: 1;
        }
        
        /* ... Sisanya gaya CSS Anda tetap sama ... */
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-family: 'Great Vibes', cursive;
            font-size: 2.5rem;
            color: var(--rose-pink);
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1rem;
            color: var(--text-dark);
        }
        
        .logout-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-red);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .logout-btn:hover {
            background: #e74c3c;
            transform: scale(1.05);
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .stat-item {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 15px 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            min-width: 120px;
            position: relative;
        }
        
        .stat-number {
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--rose-pink);
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: var(--text-dark);
            margin-top: 5px;
        }
        
        .actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .action-btn {
            background-color: var(--rose-pink);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .action-btn:hover {
            background-color: var(--primary-pink);
            transform: scale(1.05);
        }
        
        .action-btn.danger {
            background-color: var(--error-red);
        }
        
        .action-btn.danger:hover {
            background: #e74c3c;
        }
        
        .realtime-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-left: 10px;
            font-size: 0.8rem;
            color: var(--success-green);
        }
        
        .realtime-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--success-green);
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        
        .messages-container {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .message-item {
            background-color: rgba(255, 153, 204, 0.1);
            padding: 15px;
            border-radius: 15px;
            margin-bottom: 15px;
            border-left: 4px solid var(--rose-pink);
            position: relative;
            transition: all 0.3s ease;
        }
        
        .message-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(255, 153, 204, 0.2);
        }
        
        .message-item.new-message {
            animation: highlightNew 2s ease;
            border-left-color: var(--success-green);
        }
        
        @keyframes highlightNew {
            0% { background-color: rgba(76, 175, 80, 0.3); }
            100% { background-color: rgba(255, 153, 204, 0.1); }
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .message-name {
            font-weight: 600;
            color: var(--rose-pink);
            font-size: 1.1rem;
        }
        
        .message-time {
            font-size: 0.8rem;
            color: #888;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 3px 8px;
            border-radius: 10px;
        }
        
        .message-content {
            font-size: 1rem;
            line-height: 1.5;
            color: var(--text-dark);
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .message-actions {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .message-item:hover .message-actions {
            opacity: 1;
        }
        
        .delete-btn {
            background: var(--error-red);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            font-size: 0.8rem;
        }
        
        .delete-btn:hover {
            background: #e74c3c;
            transform: scale(1.1);
        }
        
        .empty-messages {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-dark);
            font-style: italic;
            font-size: 1.1rem;
        }
        
        .empty-messages i {
            font-size: 3rem;
            color: var(--rose-pink);
            margin-bottom: 20px;
            display: block;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            font-size: 1.1rem;
            color: var(--text-dark);
        }
        
        .loading i {
            font-size: 2rem;
            color: var(--rose-pink);
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
            display: block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .footer p {
            font-size: 0.9rem;
            color: var(--text-dark);
        }
        
        .footer a {
            color: var(--rose-pink);
            text-decoration: none;
            font-weight: 600;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--success-green);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .toast.show {
            opacity: 1;
        }
        
        .messages-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .messages-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
            background: var(--rose-pink);
            border-radius: 10px;
        }
        
        .messages-container::-webkit-scrollbar-thumb:hover {
            background: var(--primary-pink);
        }
        
        @media (max-width: 768px) {
            .login-container { padding: 30px 20px; max-width: 350px; margin: 20px; }
            .login-container h2 { font-size: 2rem; }
            .header h1 { font-size: 2rem; }
            .actions { flex-direction: column; align-items: center; }
            .action-btn { width: 200px; justify-content: center; }
            .stats { gap: 15px; }
            .stat-item { padding: 10px 20px; min-width: 100px; }
            .stat-number { font-size: 1.5rem; }
            .message-header { flex-direction: column; align-items: flex-start; }
            .message-actions { position: static; opacity: 1; margin-top: 10px; justify-content: flex-end; }
        }
    </style>
</head>
<body>
<?php if (!$isLoggedIn): ?>
    <!-- Halaman Login -->
    <div class="login-page">
        <div class="login-container">
            <h2>💌 Admin Pesan</h2>
            <p>Masukkan password untuk melihat pesan</p>
            <?php if ($logoutSuccess): ?>
                <p class="login-success">Anda telah berhasil keluar.</p>
            <?php endif; ?>
            <form class="login-form" method="post" action="admin.php">
                <input type="password" class="login-input" name="password" placeholder="Masukkan password" required>
                <button type="submit" class="login-btn">
                    <i class="fas fa-lock"></i> Masuk
                </button>
            </form>
            <?php if ($error): ?>
                <div class="login-error show"><?php echo $error; ?></div>
            <?php endif; ?>
        </div>
    </div>
<?php else: ?>
    <!-- Halaman Admin -->
    <a href="admin.php?logout=true" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Keluar
    </a>
    
    <div class="admin-page" id="mainContainer">
        <div class="header">
            <h1>💌 Admin Pesan Ulang Tahun</h1>
            <p>
                Halaman khusus untuk melihat semua pesan yang telah dikirim
                <span class="realtime-indicator">
                    <span class="realtime-dot"></span>
                    Real-time
                </span>
            </p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number" id="totalMessages">0</div>
                <div class="stat-label">Total Pesan</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="todayMessages">0</div>
                <div class="stat-label">Hari Ini</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="thisWeekMessages">0</div>
                <div class="stat-label">Minggu Ini</div>
            </div>
        </div>
        
        <div class="actions">
            <button class="action-btn" id="refreshBtn">
                <i class="fas fa-sync"></i> Refresh
            </button>
            <button class="action-btn" id="copyAllBtn">
                <i class="fas fa-copy"></i> Copy All
            </button>
        </div>
        
        <div class="messages-container" id="messagesContainer">
            <div class="loading" id="loadingState">
                <i class="fas fa-spinner"></i>
                Memuat pesan dari server...
            </div>
            <div class="empty-messages" id="emptyState" style="display: none;">
                <i class="fas fa-envelope-open"></i>
                Belum ada pesan baru
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Happy Birthday Desi Paramita | Dibuat dengan 💕</p>
        </div>
    </div>
    
    <div class="toast" id="toast"></div>
    
    <script>
        // --- KONFIGURASI ---
        const CONFIG = {
            API_URL: './pesan.php',
            REFRESH_INTERVAL: 5000 // Refresh setiap 5 detik untuk real-time
        };

        // --- KELAS MANAJER PESAN ---
        class ServerMessageManager {
            constructor() {
                this.messages = [];
                this.stats = { total: 0, today: 0, thisWeek: 0 };
                this.lastMessageCount = 0;
            }

            async fetchMessagesAndStats() {
                console.log('Fetching messages and stats...');
                try {
                    const cacheBuster = new Date().getTime();
                    const response = await fetch(`${CONFIG.API_URL}?t=${cacheBuster}`, {
                        method: 'GET',
                        headers: {
                            'X-API-Secret': 'GantiDenganKunciRahasiaYangSangatSulitDitebak123!'
                        }
                    });
                    if (!response.ok) throw new Error('Network response was not ok');
                    const result = await response.json();
                    if (result.success && result.data) {
                        const newMessageCount = result.data.messages.length;
                        const hasNewMessages = newMessageCount > this.lastMessageCount;
                        
                        this.messages = result.data.messages || [];
                        this.stats = result.data.stats || { total: 0, today: 0, thisWeek: 0 };
                        this.lastMessageCount = newMessageCount;
                        
                        return { 
                            messages: this.messages, 
                            stats: this.stats,
                            hasNewMessages: hasNewMessages
                        };
                    } else {
                        throw new Error(result.message || 'Failed to fetch data');
                    }
                } catch (error) {
                    console.error('Fetch Error:', error);
                    showToast('Gagal memuat data: ' + error.message, 5000);
                    return { 
                        messages: this.messages, 
                        stats: this.stats,
                        hasNewMessages: false
                    };
                }
            }

            async deleteMessage(messageId) {
                console.log(`Attempting to delete message with ID: ${messageId}`);
                try {
                    const response = await fetch(CONFIG.API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Secret': 'GantiDenganKunciRahasiaYangSangatSulitDitebak123!'
                        },
                        body: JSON.stringify({
                            action: 'delete',
                            id: messageId
                        })
                    });
                    if (!response.ok) throw new Error('Network response was not ok');
                    const result = await response.json();
                    console.log('Server response for delete:', result);
                    
                    if (result.success) {
                        this.messages = this.messages.filter(msg => msg.id !== messageId);
                        this.stats.total--;
                        return true;
                    } else {
                        throw new Error(result.message || 'Failed to delete message');
                    }
                } catch (error) {
                    console.error('Delete Error:', error);
                    showToast('Gagal menghapus pesan: ' + error.message, 5000);
                    return false;
                }
            }

            getMessages() { return this.messages; }
            getStats() { return this.stats; }
        }
        
        // --- INISIALISASI ---
        const messageManager = new ServerMessageManager();
        let refreshInterval;
        
        // --- ELEMEN DOM ---
        const mainContainer = document.getElementById('mainContainer');
        const messagesContainer = document.getElementById('messagesContainer');
        const totalMessagesEl = document.getElementById('totalMessages');
        const todayMessagesEl = document.getElementById('todayMessages');
        const thisWeekMessagesEl = document.getElementById('thisWeekMessages');
        const toast = document.getElementById('toast');
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const refreshBtn = document.getElementById('refreshBtn');
        const copyAllBtn = document.getElementById('copyAllBtn');

        // --- FUNGSI BANTU ---
        function showToast(message, duration = 3000) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        async function displayMessages() {
            console.log('Displaying messages...');
            loadingState.style.display = 'block';
            emptyState.style.display = 'none';
            
            const data = await messageManager.fetchMessagesAndStats();
            const messages = data.messages;
            const stats = data.stats;
            const hasNewMessages = data.hasNewMessages;

            loadingState.style.display = 'none';

            // Update stats
            totalMessagesEl.textContent = stats.total;
            todayMessagesEl.textContent = stats.today;
            thisWeekMessagesEl.textContent = stats.thisWeek;

            if (messages.length === 0) {
                emptyState.style.display = 'block';
                return;
            }

            // Clear container
            messagesContainer.innerHTML = '';

            messages.forEach(message => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                if (hasNewMessages && messages.indexOf(message) === 0) {
                    messageItem.classList.add('new-message');
                }
                messageItem.dataset.messageId = message.id;
                
                const date = new Date(message.timestamp);
                const formattedDate = date.toLocaleString('id-ID');
                
                // Header
                const headerDiv = document.createElement('div');
                headerDiv.className = 'message-header';

                const nameDiv = document.createElement('div');
                nameDiv.className = 'message-name';
                nameDiv.textContent = message.name;

                const timeDiv = document.createElement('div');
                timeDiv.className = 'message-time';
                timeDiv.textContent = formattedDate;

                headerDiv.appendChild(nameDiv);
                headerDiv.appendChild(timeDiv);

                // Content
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.textContent = message.content;

                // Actions
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.title = 'Hapus pesan';
                deleteButton.onclick = () => window.deleteMessage(message.id);

                actionsDiv.appendChild(deleteButton);

                // Assemble
                messageItem.appendChild(headerDiv);
                messageItem.appendChild(contentDiv);
                messageItem.appendChild(actionsDiv);
                
                messagesContainer.appendChild(messageItem);
            });

            // Show notification for new messages
            if (hasNewMessages) {
                showToast('📬 Pesan baru diterima!', 3000);
                // Play notification sound if available
                playNotificationSound();
            }
        }

        function playNotificationSound() {
            // Create a simple beep sound
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
        }

        // Deklarasikan deleteMessage di scope global
        window.deleteMessage = async function(messageId) {
            console.log(`Delete button clicked. Message ID received: ${messageId}`);
            if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
                if (await messageManager.deleteMessage(messageId)) {
                    await displayMessages();
                    showToast('Pesan berhasil dihapus');
                }
            }
        };

        // --- EVENT LISTENERS ---
        refreshBtn.addEventListener('click', () => {
            displayMessages();
            showToast('Data pesan diperbarui');
        });

        copyAllBtn.addEventListener('click', () => {
            const messages = messageManager.getMessages();
            let textContent = 'PESAN ULANG TAHUN DESI PARAMITA\n\n';
            messages.forEach((message, index) => {
                const date = new Date(message.timestamp);
                textContent += `${index + 1}. ${message.name} (${date.toLocaleString('id-ID')})\n`;
                textContent += `   ${message.content}\n\n`;
            });
            navigator.clipboard.writeText(textContent).then(() => {
                showToast('Semua pesan telah disalin ke clipboard!');
            }).catch(err => {
                console.error('Copy failed:', err);
                showToast('Gagal menyalin pesan');
            });
        });

        // --- AUTO REFRESH FOR REAL-TIME ---
        function startAutoRefresh() {
            refreshInterval = setInterval(() => {
                displayMessages();
            }, CONFIG.REFRESH_INTERVAL);
        }

        function stopAutoRefresh() {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        }

        // --- INISIALISASI AWAL ---
        window.addEventListener('load', () => {
            console.log('Window fully loaded. Displaying main content.');
            mainContainer.classList.add('show');
            displayMessages().then(() => {
                startAutoRefresh();
            });
        });

        // Stop auto refresh when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoRefresh();
            } else {
                displayMessages().then(() => {
                    startAutoRefresh();
                });
            }
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            stopAutoRefresh();
        });
    </script>
<?php endif; ?>
</body>
</html>