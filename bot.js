const mineflayer = require("mineflayer")

let reconnectDelay = 10000
let authDone = false

process.on('unhandledRejection', (r) => console.error('[UNHANDLED]', r))
process.on('uncaughtException', (e) => console.error('[CRASH]', e.message))

function createBot() {
  authDone = false
  console.log("[DEBUG] Creando bot...")
  
  const bot = mineflayer.createBot({
    host: "mc.supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9",
    auth: 'offline',
    connectTimeout: 30000,
    checkTimeoutInterval: 30000
  })

  bot.on("connect", () => console.log("[1] TCP conectado"))
  bot.on("login", () => { console.log("[2] LOGIN exitoso"); reconnectDelay = 10000 })
  bot.on("session", () => console.log("[3] Sesion iniciada"))
  
  bot.on("spawn", async () => {
    console.log("[4] SPAWN - Bot en el mundo!")
    
    if (!authDone) {
      console.log("[AUTH] Esperando verificacion anti-bot...")
      return
    }
    
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("[ACTION] /login enviado")
    }, 3000)
    
    setTimeout(async () => {
      const clock = bot.inventory.findInventoryItem(bot.registry.itemsByName.clock?.id)
      if (clock) {
        await bot.equip(clock, 'hand')
        bot.activateItem()
        console.log("[CLOCK] Reloj usado")
      } else {
        console.log("[CLOCK] Sin reloj")
      }
    }, 12000)
  })

  // === CLAVE: Cuando se abre el menu de verificacion ===
  bot.on("windowOpen", async (window) => {
    console.log("[WINDOW] Menu abierto - Tipo:", window.type, "Titulo:", window.title || "N/A")
    const items = window.slots.filter(s => s).map(s => s.name + "[slot:" + s.slot + "]")
    console.log("[WINDOW] Items:", items.join(", ") || "(vacio)")
    
    // Buscar boton de verificacion (puede ser papel, libro, o cualquier item)
    const authButton = window.slots.find(s => s && (
      s.name === "paper" || 
      s.name === "book" || 
      s.name === "stick" ||
      s.name === "iron_axe" ||
      s.displayName?.includes("Click") ||
      s.displayName?.includes("Verificar") ||
      s.displayName?.includes("Autorizar")
    ))
    
    if (authButton && !authDone) {
      console.log("[AUTH] Boton encontrado en slot", authButton.slot)
      try {
        await bot.clickWindow(authButton.slot, 0, 0)
        await new Promise(r => setTimeout(r, 500))
        await bot.closeWindow(window)
        authDone = true
        console.log("[AUTH] Verificacion completada!")
      } catch (e) {
        console.log("[AUTH] Error al hacer click:", e.message)
      }
    } else if (window.title && window.title.toLowerCase().includes("selector")) {
      // Si es el menu de seleccion de clases, buscar el hacha
      const axe = window.slots.find(s => s && s.name.includes("iron_axe"))
      if (axe) {
        console.log("[AXE] Hacha encontrada en slot", axe.slot)
        await bot.clickWindow(axe.slot, 0, 0)
        await bot.closeWindow(window)
        const axeInv = bot.inventory.slots.find(s => s && s.name.includes("iron_axe"))
        if (axeInv) {
          await bot.equip(axeInv, 'hand')
          console.log("[AXE] Hacha equipada")
        }
      }
    } else {
      await bot.closeWindow(window)
    }
  })

  bot.on("kicked", (reason) => {
    console.log("[KICKED] Expulsado:")
    console.log(JSON.stringify(reason, null, 2))
  })
  
  bot.on("end", (reason) => {
    console.log("[END] Desconectado:", reason || "sin razon")
    console.log("[RECONNECT] En", reconnectDelay/1000, "segundos")
    setTimeout(createBot, reconnectDelay)
    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })
  
  bot.on("error", (err) => console.log("[ERROR]", err.message))
  bot.on("chat", (u, m) => { if(u !== bot.username) console.log("[CHAT]", u+":"+m) })
}

console.log("[START] Bot iniciado - mc.supercraft.es:25565")
console.log("[START] Hora:", new Date().toLocaleString())
createBot()
setInterval(() => {}, 30000)
