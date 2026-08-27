const mineflayer = require("mineflayer")

let reconnectDelay = 10000 // empieza en 10s

// Prevención de crashes globales (Node.js)
process.on('unhandledRejection', (reason) => {
  console.error('❌ Promise no manejada:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err.message)
})

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9",
    auth: 'offline'  // ← CRÍTICO para servidores cracked como supercraft.es
  })

  bot.on("login", () => {
    console.log("✅ Bot conectado al servidor")
    reconnectDelay = 10000 // resetear delay cuando conecta bien
  })

  bot.on("spawn", async () => {
    console.log("🎮 Bot apareció en el mundo")

    // Enviar login después de 3 segundos
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)

    // Usar RELOJ después de 10 segundos (tiempo suficiente para login + spawn)
    setTimeout(async () => {
      try {
        // Buscar RELOJ en el inventario (clock, NO compass)
        const clockId = bot.registry.itemsByName.clock?.id
        if (!clockId) {
          console.log("⚠️ No se encontró ID de reloj en el registro")
          return
        }

        const clock = bot.inventory.findInventoryItem(clockId)
        
        if (clock) {
          // Equipar reloj en la mano
          await bot.equip(clock, 'hand')
          console.log("🕐 Reloj equipado")
          
          // Activar item (equivalente a right-click)
          bot.activateItem()
          console.log("✨ Reloj activado")
        } else {
          console.log("⚠️ No tienes reloj en el inventario")
        }
      } catch (e) {
        console.log("⚠️ Error al usar el reloj:", e.message)
      }
    }, 10000)
  })

  bot.on("windowOpen", async (window) => {
    console.log("📦 Menú abierto -
