const DeliveryAssignment = require("../models/DeliveryAssignment");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Volunteer = require("../models/Volunteer");
function setupDeliveryWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const token = req.url?.split("token=")[1];

    if (!token) {
      ws.close(4001, "No token provided");
      return;
    }
    

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded; 
      console.log("🟢 WebSocket connected for user:", decoded.email);
    } catch (err) {
      ws.close(4002, "Invalid token");
      return;
    }

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === "updateLocation") {
          const { delivery_id, latitude, longitude } = data;

          try {
            console.log("🔐 Extracting user ID from ws.user...");
            const user_id = ws.user.id;

            console.log("🔎 Finding volunteer with user_id:", user_id);
            const volunteer = await Volunteer.findOne({ where: { user_id } });

            if (!volunteer) {
              console.log("❌ Volunteer not found for user_id:", user_id);
              return ws.send(JSON.stringify({ error: "Volunteer not found" }));
            }

            console.log("📦 Attempting to update DeliveryAssignment...");
            const updated = await DeliveryAssignment.update(
              {
                current_latitude: latitude,
                current_longitude: longitude,
              },
              {
                where: {
                  id: delivery_id,
                  volunteer_id: volunteer.id,
                  status: "in_progress",
                },
              }
            );

            if (updated[0] === 0) {
              console.log("❌ Update failed. No rows updated.");
              return ws.send(
                JSON.stringify({
                  error: "Not authorized or delivery not found",
                })
              );
            }

            console.log(
              `✅ Location updated: delivery_id=${delivery_id}, lat=${latitude}, lng=${longitude}`
            );

            ws.send(
              JSON.stringify({
                type: "locationUpdated",
                delivery_id,
                latitude,
                longitude,
              })
            );
          } catch (error) {
            console.error("🔥 WebSocket location update error:", error);
            ws.send(JSON.stringify({ error: "Internal server error" }));
          }
        }
      } catch (err) {
        console.error("❌ Error:", err.message);
      }
    });

    ws.on("close", () => {
      console.log("🔴 WebSocket closed for user:", ws.user?.email);
    });
  });

  return wss;
}

module.exports = setupDeliveryWebSocket;
