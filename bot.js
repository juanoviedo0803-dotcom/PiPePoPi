const mineflayer = require("mineflayer")

let reconnectDelay = 10000

// Prevención de crashes globales
process.on('unhandledRejection', (reason) => {
  console.error('[ERROR] Promise no manejada:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Error no capturado:', err.message)
})

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9",
    auth: 'offline'
  })

  bot.on("login", () => {
    console.log("[OK] Bot conectado al servidor")
    reconnectDelay = 10000
  })

  bot.on("spawn", async () => {
    console.log("[OK] Bot apareció en el mundo")

    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("[INFO] Enviando /login")
    }, 3000)

    setTimeout(async () => {
      try {
        const clockId = bot.registry.itemsByName.clock?.id
        if (!clockId) {
          console.log("[WARN] No se encontro ID de reloj")
          return
        }

        const clock = bot.inventory.findInventoryItem(clockId)
        
        if (clock) {
          await bot.equip(clock, 'hand')
          console.log("[OK] Reloj equipado")
          bot.activateItem()
          console.log("[OK] Reloj activado")
        } else {
          console.log("[WARN] No tienes reloj en el inventario")
        }
      } catch (e) {
        console.log("[ERROR] Error al usar el reloj:", e.message)
      }
    }, 10000)
  })

  bot.on("windowOpen", async (window) => {
    console.log("[INFO] Menu abierto - Tipo:", window.type)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const axeItem = window.slots.find(slot => 
        slot && slot.name === "iron_axe"
      )

      if (axeItem) {
        console.log("[OK] Hacha encontrada en slot", axeItem.slot)
        
        await bot.clickWindow(axeItem.slot, 0, 0)
        console.log("[OK] Click en ventana realizado")
        
        await bot.closeWindow(window)
        console.log("[OK] Ventana cerrada")
        
        const axeInHotbar = bot.inventory.slots.find(slot => 
          slot && slot.name === "iron_axe" && slot.slot >= 36 && slot.slot <= 44
        )
        
        if (axeInHotbar) {
          await bot.equip(axeInHotbar, 'hand')
          console.log("[OK] Hacha equipada en la mano")
        } else {
          const axeAnywhere = bot.inventory.findInventoryItem(
            bot.registry.itemsByName.iron_axe?.id
          )
          if (axeAnywhere) {
            await bot.equip(axeAnywhere, 'hand')
            console.log("[OK] Hacha equipada desde inventario")
          } else {
            console.log("[WARN] Hacha no encontrada para equipar")
          }
        }
      } else {
        console.log("[WARN] No se encontro iron_axe en el menu")
        await bot.closeWindow(window)
      }
    } catch (err) {
      console.error("[ERROR] Error en windowOpen:", err.message)
      try {
        await bot.closeWindow(window)
      } catch (closeErr) {}
    }
  })

  bot.on("end", () => {
    console.log("[DISCONNECT] Bot desconectado")
    console.log("[RECONNECT] Reconectando en", reconnectDelay / 1000, "s...")

    setTimeout(() => {
      createBot()
    }, reconnectDelay)

    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })

  bot.on("error", (err) => {
    console.log("[ERROR]", err.message)
  })

  bot.on("chat", (username, message) => {
    if (username === bot.username) return
    console.log("[CHAT]", username + ":", message)
  })
}

console.log("[START] Iniciando bot PiPePoPi en supercraft.es...")
createBot()

// Keep-alive para Railway
setInterval(() => {}, 30000)
