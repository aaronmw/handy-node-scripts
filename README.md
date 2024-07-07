# Installation

```
npm install -D git+ssh://git@github.com/aaronmw/handy-node-scripts.git
```

## `package.json`

```json
{
  "scripts": {
    "generate": "npm explore handy-node-scripts -- npm run generate && npm run rebuild-component-index",
    "rebuild-component-index": "npm explore handy-node-scripts -- npm run rebuild-component-index"
  },
}
```

## `.env.local`

```
HANDY_NODE_SCRIPTS_COMPONENTS_DIRECTORY=src/components
```


# Usage

## Generating New Components

```
> npm run generate
```

## Rebuilding the Componen Index

```
> npm run rebuild-component-index
```