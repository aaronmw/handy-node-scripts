const fs = require('fs')
const invariant = require('tiny-invariant')

invariant(
  process.env.COMPONENTS_DIR,
  'Environment variable not found: COMPONENTS_DIR'
)

const componentsDirectory = `${__dirname}/../../../${process.env.COMPONENTS_DIR}`

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
