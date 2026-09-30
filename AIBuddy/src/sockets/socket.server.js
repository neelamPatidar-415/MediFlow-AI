const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const agent = require("../agents/agents");

function initializeSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    console.log("Socket server initialized");

    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        const { token } = cookies ? cookie.parse(cookies) : {};

        if (!token) {
            return next(new Error("Authentication error: No token"));
        }

        try {
            socket.user = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.token = token;

            console.log("Middleware reached");

            next();
        } catch {
            next(
                new Error(
                    "Authentication error: Invalid token"
                )
            );
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        console.log(
            "Authenticated user:",
            socket.user.email
        );

        socket.isBusy = false;

        socket.on("message", async (message) => {
            console.log("Received user query:", message);

            if (socket.isBusy) {
                return socket.emit("agent-response", {
                    error:
                        "Please wait while MediFlow AI is processing your previous request.",
                });
            }

            socket.isBusy = true;

            try {
                const response = await agent.invoke(
                    {
                        messages: [
                            {
                                role: "user",
                                content: message,
                            },
                        ],
                    },
                    {
                        metadata: {
                            token: socket.token,
                        },
                    }
                );

                const messages = response.messages;

                const finalMessage = [...messages]
                    .reverse()
                    .find(
                        (msg) =>
                            msg.constructor?.name ===
                                "AIMessage" &&
                            typeof msg.content === "string" &&
                            msg.content.trim().length > 0
                    );

                socket.emit("agent-response", {
                    content:
                        finalMessage?.content ||
                        "Sorry, I couldn't generate a response.",
                });
            } catch (err) {
                console.error(
                    "MediFlow AI Error:",
                    err
                );

                socket.emit("agent-response", {
                    error:
                        "MediFlow AI is currently unavailable. Please try again later.",
                });
            } finally {
                socket.isBusy = false;
            }
        });

        socket.on("disconnect", () => {
            console.log(
                "User disconnected:",
                socket.id
            );
        });
    });
}

module.exports = initializeSocketServer;