export const WELCOME = `🤖 *Justo — Tu Asistente Laboral Inteligente*

Te ayudo a entender tus derechos laborales y calcular liquidaciones en Centroamérica y Latinoamérica.

*¿Qué puedo preguntarte?*
• Indemnización por despido o renuncia
• Aguinaldo, vacaciones y prestaciones
• Deducciones de seguridad social e impuestos
• Cálculo de liquidación laboral

*Comandos disponibles:*
/start — Ver este mensaje
/help — Ver todos los comandos
/pais — Cambiar país
/estimar — Estimado rápido de liquidación
/status — Ver configuración actual

*Ejemplos:*
"Me despidieron después de 5 años, gano C$12,000 al mes, ¿cuánto me toca?"
"¿Cómo se calcula el aguinaldo en Nicaragua?"

> Información general, no asesoría legal profesional.`

export const HELP = `📋 *Comandos disponibles*

/start — Mensaje de bienvenida
/help — Esta lista de comandos
/pais — Seleccionar país para consultas laborales
/estimar \\<salario\\> \\<años\\> — Estimado rápido
  Ejemplo: */estimar 12000 5*
/status — Ver país activo y versión del corpus

*Países disponibles:*
🇳🇮 Nicaragua • 🇬🇹 Guatemala • 🇸🇻 El Salvador
🇭🇳 Honduras • 🇨🇷 Costa Rica • 🇵🇦 Panamá
🇲🇽 México • 🇨🇴 Colombia • 🇵🇪 Perú
🇦🇷 Argentina • 🇨🇱 Chile`

export const PLACEHOLDER = "Justo está preparando tu respuesta... ✍️"

export const ERROR_MESSAGE = "Hubo un problema al procesar tu consulta. Intenta de nuevo en unos segundos."

export const COUNTRY_CHANGED = (name: string, flag: string) =>
  `${flag} País cambiado a *${name}*. Tus consultas ahora usan la legislación laboral de ${name}.`

export const STATUS = (
  country: string,
  law: string,
  version: string
) => `🤖 *Justo — Tu Asistente Laboral*

📍 *País activo:* ${country}
📜 *Marco legal:* ${law}
📚 *Versión del corpus:* ${version}
🔗 justo.stephanbarker.com

Usa /pais para cambiar de país.`

export const ESTIMATE_HELP =
  "Uso: /estimar <salario mensual> <años de antigüedad>\nEjemplo: */estimar 12000 5*"

export const COUNTRY_NAMES: Record<string, string> = {
  ni: "🇳🇮 Nicaragua",
  gt: "🇬🇹 Guatemala",
  sv: "🇸🇻 El Salvador",
  hn: "🇭🇳 Honduras",
  cr: "🇨🇷 Costa Rica",
  pa: "🇵🇦 Panamá",
  mx: "🇲🇽 México",
  co: "🇨🇴 Colombia",
  pe: "🇵🇪 Perú",
  ar: "🇦🇷 Argentina",
  cl: "🇨🇱 Chile",
}
