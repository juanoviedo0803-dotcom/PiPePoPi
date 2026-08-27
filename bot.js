const mineflayer = require("mineflayer")

let reconnectDelay = 10000

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9"
  })

  bot.on("login", () => {
    console.log("✅ Bot conectado al servidor")
    reconnectDelay = 10000
  })

  bot.on("spawn", () => {
    console.log("🎮 Bot apareció en el mundo")

    // 🔑 Login después de spawn
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)

    // 🧭 PASO 1: Seleccionar brújula del hotbar (slot 0) y activarla
    setTimeout(() => {
      try {
        console.log("🧭 Seleccionando brújula en hotbar slot 0...")
        
        // ✅ Seleccionar el slot 0 de la hotbar (0-8)
        bot.setQuickBarSlot(0)
        
        // ✅ Activar el ítem equipado (usar brújula)
        setTimeout(() => {
          bot.activateItem()
          console.log("✨ Brújula activada - esperando menú de modos...")
        }, 500) // Pequeña pausa para que el servidor registre el cambio de slot

      } catch (e) {
        console.log("⚠️ Error al usar brújula:", e.message)
      }
    }, 7000)
  })

  // 📦 PASO 2: Cuando se abre el menú de modos de juego
  bot.on("windowOpen", (window) => {
    console.log(`📦 Menú abierto: "${window.title}"`)
    
    // 🔍 DEBUG: Ver todos los ítems del menú (para identificar el slot del hacha)
    console.log("🔎 Ítems en el menú:")
    window.slots.forEach((item, index) => {
      if (item) {
        console.log(`  [${item.slot}] ${item.name} | type:${item.type} | "${item.displayName}"`)
      }
    })

    setTimeout(() => {
      // ✅ Buscar el hacha de hierro por nombre o tipo
      const ironAxe = window.slots.find(item => 
        item && (
          item.name === "iron_axe" || 
          item.type === 258 || // ID del iron_axe en 1.8.9
          item.displayName?.toLowerCase().includes("box") ||
          item.displayName?.toLowerCase().includes("pvp")
        )
      )

      if (ironAxe) {
        console.log(`✅ Hacha encontrada: slot ${ironAxe.slot} | "${ironAxe.displayName}"`)
        
        // ✅ Click en el ítem usando SU slot real (no indexOf)
        bot.clickWindow(ironAxe.slot, 0, 0)
          .then(() => {
            console.log("🎯 Click realizado en BoxPvP - esperando teletransporte...")
            // Cerrar ventana después de confirmar el click
            setTimeout(() => {
              if (bot.currentWindow) bot.closeWindow(bot.currentWindow)
            }, 1000)
          })
          .catch(err => {
            console.log("❌ Error al hacer click:", err.message)
          })
      } else {
        console.log("⚠️ No se encontró el hacha de hierro / BoxPvP")
        console.log("💡 Tip: Revisa los logs de arriba para ver el nombre exacto del ítem")
      }
    }, 1500) // Esperar a que el menú se renderice completamente
  })

  bot.on("end", () => {
    console.log("❌ Bot desconectado")
    console.log(`🔄 Reconectando en ${reconnectDelay / 1000}s...`)
    setTimeout(() => createBot(), reconnectDelay)
    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })

  bot.on("error", (err) => {
    console.log("⚠️ Error:", err.message)
  })
  
  // 🎁 Bonus: Escuchar mensajes del servidor para debug
  bot.on('messagestr', (msg) => {
    if (msg.includes("Box") || msg.includes("PvP") || msg.includes("teleport")) {
      console.log(`📨 Servidor: ${msg}`)
    }
  })
}

createBot()

// Keep-alive para Railway
setInterval(() => {}, 30000)
