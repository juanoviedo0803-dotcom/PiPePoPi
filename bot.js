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

    // 🔑 Login
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)

    // 🕐 PASO 1: Buscar reloj y hacer click derecho
    setTimeout(async () => {
      try {
        console.log("🔍 Buscando minecraft:clock en el inventario...")
        
        // 🔎 Buscar el reloj en TODO el inventario (incluye hotbar)
        const clock = bot.inventory.items().find(item => 
          item && item.name === "clock" // Nombre exacto en mineflayer 1.8.9
        )

        if (clock) {
          console.log(`⏰ Reloj encontrado: slot ${clock.slot}`)
          
          // ✅ Si el reloj está en la hotbar (slots 36-44), seleccionarlo
          if (clock.slot >= 36 && clock.slot <= 44) {
            const hotbarSlot = clock.slot - 36 // Convertir a 0-8
            bot.setQuickBarSlot(hotbarSlot)
            console.log(`🎯 Reloj seleccionado en hotbar slot ${hotbarSlot}`)
            
            // ✅ Click derecho = activateItem()
            setTimeout(() => {
              bot.activateItem()
              console.log("🖱️ Click derecho en reloj realizado - esperando menú...")
            }, 300)
          } else {
            // Si no está en hotbar, equiparlo primero
            await bot.equip(clock, 'hand')
            bot.activateItem()
            console.log("🖱️ Reloj equipado y activado - esperando menú...")
          }
        } else {
          console.log("⚠️ No se encontró minecraft:clock en el inventario")
          // 🔍 DEBUG: Mostrar qué hay en la hotbar
          const hotbar = bot.inventory.slots.slice(36, 45)
          console.log("🎒 Hotbar:", hotbar.map(i => i?.name || "vacío").join(" | "))
        }
      } catch (e) {
        console.log("⚠️ Error al usar el reloj:", e.message)
      }
    }, 7000)
  })

  // 📦 PASO 2: Menú abierto → Buscar hacha de hierro → Click derecho → BoxPvP
  bot.on("windowOpen", (window) => {
    console.log(`📦 Menú abierto: "${window.title}"`)
    
    // 🔍 DEBUG: Mostrar todos los ítems del menú
    console.log("🔎 Ítems disponibles:")
    window.slots.filter(i => i).forEach(item => {
      console.log(`  [${item.slot}] ${item.name} | "${item.displayName}"`)
    })

    setTimeout(() => {
      // ✅ Buscar el hacha de hierro por nombre exacto
      const ironAxe = window.slots.find(item => 
        item && item.name === "iron_axe"
      )

      if (ironAxe) {
        console.log(`🪓 Hacha encontrada: slot ${ironAxe.slot} | "${ironAxe.displayName}"`)
        
        // ✅ CLICK DERECHO: mouseButton = 1
        bot.clickWindow(ironAxe.slot, 1, 0)
          .then(() => {
            console.log("✅ Click derecho en BoxPvP realizado")
            console.log("🎉 Esperando teletransporte a BoxPvP...")
            
            // Cerrar ventana para evitar conflictos
            setTimeout(() => {
              if (bot.currentWindow) {
                bot.closeWindow(bot.currentWindow)
                console.log("🔒 Menú cerrado")
              }
            }, 1000)
          })
          .catch((err) => {
            console.log("❌ Error al hacer click en el hacha:", err.message)
          })
      } else {
        console.log("⚠️ No se encontró minecraft:iron_axe en el menú")
        
        // 💡 Buscar por displayName si el nombre no coincide
        const axeByDisplay = window.slots.find(i => 
          i?.displayName?.toLowerCase().includes("box") || 
          i?.displayName?.toLowerCase().includes("pvp")
        )
        if (axeByDisplay) {
          console.log(`💡 ¿Quizás es este? [${axeByDisplay.slot}] "${axeByDisplay.displayName}"`)
        }
      }
    }, 1500)
  })

  // 🎁 Bonus: Detectar cuando entra a BoxPvP
  bot.on('messagestr', (msg) => {
    const lower = msg.toLowerCase()
    if (lower.includes("box") && lower.includes("pvp")) {
      console.log(`🎯 ¡Éxito! Servidor: ${msg}`)
    }
    if (lower.includes("teleport") || lower.includes("join") || lower.includes("unido")) {
      console.log(`📨 ${msg}`)
    }
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
