<?php
// Test Fonnte API
 $apiKey = 'LMzEkfY51WL61Fbp4uxY';
 $target = '6288290143920'; // Nomor WhatsApp Anda
 $message = "*🧪 Test Pesan dari API Fonnte*\n\nIni adalah pesan test untuk memastikan API berfungsi dengan baik.\n\nWaktu: " . date('Y-m-d H:i:s');

 $ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.fonnte.com/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'target' => $target,
    'message' => $message,
    'delay' => '0',
    'schedule' => '0'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

 $response = curl_exec($ch);
 $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
 $error = curl_error($ch);
curl_close($ch);

echo "<h3>Test API Fonnte</h3>";
echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
echo "<p><strong>Response:</strong></p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";
if ($error) {
    echo "<p><strong>Error:</strong> " . htmlspecialchars($error) . "</p>";
}

// Parse response
 $responseData = json_decode($response, true);
if (isset($responseData['status'])) {
    if ($responseData['status'] === true) {
        echo "<p style='color: green;'><strong>✅ Berhasil!</strong> " . ($responseData['reason'] ?? 'Pesan terkirim') . "</p>";
    } else {
        echo "<p style='color: red;'><strong>❌ Gagal!</strong> " . ($responseData['reason'] ?? 'Unknown error') . "</p>";
    }
}
?>