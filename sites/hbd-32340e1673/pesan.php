<?php
// --- KONFIGURASI KEAMANAN ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Secret');

// Handle preflight OPTIONS request untuk CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- SET TIMEZONE INDONESIA ---
date_default_timezone_set('Asia/Jakarta');

// --- KUNCI API RAHASIA ---
define('API_SECRET_KEY', 'GantiDenganKunciRahasiaYangSangatSulitDitebak123!');

// --- KONFIGURASI FONNTE API ---
define('FONNTE_API_KEY', 'LMzEkfY51WL61Fbp4uxY');
define('FONNTE_API_URL', 'https://api.fonnte.com/send');
define('ADMIN_WHATSAPP', '6288290143920'); // Nomor WhatsApp Anda

// --- CEK KUNCI RAHASIA ---
 $secretKey = $_SERVER['HTTP_X_API_SECRET'] ?? '';
if ($secretKey !== API_SECRET_KEY) {
    http_response_code(403);
    die(json_encode(['success' => false, 'message' => 'Akses ditolak. Kunci tidak valid.']));
}

// --- KONFIGURASI UTAMA ---
define('MESSAGES_FILE', __DIR__ . '/messages.json');
define('LOG_FILE', __DIR__ . '/message_errors.log');

// --- FUNGSI PEMBANTU ---
function logError($message) {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message" . PHP_EOL;
    @file_put_contents(LOG_FILE, $logEntry, FILE_APPEND);
}

function getMessages() {
    if (!file_exists(MESSAGES_FILE)) {
        @file_put_contents(MESSAGES_FILE, json_encode([]));
    }
    $json = @file_get_contents(MESSAGES_FILE);
    return $json ? json_decode($json, true) : [];
}

function saveMessages($messages) {
    $json = json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return @file_put_contents(MESSAGES_FILE, $json, LOCK_EX) !== false;
}

function sendFonnteNotification($name, $message, $messageId) {
    // Format pesan WhatsApp yang menarik dengan markdown
    $whatsappMessage = "*🎉 PESAN BARU DARI BirthDay!* 🎉\n\n";
    $whatsappMessage .= "👤 *Nama:* " . $name . "\n";
    $whatsappMessage .= "💬 *Pesan:* " . $message . "\n";
    $whatsappMessage .= "📅 *Waktu:* " . date('d-m-Y [H:i:s]') . " WIB\n";
    
    // Data untuk Fonnte API dengan parameter untuk menghilangkan footer
    $postData = [
        'target' => ADMIN_WHATSAPP,
        'message' => $whatsappMessage,
        'delay' => '0', // Tidak ada delay
        'schedule' => '0', // Kirim sekarang
        'url' => 'https://desiparamita.my-style.in', // Ganti dengan website Anda
        'type' => 'text' // Tipe pesan text
    ];
    
    // Kirim menggunakan cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, FONNTE_API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: ' . FONNTE_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Fonnte-Bot/1.0');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    // Log hasil pengiriman
    $logMessage = "Fonnte API response for message ID $messageId. HTTP Code: $httpCode";
    if ($error) {
        $logMessage .= ". cURL Error: $error";
    }
    $logMessage .= ". Response: " . $response;
    logError($logMessage);
    
    // Parse response Fonnte
    $responseData = json_decode($response, true);
    $isSuccess = false;
    $errorMessage = null;
    
    // Fonnte response format: {"status": true/false, "reason": "..."}
    if ($httpCode === 200 && isset($responseData['status'])) {
        $isSuccess = $responseData['status'] === true;
        if (!$isSuccess && isset($responseData['reason'])) {
            $errorMessage = $responseData['reason'];
        }
    } else {
        $errorMessage = 'HTTP Error: ' . $httpCode;
        if (isset($responseData['reason'])) {
            $errorMessage .= ' - ' . $responseData['reason'];
        }
    }
    
    // Update status WhatsApp di pesan
    $messages = getMessages();
    foreach ($messages as &$msg) {
        if ($msg['id'] === $messageId) {
            $msg['whatsappStatus'] = [
                'sent' => $isSuccess,
                'timestamp' => date('c'),
                'httpCode' => $httpCode,
                'error' => $errorMessage,
                'apiResponse' => $responseData
            ];
            break;
        }
    }
    saveMessages($messages);
    
    return [
        'success' => $isSuccess,
        'httpCode' => $httpCode,
        'error' => $errorMessage,
        'apiResponse' => $responseData
    ];
}

