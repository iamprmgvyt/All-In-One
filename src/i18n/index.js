// Made by prmgvyt
const config = require('../../config.json');

const translations = {
  en: {
    welcome: "Welcome to {server}, {user}!",
    ping: "Pong! API Latency: {api}ms | WebSocket: {ws}ms",
    uptime: "Uptime: {uptime}",
    security_alert: "⚠️ Security Alert: High risk content detected ({score}% confidence).",
    captcha_prompt: "🔒 CAPTCHA Verification: Please solve the CAPTCHA image below within {time} minutes.",
    captcha_success: "✅ CAPTCHA verified successfully! Welcome to the server.",
    captcha_failed: "❌ CAPTCHA verification failed. Quarantine applied.",
    music_playing: "🎵 Now playing: **{title}** by **{artist}**",
    music_stopped: "⏹️ Music playback stopped.",
    permission_denied: "⛔ You do not have permission to execute this command.",
    command_not_found: "❌ Command not found."
  },
  vi: {
    welcome: "Chào mừng đến với {server}, {user}!",
    ping: "Pong! Độ trễ API: {api}ms | WebSocket: {ws}ms",
    uptime: "Thời gian hoạt động: {uptime}",
    security_alert: "⚠️ Cảnh báo an ninh: Phát hiện nội dung rủi ro cao (Độ tin cậy: {score}%).",
    captcha_prompt: "🔒 Xác minh CAPTCHA: Vui lòng giải bài toán/mã trong ảnh bên dưới trong vòng {time} phút.",
    captcha_success: "✅ Xác minh CAPTCHA thành công! Chào mừng bạn đến với máy chủ.",
    captcha_failed: "❌ Xác minh CAPTCHA thất bại. Đã áp dụng chế độ cách ly.",
    music_playing: "🎵 Đang phát: **{title}** trình bày bởi **{artist}**",
    music_stopped: "⏹️ Đã dừng phát nhạc.",
    permission_denied: "⛔ Bạn không có quyền thực thi lệnh này.",
    command_not_found: "❌ Không tìm thấy lệnh."
  },
  ja: {
    welcome: "{server}へようこそ、{user}さん！",
    ping: "ポン！ APIレイテンシ: {api}ms | WebSocket: {ws}ms",
    uptime: "稼働時間: {uptime}",
    security_alert: "⚠️ セキュリティアラート: 高リスクなコンテンツを検出しました (信頼度: {score}%)。",
    captcha_prompt: "🔒 CAPTCHA認証: {time}分以内に以下の画像コードを解いてください。",
    captcha_success: "✅ CAPTCHA認証に成功しました！ サーバーへようこそ。",
    captcha_failed: "❌ CAPTCHA認証に失敗しました。 隔離処理を実行しました。",
    music_playing: "🎵 再生中: **{title}** - **{artist}**",
    music_stopped: "⏹️ 音楽の再生を停止しました。",
    permission_denied: "⛔ このコマンドを実行する権限がありません。",
    command_not_found: "❌ コマンドが見つかりません。"
  },
  es: {
    welcome: "¡Bienvenido a {server}, {user}!",
    ping: "¡Pong! Latencia API: {api}ms | WebSocket: {ws}ms",
    uptime: "Tiempo de actividad: {uptime}",
    security_alert: "⚠️ Alerta de seguridad: Contenido de alto riesgo detectado (Confianza: {score}%).",
    captcha_prompt: "🔒 Verificación CAPTCHA: Por favor resuelva el CAPTCHA a continuación en {time} minutos.",
    captcha_success: "✅ ¡Verificación CAPTCHA exitosa! Bienvenido al servidor.",
    captcha_failed: "❌ Verificación CAPTCHA fallida. Cuarentena aplicada.",
    music_playing: "🎵 Reproduciendo ahora: **{title}** de **{artist}**",
    music_stopped: "⏹️ Reproducción de música detenida.",
    permission_denied: "⛔ No tienes permiso para ejecutar este comando.",
    command_not_found: "❌ Comando no encontrado."
  },
  fr: {
    welcome: "Bienvenue sur {server}, {user} !",
    ping: "Pong ! Latence API : {api}ms | WebSocket : {ws}ms",
    uptime: "Temps de fonctionnement : {uptime}",
    security_alert: "⚠️ Alerte de sécurité : Contenu à haut risque détecté (Confiance : {score}%).",
    captcha_prompt: "🔒 Vérification CAPTCHA : Veuillez résoudre l'image CAPTCHA ci-dessous en {time} minutes.",
    captcha_success: "✅ Vérification CAPTCHA réussie ! Bienvenue sur le serveur.",
    captcha_failed: "❌ Échec de la vérification CAPTCHA. Quarantaine appliquée.",
    music_playing: "🎵 En cours de lecture : **{title}** par **{artist}**",
    music_stopped: "⏹️ Lecture de musique arrêtée.",
    permission_denied: "⛔ Vous n'avez pas la permission d'exécuter cette commande.",
    command_not_found: "❌ Commande introuvable."
  },
  de: {
    welcome: "Willkommen auf {server}, {user}!",
    ping: "Pong! API-Latenz: {api}ms | WebSocket: {ws}ms",
    uptime: "Betriebszeit: {uptime}",
    security_alert: "⚠️ Sicherheitswarnung: Inhalt mit hohem Risiko erkannt (Vertrauen: {score}%).",
    captcha_prompt: "🔒 CAPTCHA-Überprüfung: Bitte lösen Sie das obige CAPTCHA innerhalb von {time} Minuten.",
    captcha_success: "✅ CAPTCHA-Überprüfung erfolgreich! Willkommen auf dem Server.",
    captcha_failed: "❌ CAPTCHA-Überprüfung fehlgeschlagen. Quarantäne angewendet.",
    music_playing: "🎵 Jetzt läuft: **{title}** von **{artist}**",
    music_stopped: "⏹️ Musikwiedergabe gestoppt.",
    permission_denied: "⛔ Sie haben keine Berechtigung, diesen Befehl auszuführen.",
    command_not_found: "❌ Befehl nicht gefunden."
  }
};

class I18nEngine {
  constructor() {
    this.defaultLang = config.defaultLanguage || 'en';
    this.guildLanguages = new Map();
  }

  setGuildLanguage(guildId, lang) {
    if (translations[lang]) {
      this.guildLanguages.set(guildId, lang);
    }
  }

  getGuildLanguage(guildId) {
    return this.guildLanguages.get(guildId) || this.defaultLang;
  }

  t(key, params = {}, lang = this.defaultLang) {
    const dict = translations[lang] || translations['en'];
    let str = dict[key] || translations['en'][key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return str;
  }
}

module.exports = new I18nEngine();
