const mineflayer = require("mineflayer")

let reconnectDelay = 10000

process.on('unhandledRejection', (reason) => {
  console.error('[ERROR] Promise:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Exception:', err.message)
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
    console.log("[LOGIN] Conectado")
    reconnectDelay = 10000
  })

  bot.on("spawn", async () => {
    console.log("[SPAWN] En el mundo")

    // === PASO 1: Login del servidor ===
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("[ACTION] /login enviado")
    }, 3000)

    // === PASO 2: Usar el RELOJ ===
    setTimeout(async () => {
      console.log("[CLOCK] Buscando reloj...")
      
      // Buscar por múltiples nombres posibles
      const clockNames = ['clock', 'minecraft:clock']
      let clock = null
      
      for (const name of clockNames) {
        const id = bot.registry.itemsByName[name]?.id
        if (id) {
          clock = bot.inventory.findInventoryItem(id)
          if (clock) break
        }
      }
      
      if (clock) {
        try {
          await bot.equip(clock, 'hand')
          bot.activateItem()
          console.log("[CLOCK] Reloj usado correctamente")
        } catch (e) {
          console.log("[CLOCK] Error:", e.message)
        }
      } else {
        console.log("[CLOCK] No hay reloj en inventario. Items:", 
          bot.inventory.slots.filter(s => s).map(s => s.name).join(", "))
      }
    }, 10000)

    // === PASO 3: ABRIR MENÚ Y SELECCIONAR HACHA ===
    // Esto es CLAVE: muchos servidores NO abren el menú automáticamente
    setTimeout(() => {
      console.log("[MENU] Intentando abrir menú de selección...")
      
      // PRUEBA ESTOS COMANDOS (descomenta el que funcione en tu servidor):
      // bot.chat("/menu")
      // bot.chat("/selector") 
      // bot.chat("/kit")
      // bot.chat("/classes")
      // bot.chat("/select")
      
      // Si ninguno funciona, el menú podría abrirse al:
      // - Right-clickear un NPC específico
      // - Entrar a una zona concreta
      // - Esperar un evento del servidor
      
    }, 15000)
  })

  // === EVENTO: Cuando se abre CUALQUIER ventana ===
  bot.on("windowOpen", async (window) => {
    console.log("[WINDOW] Abierta - Tipo:", window.type, "Titulo:", window.title || "sin titulo")
    
    // Listar todos los items para debug
    const items = window.slots.filter(s => s).map(s => `${s.name}[${s.slot}]`)
    console.log("[WINDOW] Items:", items.join(", ") || "VACIO")

    try {
      await new Promise(r => setTimeout(r, 500))

      // Buscar hacha con múltiples nombres posibles
      const axeNames = ['iron_axe', 'minecraft:iron_axe']
      let axeItem = null
      
      for (const name of axeNames) {
        axeItem = window.slots.find(slot => slot && slot.name === name)
        if (axeItem) break
      }

      if (axeItem) {
        console.log("[AXE] Encontrada en slot", axeItem.slot)
        
        await bot.clickWindow(axeItem.slot, 0, 0)
        await bot.closeWindow(window)
        
        await new Promise(r => setTimeout(r, 300))
        
        // Buscar en inventario y equipar
        const axeInInv = bot.inventory.slots.find(s => 
          s && (s.name === 'iron_axe' || s.name === 'minecraft:iron_axe')
        )
        
        if (axeInInv) {
          await bot.equip(axeInInv, 'hand')
          console.log("[AXE] Equipada exitosamente")
        } else {
          console.log("[AXE] No aparecio en inventario tras click")
        }
      } else {
        console.log("[AXE] No hay iron_axe en esta ventana")
        await bot.closeWindow(window)
      }
    } catch (err) {
      console.error("[AXE] Error:", err.message)
      try { await bot.closeWindow(window) } catch {}
    }
  })

  bot.on("end", () => {
    console.log("[END] Desconectado")
    setTimeout(() => createBot(), reconnectDelay)
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

console.log("[START] Bot iniciado")
createBot()

setInterval(() => {}, 30000)
