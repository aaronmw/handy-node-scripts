# Installation

```
npm install -D aaronmw/handy-node-scripts
```

## `package.json`

Adjust `COMPONENTS_DIR` as necessary:

```json
{
  "scripts": {
    "generate": "node ./src/generate.js && npm run rebuild-component-index",
    "generate-contentful-types": "./src/generate-contentful-types.sh",
    "rebuild-component-index": "node ./src/rebuild-component-index.js",
    "upgrade-react-19": "npm install --save-exact react@rc react-dom@rc babel-plugin-react-compiler@latest --force"
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

## Generating Contentful Types

Make sure you have your `.env.local` configured, then

```
> npm run generate-contentful-types
```
