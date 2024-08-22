const enquirer = require('enquirer')
const fs = require('fs')
const invariant = require('tiny-invariant')

invariant(
  process.env.COMPONENTS_DIR,
  'Environment variable not found: COMPONENTS_DIR'
)

const { Form } = enquirer

const componentsDirectory = `${__dirname}/../../../${process.env.COMPONENTS_DIR}`

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information',
  choices: [
    {
      name: 'componentName',
      message: 'Component Name',
      initial: 'NewComponent',
    },
    { name: 'tagName', message: 'Wrapping Element:', initial: 'div' },
    { name: 'isPolymorphic', message: 'Polymorphic', initial: 'N' },
    { name: 'acceptsChildren', message: 'Children', initial: 'N' },
    { name: 'isClientComponent', message: 'Client Component', initial: 'Y' },
    { name: 'isSingleFileComponent', message: 'Single File', initial: 'Y' },
  ],
})

prompt.run().then(generateComponent).catch(console.error)

function generateComponent({
  componentName,
  tagName,
  acceptsChildren,
  isClientComponent,
  isPolymorphic,
  isSingleFileComponent,
}) {
  const newComponentFileContents = buildNewComponentFileContents({
    componentName,
    tagName,
    acceptsChildren: acceptsChildren.toUpperCase() === 'Y',
    isClientComponent: isClientComponent.toUpperCase() === 'Y',
    isPolymorphic: isPolymorphic.toUpperCase() === 'Y',
  })

  if (isSingleFileComponent.toUpperCase() === 'N') {
    const componentDirectory = `${componentsDirectory}/${componentName}`

    // Make sure components directory exists
    fs.mkdirSync(componentsDirectory, { recursive: true })

    // Create the new component directory and copy the template files
    fs.cpSync(`${__dirname}/templates/NewComponent`, componentDirectory, {
      recursive: true,
    })

    const newComponentFile = `${componentDirectory}/NewComponent.tsx`

    fs.writeFileSync(newComponentFile, newComponentFileContents)

    fs.writeFileSync(
      `${componentDirectory}/index.ts`,
      `export { ${componentName} } from './${componentName}'\n`,
    )

    fs.renameSync(
      newComponentFile,
      `${componentDirectory}/${componentName}.tsx`,
    )
  } else {
    const newComponentFile = `${componentsDirectory}/${componentName}.tsx`

    fs.cpSync(`${__dirname}/templates/NewComponent.tsx`, newComponentFile)

    fs.writeFileSync(newComponentFile, newComponentFileContents)
  }

  console.log(`Component ${componentName} created at ${componentsDirectory}`)
}

function buildNewComponentFileContents({
  componentName,
  tagName,
  acceptsChildren,
  isClientComponent,
  isPolymorphic,
}) {
  return `${
    isClientComponent
      ? `'use client'

`
      : ''
  }import { ComponentProps${isPolymorphic ? `, ElementType` : ''} } from 'react'
import { twMerge } from 'tailwind-merge'

${
  isPolymorphic
    ? `type ${componentName}Props<T extends ElementType = '${tagName}'> = ${acceptsChildren ? `ComponentProps<T>` : `Omit<ComponentProps<T>, 'children'>`} & {
  as?: T
}`
    : `interface ${componentName}Props extends ${acceptsChildren ? `ComponentProps<'${tagName}'>` : `Omit<ComponentProps<'${tagName}'>, 'children'>`} {}`
}

export function ${componentName}${isPolymorphic ? `<T extends ElementType = '${tagName}'>` : ''}({
  ${acceptsChildren ? 'children,' : ''}
  ${isPolymorphic ? 'as,' : ''}
  className,
  ...otherProps
}: ${componentName}Props${isPolymorphic ? '<T>' : ''}) {
  ${
    isPolymorphic
      ? `const Component = String(as || '${tagName}') as ElementType
`
      : ''
  }
  return (
    <${isPolymorphic ? 'Component' : tagName}
      className={twMerge(
        \`\`,
        className,
      )}
      {...otherProps}
    >
      ${acceptsChildren ? '{children}' : ''}
    </${isPolymorphic ? 'Component' : tagName}>
  )
}
`
}
