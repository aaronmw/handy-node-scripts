const prettier = require('prettier')
const enquirer = require('enquirer')
const fs = require('fs')
const invariant = require('tiny-invariant')

invariant(
  process.env.COMPONENTS_DIR,
  'Environment variable not found: COMPONENTS_DIR',
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
    { name: 'isClientComponent', message: 'Client Component', initial: 'N' },
    { name: 'isSingleFileComponent', message: 'Single File', initial: 'Y' },
  ],
})

prompt.run().then(generateComponent).catch(console.error)

async function generateComponent({
  componentName,
  tagName,
  acceptsChildren,
  isClientComponent,
  isPolymorphic,
  isSingleFileComponent,
}) {
  const newComponentFileContents = await newComponentTemplate({
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

async function newComponentTemplate({
  componentName,
  tagName,
  acceptsChildren,
  isClientComponent,
  isPolymorphic,
}) {
  const lines = []

  if (isClientComponent) {
    lines.push(`'use client'`)
  }

  lines.push(
    `import { ComponentProps${
      isPolymorphic ? `, ElementType` : ''
    } } from 'react'`,
  )
  lines.push(`import { twMerge } from 'tailwind-merge'`)

  if (isPolymorphic) {
    lines.push(`
      type ${componentName}Props<E extends ElementType = '${tagName}'> = ${
        acceptsChildren
          ? `ComponentProps<E>`
          : `Omit<ComponentProps<E>, 'children'>`
      } & {
        as?: E
      }`)
  } else {
    lines.push(
      `
        interface ${componentName}Props extends ${
          acceptsChildren
            ? `ComponentProps<'${tagName}'>`
            : `Omit<ComponentProps<'${tagName}'>, 'children'>`
        } {}
      `,
    )
  }

  lines.push(
    `
      export function ${componentName}${
        isPolymorphic ? `<E extends ElementType = '${tagName}'>` : ''
      }({
          ${acceptsChildren ? 'children,' : ''}
          ${isPolymorphic ? 'as,' : ''}
          className,
          ...otherProps
        }: ${componentName}Props${isPolymorphic ? '<E>' : ''}) {
    `,
  )

  if (isPolymorphic) {
    lines.push(`const Component = String(as || '${tagName}') as ElementType`)
  }

  lines.push(
    `
        return (
          <${isPolymorphic ? 'Component' : tagName}
            className={twMerge(\`\`, className)}
            {...otherProps}
          >
            ${acceptsChildren ? '{children}' : ''}
          </${isPolymorphic ? 'Component' : tagName}>
        )
      }
    `,
  )

  return prettier.format(lines.join('\n'), { parser: 'typescript' })
}
