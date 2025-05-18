const WebSocket = require("ws");

function setupDeliveryWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🟢 Delivery client connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        // افحص نوع الرسالة وحدث الموقع أو أي شيء ثاني حسب نوع البيانات
        if (data.type === "updateLocation") {
          console.log(
            `Received location update: lat=${data.latitude}, lng=${data.longitude}`
          );

          // هنا ممكن تحفظ التحديث في قاعدة البيانات لو حابب
          // أو تبعث البيانات لكل المتصلين (broadcast)
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "locationUpdated", ...data }));
            }
          });
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    });

    ws.on("close", () => {
      console.log("🔴 Delivery client disconnected");
    });
  });

  return wss;
}

module.exports = setupDeliveryWebSocket;
