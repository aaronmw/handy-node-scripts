const fs = require('fs')

const componentsDirectory = `${__dirname}/../../../${process.env.HANDY_NODE_SCRIPTS_COMPONENTS_DIRECTORY}`

const indexFile = `${componentsDirectory}/index.ts`

// Get directories and files in the components directory
const filesAndDirectories = fs.readdirSync(componentsDirectory)

// Write them
fs.writeFileSync(
  indexFile,
  filesAndDirectories
    .reduce((acc, fileOrDirectory) => {
      if (['.DS_Store', 'index.ts'].includes(fileOrDirectory)) {
        return [...acc]
      }

      const componentName = fileOrDirectory.replace('.tsx', '')

      return [...acc, `export { ${componentName} } from './${componentName}'`]
    }, [])
    .join('\n'),
  {
    flag: 'w',
  },
)

console.log(`Rebuilt component index file at ${indexFile}`)
