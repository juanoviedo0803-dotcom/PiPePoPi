const mineflayer = require("mineflayer")

let reconnectDelay = 10000 // empieza en 10s

function createBot() {
  const bot = mineflayer.createBot({
    host: "supercraft.es",
    port: 25565,
    username: "PiPePoPi",
    version: "1.8.9"
  })

  bot.on("login", () => {
    console.log("✅ Bot conectado al servidor")
    reconnectDelay = 10000 // resetear delay cuando conecta bien
  })

  bot.on("spawn", () => {
    console.log("🎮 Bot apareció en el mundo")

    setTimeout(() => {
      bot.chat("/login juan123")
      console.log("🔑 Enviando /login")
    }, 3000)


bot.on("windowOpen", async (window) => {
  console.log("📦 Menú abierto")

  try {
    // Esperar un poco para que los slots se carguen
    await new Promise(resolve => setTimeout(resolve, 500))

    // Buscar hacha de hierro por tipo (más fiable que name.includes)
    const axeItem = window.slots.find(slot => 
      slot && slot.name === "iron_axe" // o slot.type === ID_DEL_ITEM
    )

    if (axeItem) {
      console.log(`🪓 Hacha encontrada en slot ${axeItem.slot}`)
      
      // Hacer click para recoger el item del contenedor
      await bot.clickWindow(axeItem.slot, 0, 0)
      
      // Cerrar la ventana
      await bot.closeWindow(window)
      
      // Equipar el item en la mano (usa el item original de tu inventario, no el de la ventana)
      const itemInInventory = bot.inventory.slots.find(s => 
        s && s.name === "iron_axe" && s.slot >= 36 && s.slot <= 44 // hotbar
      )
      
      if (itemInInventory) {
        await bot.equip(itemInInventory, 'hand')
        console.log("✅ Hacha equipada en la mano")
      }
    } else {
      console.log("⚠️ No se encontró hacha en el menú")
      bot.closeWindow(window) // Siempre cerrar la ventana si no se encuentra nada
    }
  } catch (err) {
    console.error("❌ Error en windowOpen:", err.message)
    bot.closeWindow(window) // Asegurar cierre en caso de error
  }
})
