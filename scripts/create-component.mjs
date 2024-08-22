import fs from 'node:fs'
import { parseArgs } from 'node:util'

const options = {
  help: {
    type: 'boolean',
    short: 'h',
    description: 'Show this help message',
    required: '×',
    default: false,
  },

  category: {
    type: 'string',
    short: 'c',
    description: '布局 | 登录 | 反馈 | 数据录入 | 数据展示',
    required: '×',
    default: '数据展示',
  },

  title: {
    type: 'string',
    short: 't',
    description: '简单描述组件功能',
    required: '×',
    default: 'TODO:请填充组件中文标题',
  },

  dev: {
    type: 'string',
    description: '组件生成后是否自动运行 devServer',
    required: '×',
    default: 'true',
  },

  template: {
    type: 'string',
    description: '复制哪一个已存在的组件模板',
    required: '×',
    default: 'LongText',
  },

  debug: {
    type: 'boolean',
    default: false,
    description: 'Print debug info',
    required: '×',
    short: 'd',
  },
}

function main() {
  const allArgs = process.argv.slice(2)

  // console.log('allArgs', allArgs)

  const [componentName, ...args] = allArgs
  const { values: parsed } = parseArgs({ args, options, allowPositionals: true })

  const { help, dev, ...opts } = parsed

  if (opts.debug) {
    console.log('[debug] args:', allArgs)
    console.log('[debug] parsed:', parsed)
  }

  if (help) {
    printHelp(options)

    return
  }
  try {
    create({ name: componentName, ...opts })

    const shouldStartDevServer = dev !== 'false'

    if (shouldStartDevServer) {
      startDevServer(componentName)
    }
  } catch (error) {
    console.error(error)

    // 删除文件是危险操作，先注释掉
    // fs.rmdirSync(`./src/${componentName}`, { recursive: true, force: true })

    process.exitCode = 1
  }
}

main()

function startDevServer() {
  // try {
  //   execSync(`npm run dev`, { stdio: 'inherit' })
  // } catch (error) {
  //   execSync(`npx dumi dev`, { stdio: 'inherit' })
  // }

  console.log('\nYou can start dev server now:')
  console.log(`\n$ yarn dev\n`)
}

function printHelp(options) {
  console.log('Usage: npm run new <ComponentName> [options]')
  console.log(
    'Example:\nnpm run new ResultModal -- --category=数据展示 --title=状态弹窗 --template=LongText',
  )

  console.log()
  console.log('Options:')
  console.table(options)
}

/**
 *
 * @param {{name: string; category: string; title: string; template: string; debug: boolean; }} opts
 */
function create({ name, category, title, template = 'LongText' }) {
  if (!name) {
    throw new Error('Please provide a component name')
  }

  const componentPath = `src/${name}`

  if (fs.existsSync(componentPath)) {
    throw new Error('Component already exists')
  }

  const templatePath = `src/${template}`

  const allowedTemplates = fs.readdirSync('src').filter((name) => /[A-Z]/.test(name[0]))

  if (!allowedTemplates.includes(template)) {
    console.error('Allowed templates:', allowedTemplates)
    throw new Error(`Template "${template}" does not exist`)
  }

  const label = `Create component "${name}" from template "${template}" success`
  console.time(label)

  fs.mkdirSync(componentPath)

  fs.cpSync(templatePath, componentPath, { recursive: true })

  // entries: [
  //   'src\\ResultModal\\index.md',
  //   'src\\ResultModal\\index.tsx',
  //   'src\\ResultModal\\demo\\basic.test.tsx',
  //   'src\\ResultModal\\demo\\basic.tsx',
  //   'src\\ResultModal\\demo\\middle.tsx'
  // ]
  const entries = fs.globSync(componentPath + '/**/*.*')

  for (const entry of entries) {
    const oldContent = fs.readFileSync(entry, 'utf-8')
    const newContent = oldContent.replace(new RegExp(template, 'g'), name)

    fs.writeFileSync(entry, newContent, 'utf-8')
  }

  const md = `src/${name}/index.md`
  const oldContent = fs.readFileSync(md, 'utf-8')
  const newContent = oldContent
    .replace(new RegExp(`group: [\\S]+`), `group: ${category}`)
    .replace(new RegExp(`${name} [\\S]+`, 'g'), `${name} ${title}`)

  fs.writeFileSync(md, newContent, 'utf-8')

  if (!fs.readFileSync('src/index.ts', 'utf-8').includes(name)) {
    fs.appendFileSync('src/index.ts', `export { ${name} } from './${name}'\n`)
  }

  console.timeEnd(label)
}
