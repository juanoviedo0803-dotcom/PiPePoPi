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

    // Opción A: Activar el item que tienes en la mano
bot.activateItem()

// Opción B: Usar el item en un bloque o entidad específica
bot.useOn(target) // target debe ser un bloque o entidad válida
setTimeout(() => { bot.rightclick() }, 7000) // Intenta usar brújula a los 7s
  bot.on("windowOpen", (window) => {
    console.log("📦 Menú abierto")

    setTimeout(() => {
      const item = window.slots.find(
        (i) => i && i.name.includes("minecraft:iron_axe")
      )

      if (item) {
        const slot = window.slots.indexOf(item)
        console.log(`Hacha encontrado en slot ${slot}, seleccionando...`)

        bot.clickWindow(slot, 0, 0)
          .then(() => {
            console.log("✅ Modo seleccionado")
          })
          .catch((err) => {
            console.log("❌ Error al hacer click:", err.message)
          })

      } else {
        console.log("⚠️ No se encontró ningún pico en el menú")
      }
    }, 1500)
  })

  bot.on("end", () => {
    console.log("❌ Bot desconectado")
    console.log(`🔄 Reconectando en ${reconnectDelay / 1000}s...`)

    setTimeout(() => {
      createBot()
    }, reconnectDelay)

    // aumentar delay progresivamente (máx 60s)
    reconnectDelay = Math.min(reconnectDelay + 5000, 60000)
  })

  bot.on("error", (err) => {
    console.log("⚠️ Error:", err.message)
  })
}

// iniciar bot
createBot()

// mantener proceso vivo (Railway)
setInterval(() => {
  // keep alive sin spam
}, 30000)
