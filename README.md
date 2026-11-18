# Hello MCP Server

A lightweight Model Context Protocol (MCP) server that exposes tools for finding contacts and updating their phone numbers.

The server uses Node.js standard input/output (`stdio`) transport and keeps contact data in memory. Changes apply only for the lifetime of the running process.

## Features

- Search contacts by all or part of their name.
- Update a contact's phone number.
- Validate phone numbers before saving them.
- Return the previous phone number when an update succeeds.

## Requirements

- Node.js 18 or newer
- npm

## Installation

```bash
npm install
```

## Running the server

Start the server directly with:

```bash
node src/server.mjs
```

The MCP server communicates over `stdio`, so it is typically started by an MCP-enabled client rather than from an interactive terminal.

## VS Code configuration

This repository includes `.vscode/mcp.json` with a local server configuration:

```json
{
  "servers": {
    "hello-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/src/server.mjs"]
    }
  }
}
```

After opening the repository in VS Code, start **hello-mcp** from the MCP servers view or through VS Code's MCP configuration controls.

## Available tools

### `find_contact`

Finds contacts whose names contain the supplied text.

**Input:**

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | At least 2 characters; matching is case-insensitive. |

**Example input:**

```json
{
  "name": "Alex"
}
```

**Example output:**

```json
[
  {
    "id": "1",
    "name": "Alex Morgan",
    "phone": "01632 960101"
  }
]
```

### `update_phone`

Updates a contact's phone number and reports the previous and new values.

**Input:**

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | The contact's unique ID. |
| `phone` | string | A 5–25 character value containing digits, spaces, `+`, `-`, `(`, or `)`. |

**Example input:**

```json
{
  "id": "1",
  "phone": "555-666-000"
}
```

**Example output:**

```json
{
  "id": "1",
  "before": "01632 960101",
  "after": "555-666-000"
}
```

## Initial contact data

| ID | Name | Phone |
| --- | --- | --- |
| `1` | Alex Morgan | `01632 960101` |
| `2` | Ali Khan | `01632 960102` |

Contact changes are not persisted to a database or file.

## Project structure

```text
.
├── .vscode/
│   └── mcp.json
├── src/
│   └── server.mjs
├── package.json
└── README.md
```

## Dependencies

- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) — MCP server implementation and stdio transport.
- [`zod`](https://github.com/colinhacks/zod) — Input schema and phone-number validation.

## License

No license has been specified for this project.
