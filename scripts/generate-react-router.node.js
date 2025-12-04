// @ts-nocheck
// 本文件编译时运行。将从 config/routes.js 自动生成 src/react-router-generated.ts 文件
// 本文件为什么不用 ts 因为 ci 里面的 Node.js 低于 22.18.0

import { watch, writeFileSync } from "node:fs"
import { pathToFileURL } from "node:url"

/**
 *
 * @param {*} proLayoutRoute
 * @returns {string}
 * Add `export` is for testing
 *
 */
export function convertProLayoutRoutesToReactRoutes(proLayoutRoute) {
  // 组件映射表
  const imports = new Set()

  // 递归处理路由，收集组件和构建新结构
  function processRoute(route) {
    const newRoute = {}

    // 处理路径
    if (route.path) {
      newRoute.path = route.path
    } else if (route.component === "./404") {
      newRoute.path = "*"
    }

    // 处理组件
    if (route.component) {
      let componentName
      let importPath

      /**
       * 清除 404 等非有效变量名
       * @param {string} name
       */
      const replaceInvalidName = name =>
        name.replace("404", "NotFound").replace(".tsx", "")

      // ../layouts/ and ../components/
      if (route.component.startsWith("../layouts/")) {
        componentName = route.component
          .replace("../layouts/", "")
          .split("/")
          .pop()
        importPath = "@/layouts/" + componentName
      } else if (route.component.startsWith("../components/")) {
        componentName = route.component
          .replace("../components/", "")
          .split("/")
          .pop()
        importPath =
          "@/components/" + route.component.replace("../components/", "")
      } else if (route.component.startsWith("./")) {
        const pathParts = route.component.replace("./", "").split("/")
        componentName = pathParts
          .map(part =>
            part
              .split("-")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(""),
          )
          .join("")
        importPath = "@/pages/" + route.component.replace("./", "")
      }

      if (componentName) {
        componentName = replaceInvalidName(componentName)
        imports.add(`import ${componentName} from '${importPath}';`)

        newRoute.Component = componentName
      }
    }

    // 处理子路由
    if (route.routes && route.routes.length > 0) {
      newRoute.children = route.routes.map(childRoute =>
        processRoute(childRoute, route.path || ""),
      )
    }

    return newRoute
  }

  // 处理根路由
  const reactRoutes = processRoute(proLayoutRoute)

  // 构建导入语句
  const importStatements = Array.from(imports).join("\n")

  const disclaimer = `
// 为避免同一份路由需写两遍，故自动根据 antd pro-layout 的 route 生成 react-router 的路由配置。
// 该文件由 scripts/generate-react-router.node.js 自动生成请勿修改 🚫！！！
// 新增或修改路由，应修改 config/routes.js ✅，脚本会自动监听变化重新生成。
`.trim()

  const routes = JSON.stringify(reactRoutes, null, 2).replace(
    /"Component": "(\w+)"/g,
    '"Component": $1',
  )

  // 构建完整的字符串
  return (
    `${disclaimer}

import type { RouteObject as ReactRouteObject } from 'react-router';\n\n` +
    `${importStatements}\n\n` +
    `export const reactRouter: ReactRouteObject = ` +
    `${routes}`
  )
}

// if is called by main module
const isMainModule = import.meta.url.startsWith(
  pathToFileURL(process.argv[1]).href,
)

function debounce(fn, delay = 0) {
  let timer = null

  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 *
 * @param {{ src: string; dest: string }} option
 */
async function generate({ src, dest }) {
  const now = new Date().toLocaleString()
  const label = `✅ [INFO] ${now} generate-react-router [${dest}]`
  console.time(label)
  const routes = (await import(src)).default
  // console.log('routes:', routes);
  const compiledReactRouters = convertProLayoutRoutesToReactRoutes(routes[0])
  // console.log('reactRouters:', compiledReactRouters);

  // write to src/react-router-generated.ts
  writeFileSync(dest, compiledReactRouters)
  console.timeEnd(label)
}

async function main() {
  const src = `../config/routes.ts`
  const dest = `src/react-router-generated.ts`
  await generate({ src, dest })

  const needWatch = process.argv.includes("--watch")
  if (!needWatch) return

  console.info(`👀 Watching ${src}...`)

  // use nodejs fs watch to watch config/routes.ts and re-generate react-router-generated.ts
  const debouncedRegenerate = debounce(generate, 32)

  watch(src.replace("../", "./"), () => {
    debouncedRegenerate({ src: `${src}?t=${Date.now()}`, dest })
  })
}

if (isMainModule) {
  main()
}