// --- LOGIKA UTAMA ---
try {
    // --- GET: Ambil semua pesan (untuk admin panel) ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $messages = getMessages();
        
        // Urutkan dari yang terbaru
        usort($messages, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        // Hitung statistik
        $today = date('Y-m-d');
        $thisWeek = date('Y-m-d', strtotime('-7 days'));
        
        $todayCount = 0;
        $thisWeekCount = 0;
        $whatsappSentCount = 0;

        foreach ($messages as $msg) {
            $msgDate = date('Y-m-d', strtotime($msg['timestamp']));
            if ($msgDate === $today) {
                $todayCount++;
            }
            if ($msgDate >= $thisWeek) {
                $thisWeekCount++;
            }
            if (isset($msg['whatsappStatus']['sent']) && $msg['whatsappStatus']['sent']) {
                $whatsappSentCount++;
            }
        }

        echo json_encode([
            'success' => true, 
            'data' => [
                'messages' => $messages,
                'stats' => [
                    'total' => count($messages),
                    'today' => $todayCount,
                    'thisWeek' => $thisWeekCount,
                    'whatsappSent' => $whatsappSentCount
                ]
            ]
        ]);
        exit;
    }

    // --- POST: Tambah pesan baru atau Hapus pesan ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);

        // Validasi JSON
        if (json_last_error() !== JSON_ERROR_NONE) {
            logError('Invalid JSON received: ' . json_last_error_msg());
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data JSON tidak valid']);
            exit;
        }

        // --- CEK AKSI ---
        $action = $data['action'] ?? '';

        // --- JIKA AKSI ADALAH HAPUS ---
        if ($action === 'delete') {
            $messageId = $data['id'] ?? null;

            if ($messageId === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID pesan diperlukan untuk menghapus']);
                exit;
            }

            $messages = getMessages();
            $found = false;
            $finalMessages = array_filter($messages, function($msg) use ($messageId, &$found) {
                if ($msg['id'] === $messageId) {
                    $found = true;
                    return false; // Hapus pesan ini
                }
                return true; // Pertahankan pesan lain
            });

            if ($found) {
                // Re-index array
                $finalMessages = array_values($finalMessages);
                if (saveMessages($finalMessages)) {
                    echo json_encode(['success' => true, 'message' => 'Pesan berhasil dihapus']);
                } else {
                    logError('Gagal menulis ke file setelah hapus');
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan perubahan']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Pesan tidak ditemukan']);
            }
            exit;
        }

        // --- JIKA AKSI RETRY WHATSAPP ---
        if ($action === 'retry_whatsapp') {
            $messageId = $data['id'] ?? null;
            
            if ($messageId === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID pesan diperlukan']);
                exit;
            }
            
            $messages = getMessages();
            $targetMessage = null;
            
            foreach ($messages as $msg) {
                if ($msg['id'] === $messageId) {
                    $targetMessage = $msg;
                    break;
                }
            }
            
            if ($targetMessage) {
                $fonnteResult = sendFonnteNotification(
                    $targetMessage['name'], 
                    $targetMessage['content'], 
                    $messageId
                );
                
                echo json_encode([
                    'success' => $fonnteResult['success'],
                    'message' => $fonnteResult['success'] ? 
                        'Notifikasi WhatsApp berhasil dikirim ulang' : 
                        'Gagal mengirim notifikasi WhatsApp',
                    'whatsapp' => $fonnteResult
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Pesan tidak ditemukan']);
            }
            exit;
        }

        // --- JIKA BUKAN HAPUS/RETRY, MAKA TAMBAH PESAN BARU ---
        // Validasi input
        if (empty($data['name']) || empty($data['message'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Nama dan pesan harus diisi']);
            exit;
        }

        $name = trim($data['name']);
        $message = trim($data['message']);

        // Validasi panjang input
        if (strlen($name) > 100 || strlen($message) > 1000) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Input terlalu panjang']);
            exit;
        }

        $messages = getMessages();
        $messageId = uniqid('msg_', true);
        $newMessage = [
            'id' => $messageId,
            'name' => $name,
            'content' => $message,
            'timestamp' => date('c'), // Format ISO 8601
            'whatsappStatus' => [
                'sent' => false,
                'timestamp' => null,
                'httpCode' => null,
                'error' => null
            ]
        ];

        $messages[] = $newMessage;

        if (saveMessages($messages)) {
            // Kirim notifikasi ke WhatsApp secara otomatis menggunakan Fonnte
            $fonnteResult = sendFonnteNotification($name, $message, $messageId);
            
            $responseMessage = $fonnteResult['success'] ? 
                'Pesan berhasil disimpan dan notifikasi WhatsApp dikirim' : 
                'Pesan berhasil disimpan. Notifikasi WhatsApp gagal dikirim: ' . $fonnteResult['error'];
            
            echo json_encode([
                'success' => true, 
                'message' => $responseMessage,
                'whatsapp' => $fonnteResult,
                'messageId' => $messageId
            ]);
        } else {
            logError('Gagal menulis pesan ke file. Cek izin (permissions) untuk ' . MESSAGES_FILE);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan server saat menyimpan pesan']);
        }
        exit;
    }

} catch (Exception $e) {
    logError('Fatal Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan server']);
}

// Jika metode tidak diizinkan
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metode request tidak diizinkan']);
?>