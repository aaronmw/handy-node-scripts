# Installation

```
npm install -D aaronmw/handy-node-scripts
```

## `package.json`

Adjust `COMPONENTS_DIR` as necessary:

```json
{
  "scripts": {
    "generate-contentful-types": "npm explore handy-node-scripts -- npm run generate-contentful-types",
    "generate": "COMPONENTS_DIR=src/components npm explore handy-node-scripts -- npm run generate",
    "rebuild-component-index": "COMPONENTS_DIR=src/components npm explore handy-node-scripts -- npm run rebuild-component-index",
    "upgrade-react-19": "npm install --save-exact react@rc react-dom@rc babel-plugin-react-compiler@latest --force"
  }
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
