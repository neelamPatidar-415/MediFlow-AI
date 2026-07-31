const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage, AIMessage } = require("@langchain/core/messages");
const tools = require("./tools");

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    temperature: 0.5,
});

const agentGraph = new StateGraph(MessagesAnnotation)

    /*                                 TOOLS NODE                                 */

    .addNode("tools", async (state, config) => {

        const lastMessage = state.messages[state.messages.length - 1];

        if (!lastMessage?.tool_calls?.length) {
            return state;
        }

        const toolMessages = await Promise.all(

            lastMessage.tool_calls.map(async (call) => {

                const tool = tools[call.name];

                if (!tool) {
                    throw new Error(`Tool not found: ${call.name}`);
                }

                const result = await tool.func({
                    ...call.args,
                    token: config?.metadata?.token,
                });

                return new ToolMessage({
                    name: call.name,
                    content: String(result),
                });

            })

        );

        state.messages.push(...toolMessages);

        return state;

    })

    /*                                  CHAT NODE                                 */

    .addNode("chat", async (state) => {

        const response = await model
            .bindTools([
                tools.search_doctors,
                tools.book_appointment,
                tools.view_my_appointments,
            ])
            .invoke(state.messages);

        console.log("Model Response:", response);

        state.messages.push(
            new AIMessage({
                content: response.content ?? "",
                tool_calls: response.tool_calls ?? [],
            })
        );

        return state;

    })

    /*                              GRAPH CONNECTIONS                             */

    .addEdge("__start__", "chat")

    .addConditionalEdges("chat", (state) => {

        const lastMessage = state.messages[state.messages.length - 1];

        return lastMessage?.tool_calls?.length
            ? "tools"
            : "__end__";

    })

    .addEdge("tools", "chat");

module.exports = agentGraph.compile();