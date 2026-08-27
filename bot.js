const mineflayer = require("mineflayer")

// ✅✅✅ AGREGA ESTO JUSTO DESPUÉS DE LOS REQUIRE ✅✅✅
const log = (msg) => {
  const timestamp = new Date().toISOString()
  const output = `[${timestamp}] ${msg}`
  console.log(output)
  console.error(output)        // Duplicar en stderr ayuda en Railway
  process.stdout.write(output + '\n') // Forzar flush inmediato
}
// ✅✅✅ FIN DEL CÓDIGO DE LOG ✅✅✅

let reconnectDelay = 10000

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,                                              
    username: "PiPePoPi",
    version: "1.8.9",
    auth: "offline"  // ✅ Importante para servidores cracked
  })

  // 🔥 Ahora usa log() en vez de console.log()
  bot.on("login", () => {
    log("✅ Bot conectado al servidor")  // ← Cambiado
    reconnectDelay = 10000
  })

  bot.on("spawn", () => {
    log("🎮 Bot apareció en el mundo")   // ← Cambiado

    setTimeout(() => {
      bot.chat("/login juan123")
      log("🔑 Enviando /login")          // ← Cambiado
    }, 3000)

    setTimeout(() => {
      try {
        log("🔍 Buscando minecraft:clock...")  // ← Cambiado
        
        // 🔎 Buscar reloj en inventario
        const clock = bot.inventory.items().find(item => 
          item && item.name === "clock"
        )

        if (clock) {
          log(`⏰ Reloj encontrado: slot ${clock.slot}`)  // ← Cambiado
          
          if (clock.slot >= 36 && clock.slot <= 44) {
            const hotbarSlot = clock.slot - 36
            bot.setQuickBarSlot(hotbarSlot)
            
            setTimeout(() => {
              bot.activateItem()
              log("🖱️ Click derecho en reloj realizado")  // ← Cambiado
            }, 300)
          }
        } else {
          log("⚠️ No se encontró minecraft:clock")  // ← Cambiado
          const hotbar = bot.inventory.slots.slice(36, 45)
          log(`🎒 Hotbar: ${hotbar.map(i => i?.name || "vacío").join(" | ")}`)  // ← Cambiado
        }
      } catch (e) {
        log("⚠️ Error al usar reloj: " + e.message)  // ← Cambiado
      }
    }, 7000)
  })

  bot.on("windowOpen", (window) => {
    log(`📦 Menú abierto: "${window.title}"`)  // ← Cambiado
    
    // 🔍 Debug: mostrar ítems del menú
    const items = window.slots.filter(i => i).map(i => `[${i.slot}]${i.name}`)
    log(`🔎 Ítems: ${items.join(", ")}`)  // ← Cambiado

    setTimeout(() => {
      const ironAxe = window.slots.find(item => 
        item && item.name === "iron_axe"
      )

      if (ironAxe) {
        log(`🪓 Hacha encontrada: slot ${ironAxe.slot}`)  // ← Cambiado
        
        // ✅ CLICK DERECHO: mouseButton = 1
        bot.clickWindow(ironAxe.slot, 1, 0)
          .then(() => {
            log("✅ Click derecho en BoxPvP realizado")  // ← Cambiado
            setTimeout(() => {
              if (bot.currentWindow) bot.closeWindow(bot.currentWindow)
            }, 1000)
          })
          .catch((err) => {
            log("❌ Error al hacer click: " + err.message)  // ← Cambiado
          })
      } else {
        log("⚠️ No se encontró minecraft:iron_axe")  // ← Cambiado
      }
    }, 1500)
  })

  // 💬 Mensajes del servidor (para debug)
  bot.on('messagestr', (msg) => {
    if (msg.toLowerCase().includes("box") || msg.toLowerCase().includes("pvp")) {
      log(`🎯 Servidor: ${msg}`)  // ← Cambiado
    }
  })

  bot.on("end", () => {
    log("❌ Bot desconectado")  // ← Cambiado
    log(`🔄 Reconectando en ${reconnectDelay / 1000}s...`)  // ← Cambiado
    setTimeout(() => createBot(), reconnectDelay)
    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })

  bot.on("error", (err) => {
    log("⚠️ Error: " + err.message)  // ← Cambiado
  })
}

// ✅ Heartbeat para Railway (mantiene el proceso "vivo")
setInterval(() => {
  log("💓 Heartbeat: bot alive")  // ← Cambiado
}, 10000)

// ✅ Manejar cierre de Railway
process.on('SIGTERM', () => {
  log('🛑 Cerrando bot...')  // ← Cambiado
  process.exit(0)
})

// Iniciar bot
createBot()

// Keep-alive extra para Railway
setInterval(() => {}, 30000)
