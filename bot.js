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
    auth: 'offline'
  })

  bot.on("login", () => {
    console.log("[LOGIN] Conectado")
    reconnectDelay = 10000
  })

  bot.on("spawn", async () => {
    console.log("[SPAWN] En el mundo")

    // Paso 1: Login del servidor
    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("[ACTION] /login enviado")
    }, 3000)

    // Paso 2: Usar reloj (12 segundos después del spawn)
    setTimeout(async () => {
      console.log("[CLOCK] Buscando reloj...")
      const clockId = bot.registry.itemsByName.clock?.id
      if (!clockId) {
        console.log("[CLOCK] No se encontro ID de reloj")
        return
      }
      const clock = bot.inventory.findInventoryItem(clockId)
      if (clock) {
        try {
          await bot.equip(clock, 'hand')
          bot.activateItem()
          console.log("[CLOCK] Reloj usado")
        } catch (e) {
          console.log("[CLOCK] Error:", e.message)
        }
      } else {
        console.log("[CLOCK] Sin reloj. Items:", 
          bot.inventory.slots.filter(s => s).map(s => s.name).slice(0, 8).join(", ") || "VACIO")
      }
    }, 12000)

    // Paso 3: Intentar abrir menú de hacha (18 segundos)
    setTimeout(() => {
      console.log("[MENU] Abriendo menu de selección...")
      // CAMBIA ESTO por el comando real de tu servidor:
      // bot.chat("/selector")
      // bot.chat("/kit")
      // bot.chat("/classes")
      // bot.chat("/menu")
    }, 18000)
  })

  // Cuando se abre cualquier ventana
  bot.on("windowOpen", async (window) => {
    console.log("[WINDOW] Abierta - Tipo:", window.type, "Titulo:", window.title || "N/A")
    const items = window.slots.filter(s => s).map(s => s.name + "[slot:" + s.slot + "]")
    console.log("[WINDOW] Items:", items.join(", ") || "(vacío)")

    try {
      await new Promise(r => setTimeout(r, 500))

      // Buscar hacha con nombres posibles
      const axe = window.slots.find(slot => 
        slot && (slot.name === "iron_axe" || slot.name === "minecraft:iron_axe")
      )

      if (axe) {
        console.log("[AXE] Encontrada en slot", axe.slot)
