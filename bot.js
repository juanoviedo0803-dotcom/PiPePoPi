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
                                                                                      const mineflayer = require("mineflayer")

let reconnectDelay = 10000

process.on('unhandledRejection', (reason) => console.error('[UNHANDLED]', reason))
process.on('uncaughtException', (err) => console.error('[CRASH]', err.message))

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9",
    auth: 'offline',
    // Opciones adicionales para servidores con plugins
    checkTimeoutInterval: 30000,
    connectTimeout: 30000
  })

  // === TODOS LOS EVENTOS POSIBLES PARA DEBUG ===
  bot.on("connect", () => console.log("[1] TCP conectado"))
  bot.on("login", () => console.log("[2] Login exitoso"))
  bot.on("session", () => console.log("[3] Sesión iniciada"))
  bot.on("physicsTick", () => console.log("[4] Física activa")) // Si llega aquí, el bot está en el mundo
  
  bot.on("spawn", async () => {
    console.log("[5] SPAWN - Bot en el mundo!")
    console.log("    Posición:", bot.entity.position.toString())
    
    // === PASO A: Login del servidor (3s) ===
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("[A] Comando /login enviado")
    }, 3000)
    
    // === PASO B: Esperar a que el login se procese + usar reloj (15s total) ===
    setTimeout(async () => {
      console.log("[B] Buscando reloj...")
      const clockId = bot.registry.itemsByName.clock?.id
      const clock = clockId ? bot.inventory.findInventoryItem(clockId) : null
      
      if (clock) {
        try {
          await bot.equip(clock, 'hand')
          bot.activateItem()
          console.log("[B] Reloj usado OK")
        } catch(e) { console.log("[B] Error reloj:", e.message) }
      } else {
        console.log("[B] Sin reloj. Inventario:", 
          bot.inventory.slots.filter(s=>s).map(s=>s.name).slice(0,10).join(",") || "VACIO")
      }
    }, 15000)
    
    // === PASO C: Intentar abrir menú de hacha (20s) ===
    setTimeout(() => {
      console.log("[C] Intentando abrir menú de selección...")
      // PRUEBA ESTOS (descomenta el que funcione):
      // bot.chat("/selector")
      // bot.chat("/kit")
      // bot.chat("/classes") 
      // bot.chat("/menu")
      // bot.chat("/select")
      // bot.chat("/hacha")
    }, 20000)
  })

  // === Cuando se abre CUALQUIER ventana ===
  bot.on("windowOpen", async (window) => {
    console.log("[WINDOW] Tipo:", window.type, "Titulo:", window.title || "N/A")
    const items = window.slots.filter(s=>s).map(s => `${s.name}[${s.slot}]`)
    console.log("[WINDOW] Items:", items.join(",") || "(vacío)")
    
    // Buscar hacha con nombres alternativos
    const axe = window.slots.find(s => s && (s.name === "iron_axe" || s.name === "minecraft:iron_axe"))
    
    if (axe) {
      console.log("[AXE] Encontrada slot", axe.slot)
      try {
        await bot.clickWindow(axe.slot, 0, 0)
        await bot.closeWindow(window)
        await new Promise(r => setTimeout(r, 300))
        const axeInv = bot.inventory.slots.find(s => s && (s.name === "iron_axe" || s.name === "minecraft:iron_axe"))
        if (axeInv) {
          await bot.equip(axeInv, 'hand')
          console.log("[AXE] Equipada OK")
        }
      } catch(e) { console.log("[AXE] Error:", e.message) }
    } else {
      console.log("[AXE] No encontrada en esta ventana")
      await bot.closeWindow(window)
    }
  })

  bot.on("kicked", (reason) => console.log("[KICKED]", reason))
  bot.on("end", (reason) => {
    console.log("[END] Desconectado:", reason || "sin razón")
    console.log("[RECONNECT] En", reconnectDelay/1000, "s")
    setTimeout(() => createBot(), reconnectDelay)
    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })
  bot.on("error", (err) => console.log("[ERROR]", err.message))
  bot.on("chat", (u, m) => { if(u !== bot.username) console.log("[CHAT]", u+":"+m) })
  
  // === DEBUG DE PAQUETES (descomenta si necesitas ver TODO) ===
  // bot._client.on('packet', (data, meta) => {
  //   if(['login', 'spawn_position', 'playerlist_item', 'open_window'].includes(meta.name)) {
  //     console.log('[PACKET]', meta.name)
  //   }
  // })
}

console.log("[START] Bot iniciado - supercraft.es:25565")
createBot()
setInterval(() => {}, 30000)
