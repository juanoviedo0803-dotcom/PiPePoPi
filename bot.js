const mineflayer = require("mineflayer")

let reconnectDelay = 10000

function createBot() {
  const bot = mineflayer.createBot({
    host: "mc.supercraft.fun",
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

    // 🔑 Login
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)

    // 🕐 PASO 1: Click derecho en la brújula (slot 0 del hotbar)
    setTimeout(async () => {
      try {
        console.log("🕐 Buscando minecraft:clock en hotbar...")
        
        // Verificar qué hay en el hotbar (slots 36-44 del inventario)
        const hotbar = bot.inventory.slots.slice(36, 45)
        console.log("🎒 Hotbar:", hotbar.map(i => i?.name || "vacío"))
        
        // Buscar la brújula/reloj en el hotbar
        const clock = hotbar.find(item => 
          item && (item.name === "clock" || item.name === "compass" || item.type === 345)
        )

        if (clock) {
          console.log(`🕐 Brújula encontrada en slot ${clock.slot - 36} del hotbar`)
          
          // ✅ Seleccionar el slot en la hotbar
          bot.setQuickBarSlot(clock.slot - 36) // Convertir slot interno a hotbar (0-8)
          
          // ✅ Click derecho con el ítem equipado (activateItem = right-click)
          setTimeout(() => {
            bot.activateItem()
            console.log("🖱️ Click derecho en brújula realizado - esperando menú...")
          }, 300)
        } else {
          console.log("⚠️ No se encontró brújula/reloj en el hotbar")
        }
      } catch (e) {
        console.log("⚠️ Error al usar brújula:", e.message)
      }
    }, 7000)
  })

  // 📦 PASO 2: Cuando se abre el menú - Click derecho en el hacha
  bot.on("windowOpen", (window) => {
    console.log(`📦 Menú abierto: "${window.title}"`)
    
    // 🔍 DEBUG: Ver todos los ítems del menú
    console.log("🔎 Ítems en el menú:")
    window.slots.forEach((item, index) => {
      if (item) {
        console.log(`  [${item.slot}] ${item.name} | type:${item.type} | "${item.displayName}"`)
      }
    })

    setTimeout(() => {
      // Buscar el hacha de hierro
      const ironAxe = window.slots.find(item => 
        item && (
          item.name === "iron_axe" || 
          item.type === 258 ||
          item.displayName?.toLowerCase().includes("box") ||
          item.displayName?.toLowerCase().includes("pvp")
        )
      )

      if (ironAxe) {
        console.log(`✅ Hacha encontrada: slot ${ironAxe.slot} | "${ironAxe.displayName}"`)
        
        // ✅ CLICK DERECHO en el hacha (mouseButton = 1 es right-click)
        bot.clickWindow(ironAxe.slot, 1, 0)
          .then(() => {
            console.log("🖱️ Click derecho en BoxPvP realizado - esperando teletransporte...")
            // Cerrar ventana después
            setTimeout(() => {
              if (bot.currentWindow) bot.closeWindow(bot.currentWindow)
            }, 1000)
          })
          .catch(err => {
            console.log("❌ Error al hacer click derecho:", err.message)
          })
      } else {
        console.log("⚠️ No se encontró minecraft:iron_axe en el menú")
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
  
  // 📨 Mensajes del servidor
  bot.on('messagestr', (msg) => {
    if (msg.includes("Box") || msg.includes("PvP") || msg.includes("teleport")) {
      console.log(`📨 Servidor: ${msg}`)
    }
  })
}

createBot()

// Keep-alive para Railway
setInterval(() => {}, 30000)
