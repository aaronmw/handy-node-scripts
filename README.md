# Installation

```
npm install -D git+ssh://git@github.com/aaronmw/handy-node-scripts.git
```

## `package.json`

Adjust `COMPONENTS_DIR` as necessary:

```json
{
  "scripts": {
    "generate": "COMPONENTS_DIR=src/components npm explore handy-node-scripts -- npm run generate",
    "rebuild-component-index": "COMPONENTS_DIR=src/components npm explore handy-node-scripts -- npm run rebuild-component-index"
  },
}
```


# Usage

## Generating New Components

```
> npm run generate
```

## Rebuilding the Component Index

```
> npm run rebuild-component-index
```