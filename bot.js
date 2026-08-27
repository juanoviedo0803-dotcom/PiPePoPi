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

  bot.on("spawn", async () => {
    console.log("🎮 Bot apareció en el mundo")

    // 🔑 Login
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)

    // 🧭 Usar brújula para abrir menú de modos
    setTimeout(async () => {
      try {
        console.log("🔍 Buscando brújula en inventario...")
        
        // Buscar la brújula en el inventario (type 345 = compass en 1.8.9)
        const compass = bot.inventory.items().find(item => 
          item && (item.name === "compass" || item.type === 345)
        )

        if (!compass) {
          console.log("⚠️ No se encontró brújula en el inventario")
          return
        }

        // Equipar la brújula en la mano principal
        await bot.equip(compass, 'hand')
        console.log("🧭 Brújula equipada")

        // Activar la brújula (esto debería abrir el menú)
        bot.activateItem()
        console.log("✨ Brújula activada - esperando menú...")

      } catch (e) {
        console.log("⚠️ Error al usar la brújula:", e.message)
      }
    }, 7000)
  })

  // 📦 Cuando se abre una ventana (menú de modos)
  bot.on("windowOpen", (window) => {
    console.log(`📦 Menú abierto: "${window.title}"`)
    
    // 🔍 DEBUG: Imprimir todos los ítems del menú (útil para encontrar el slot correcto)
    window.slots.forEach((slot, i) => {
      if (slot) console.log(`  [${i}] ${slot.name} (type: ${slot.type}) x${slot.count}`)
    })

    setTimeout(() => {
      // Buscar el hacha de hierro (BoxPvP)
      const ironAxe = window.slots.find(item => 
        item && (item.name === "iron_axe" || item.type === 258 || item.displayName?.includes("Box"))
      )

      if (ironAxe) {
        console.log(`✅ Hacha encontrada en slot ${ironAxe.slot}`)
        
        // ⚠️ IMPORTANTE: Usar item.slot, NO indexOf()
        bot.clickWindow(ironAxe.slot, 0, 0)
          .then(() => {
            console.log("🎯 Click realizado - esperando teletransporte...")
            // Cerrar ventana después de un momento
            setTimeout(() => bot.closeWindow(window), 1000)
          })
          .catch(err => {
            console.log("❌ Error al hacer click:", err.message)
          })
      } else {
        console.log("⚠️ No se encontró el hacha de hierro / BoxPvP en el menú")
      }
    }, 1500)
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
}

createBot()

// Keep-alive para Railway
setInterval(() => {}, 30000)
