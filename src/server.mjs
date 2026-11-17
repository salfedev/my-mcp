import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const contacts = [
    {id: "1", name: "Alex Morgan", phone: "01632 960101"},
    {id: "2", name: "Ali Khan", phone: "01632 960102"},
];

const server = new McpServer({name: "hello-mcp", version: "0.1.0"})

server.registerTool(
    "find_contact",
    {
        description: "find a contact by all or part of their name",
        inputSchema: {name: z.string().min(2)}
    },
    async ({name}) => {
        const hits = contacts.filter((c) =>
            c.name.toLowerCase().includes(name.toLowerCase())
        )
        return {content: [{type: "text", text: JSON.stringify(hits)}]}
    }
)

server.registerTool(
    "update_phone",
    {
        description: "Change a contact's phone number. Returns the old number so the change can be undone.",
        inputSchema: {
            id: z.string(),
            phone: z.string().regex(/^[0-9 +()-]{5,25}$/, "Digits, spaces, - and + and brackets only")
        }
    },
    async ({ id, phone}) => {
        const contact = contacts.find((c) => c.id === id)
        if (!contact) return {isError: true, content: [{type: "text", text: `No contact found for id: ${id}`}]}
        const before = contact.phone;
        contact.phone = phone;
        return {content: [{type: "text", text: JSON.stringify({id, before, after: contact.phone})}]}
    }
)


await server.connect(new StdioServerTransport())
console.error("hello-mcp ready")