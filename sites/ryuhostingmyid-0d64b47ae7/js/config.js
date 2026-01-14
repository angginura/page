const CONFIG = {
  nama: "RyuZen Store", // Nama Store
  profil: "https://files.catbox.moe/etyco1.jpeg", // Url Profil
  banner: "https://files.catbox.moe/9gr5z6.jpeg", // Url Banner 
  tentang: "RyuZenn adalah toko online terpercaya yang telah melayani ribuan pelanggan sejak 2020. Kami menyediakan berbagai produk digital untuk kebutuhan sehari-hari dengan kualitas terbaik dan harga terjangkau.\n\nKomitmen kami adalah memberikan pengalaman berbelanja yang menyenangkan dengan pelayanan terbaik, produk original, dan garansi resmi untuk semua produk yang kami jual.",
  alamat: "Jl. Contoh No. 123, Jakarta, Indonesia",
  sosial_media: {
    email: "ryuofficial23@gmail.com", // Email
    youtube: "zassci_desu", // YouTube Username 
    tiktok: "Ryu offc", // Tiktok Username 
    whatsapp: "628811147684", // WhatsApp Number 
    telegram: "@Ryoyun" // Telegram Username
  },
  payment: {
    dana: "628811147684", // Payment Dana
    gopay: "628811147684", // Payment Gopay 
    ovo: "-", // Payment Ovo 
    qris: "https://files.cloudkuimages.guru/images/7700642249fe.jpg" // Url Qris
  },
  telegram_api: {
    bot: "8388993977:AAGJnWu-fWzZIKcmB7EMkvo2OcZ0VEXSqd8", // Token bot father
    chatid: "8216633781" // ID telegram
  },
}

// Produk
const productsData = {
  "Panel Pterodactyl": [
    {
      "id": 1,
      "name": "Panel Pterodactyl V1",
      "icon": "fas fa-server",
      "description": "Panel Pterodactyl hosting bot/game dengan performa stabil dan harga terjangkau.",
      "variants": [
        { "name": "1GB RAM", "price": 1000 },
        { "name": "2GB RAM", "price": 2000 },
        { "name": "3GB RAM", "price": 3000 },
        { "name": "4GB RAM", "price": 4000 },
        { "name": "5GB RAM", "price": 5000 },
        { "name": "6GB RAM", "price": 6000 },
        { "name": "7GB RAM", "price": 7000 },
        { "name": "8GB RAM", "price": 8000 },
        { "name": "9GB RAM", "price": 9000 },
        { "name": "10GB RAM", "price": 10000 },
        { "name": "Unlimited RAM", "price": 8000 }
      ]
    },
    {
      "id": 2,
      "name": "Panel Pterodactyl V2",
      "icon": "fas fa-server",
      "description": "Panel Pterodactyl khusus untuk high-performance game server.",
      "variants": [
        { "name": "1GB RAM", "price": 1000 },
        { "name": "2GB RAM", "price": 2000 },
        { "name": "3GB RAM", "price": 3000 },
        { "name": "4GB RAM", "price": 4000 },
        { "name": "5GB RAM", "price": 5000 },
        { "name": "Unlimited RAM", "price": 8000 }
      ]
    }
  ],
  "Script Bot WhatsApp": [
    {
      "id": 3,
      "name": "Script Bot Atrielle MD",
      "icon": "fas fa-robot",
      "description": "Script bot WhatsApp multi-device dengan fitur terlengkap.",
      "variants": [
        { "name": "ATRIELLE-MD NO UPDATE", "price": 25000 },
        { "name": "Free Update Permanen", "price": 80000 }
      ]
    },
    {
      "id": 4,
      "name": "SCRIPT ALICE ASISTENT",
      "icon": "fas fa-magic",
      "description": "Script asisten pribadi cerdas untuk kebutuhan WhatsApp Anda.",
      "variants": [
        { "name": "Script Free Update Permanen", "price": 50000 }
      ]
    },
    {
      "id": 10,
      "name": "Script Pushkontak",
      "icon": "fas fa-id-card",
      "description": "Jasa desain kartu nama profesional untuk bisnis atau personal branding.",
      "variants": [
        { "name": "Script", "price": 10000 }
      ]
    },
    {
      "id": 11,
      "name": "ScriptMd Selfbot",
      "icon": "fas fa-user-shield",
      "description": "Script self-bot untuk penggunaan pribadi dengan keamanan tinggi.",
      "variants": [
        { "name": "Script", "price": 15000 }
      ]
    }
  ],
  "Web & Jasa Desain": [
    {
      "id": 5,
      "name": "Web Hosting Created Panel",
      "icon": "fas fa-globe",
      "description": "Hosting website dengan panel cPanel / DirectAdmin, cocok untuk pemula.",
      "variants": [
        { "name": "Paket Simple", "price": 5000 },
        { "name": "Paket Lengkap", "price": 15000 }
      ]
    },
    {
      "id": 6,
      "name": "ScriptBug Justin",
      "icon": "fas fa-pen-nib",
      "description": "Jasa pembuatan logo dengan berbagai gaya desain (Brand/Komunitas).",
      "variants": [
        { "name": "No Update", "price": 35000 },
        { "name": "VIP FREE UPDATE", "price": 70000 }
      ]
    },
    {
      "id": 7,
      "name": "Script Bug Destroyer Infinity",
      "icon": "fas fa-image",
      "description": "Jasa pembuatan banner promosi untuk media sosial atau event.",
      "variants": [
        { "name": "No Update", "price": 20000 },
        { "name": "Update 2×", price: 25000 }
      ]
    },
    {
      "id": 8,
      "name": "Desain Poster",
      "icon": "fas fa-scroll",
      "description": "Jasa desain poster kreatif untuk kebutuhan bisnis atau publikasi.",
      "variants": [
        { "name": "Poster A4", "price": 20000 },
        { "name": "Poster A3", "price": 35000 }
      ]
    },
    {
      "id": 9,
      "name": "Script Simple store",
      "icon": "fas fa-laptop-code",
      "description": "Jasa desain UI/UX website modern dan user-friendly.",
      "variants": [
        { "name": "No Update", "price": 15000 },
        { "name": "Free Update", "price": 35000 },
        { "name": "Resseler Script", "price": 50000 }
      ]
    }
  ]
};
