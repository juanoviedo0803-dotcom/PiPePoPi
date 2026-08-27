const mineflayer = require("mineflayer")

let reconnectDelay = 10000

process.on('unhandledRejection', (r) => console.error('[UNHANDLED]', r))
process.on('uncaughtException', (e) => console.error('[CRASH]', e.message))

function createBot() {
  console.log("[DEBUG] Creando bot...")
  
  const bot = mineflayer.createBot({
    host: "mc.supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9",
    auth: 'offline',
    connectTimeout: 10000,
    checkTimeoutInterval: 10000
  })

  bot.on("connect", () => console.log("[1] TCP conectado"))
  bot.on("login", () => { console.log("[2] LOGIN exitoso"); reconnectDelay = 10000 })
  bot.on("session", () => console.log("[3] Sesion iniciada"))
  bot.on("spawn", async () => {
    console.log("[4] SPAWN - Bot en el mundo!")
    
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

  bot.on("windowOpen", async (window) => {
    console.log("[WINDOW] Menu abierto")
    const items = window.slots.filter(s => s).map(s => s.name)
    console.log("[WINDOW] Items:", items.join(", "))
    
    const axe = window.slots.find(s => s && s.name.includes("iron_axe"))
    if (axe) {
      await bot.clickWindow(axe.slot, 0, 0)
      await bot.closeWindow(window)
      const axeInv = bot.inventory.slots.find(s => s && s.name.includes("iron_axe"))
      if (axeInv) {
        await bot.equip(axeInv, 'hand')
        console.log("[AXE] Hacha equipada")
      }
    }
  })

  bot.on("kicked", (reason) => console.log("[KICKED]", reason))
  bot.on("end", (reason) => {
    console.log("[END] Desconectado:", reason || "sin razon")
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
