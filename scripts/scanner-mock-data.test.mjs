// @ts-check
import { deepStrictEqual } from "node:assert"
import { it } from "node:test"
import { parseDiffContent } from "./scanner-mock-data.mjs"

it("parseDiffContent: empty diff", () => {
  const diffContent = ""

  const violations = parseDiffContent(diffContent)
  deepStrictEqual(violations, [])
})

it("parseDiffContent: has 1 mock data", () => {
  const diffContent = `diff --git a/src/services/model-foo.ts b/src/services/model-foo.ts
index 4315cb03..a5c7f336 100644
--- a/src/services/model-foo.ts
+++ b/src/services/model-foo.ts
@@ -44,55 +44,55 @@ export const lightModelRsService = {
    * 查询推理服务
    */
   async detailLightModel(data: IDetailLightModelReqData): Promise<Data<IDetailLightModelRespData>> {
-    // return {
-    //   code: 0,
-    //   success: true,
-    //   data: {
-    //     description: '',
-    //     gmtCreate: '',
-    //     gmtModified: '',
-    //   },
+    return {
+      code: 0,
+      success: true,
+      data: {
+        description: '',
+        gmtCreate: '',
+        gmtModified: '',
+      },

-    //   errorMsg: 'success',
-    // };
+      errorMsg: 'success',
+    };
     return request<Data<IDetailLightModelRespData>>(\`\${lightModelRsService.prefix}/detail\`, {
       method: 'POST',
       data,
`

  const expected = [
    {
      file: "src/services/model-foo.ts",
      lines: [
        "+      code: 0,",
        "+      success: true,",
        "+      data: {",
        "+      errorMsg: 'success',",
      ],
    },
  ]
  const actual = parseDiffContent(diffContent)

  deepStrictEqual(expected, actual)
})

it("parseDiffContent: has 1 mock data 2", () => {
  const diffContent = `diff --git a/src/services/model-foo.ts b/src/services/model-foo.ts
index 4315cb03..a5c7f336 100644
--- a/src/services/model-foo.ts
+++ b/src/services/model-foo.ts
@@ -44,55 +44,55 @@ export const lightModelRsService = {
    * 查询推理服务
    */
   async detailLightModel(data: IDetailLightModelReqData): Promise<Data<IDetailLightModelRespData>> {
+    return {
+      code: 0,
+      success: true,
+      data: {},
+      errorMsg: 'success',
+    };
`

  const expected = [
    {
      file: "src/services/model-foo.ts",
      lines: [
        "+      code: 0,",
        "+      success: true,",
        "+      data: {},",
        "+      errorMsg: 'success',",
      ],
    },
  ]
  const actual = parseDiffContent(diffContent)

  deepStrictEqual(expected, actual)
})

it("parseDiffContent: has 1 mock data in format 2", () => {
  const diffContent = `diff --git a/src/services/model-foo.ts b/src/services/model-foo.ts
index 4315cb03..a5c7f336 100644
--- a/src/services/model-foo.ts
+++ b/src/services/model-foo.ts
@@ -44,55 +44,55 @@ export const lightModelRsService = {
    * 查询推理服务
    */
   async detailLightModel(data: IDetailLightModelReqData): Promise<Data<IDetailLightModelRespData>> {
+    return {
+      code: 0,
+      data: {},
+      message: 'success',
+    };
`

  const expected = [
    {
      file: "src/services/model-foo.ts",
      lines: [
        "+      code: 0,",
        "+      data: {},",
        "+      message: 'success',",
      ],
    },
  ]
  const actual = parseDiffContent(diffContent)

  deepStrictEqual(expected, actual)
})

it("commented mock data should not collected", () => {
  const diffContent = `diff --git a/src/services/model-foo.ts b/src/services/model-foo.ts
index 42e1deaf..81b49f13 100644
--- a/src/services/model-foo.ts
+++ b/src/services/model-foo.ts
@@ -44,12 +44,12 @@ export const lightModelRsService = {
    * 查询推理服务
    */
   async detailLightModel(data: IDetailLightModelReqData): Promise<Data<IDetailLightModelRespData>> {
-    return {
-      code: 0,
-      success: false,
-      data: {},
-      errorMsg: 'success',
-    };
+    // return {
+    //   code: 0,
+    //   success: false,
+    //   data: {},
+    //   errorMsg: 'success',
+    // };
     // return {
     //   code: 0,
     //   success: true,
`

  deepStrictEqual([], parseDiffContent(diffContent))
})

it("parseDiffContent: has 1 inline mock data", () => {
  const diffContent = `diff --git a/src/services/model-foo.ts b/src/services/model-foo.ts
index 42e1deaf..407786cf 100644
--- a/src/services/model-foo.ts
+++ b/src/services/model-foo.ts
@@ -44,12 +44,7 @@ export const lightModelRsService = {
    * 查询推理服务
    */
   async detailLightModel(data: IDetailLightModelReqData): Promise<Data<IDetailLightModelRespData>> {
-    return {
-      code: 0,
-      success: false,
-      data: {},
-      errorMsg: 'success',
-    };
+    return { code: 0, success: false, data: {}, errorMsg: 'success' };
     // return {
     //   code: 0,
     //   success: true,
`
  const actual = parseDiffContent(diffContent)

  deepStrictEqual(actual, [
    {
      file: "src/services/model-foo.ts",
      lines: [
        "+    return { code: 0, success: false, data: {}, errorMsg: 'success' };",
      ],
    },
  ])
})

it("parseDiffContent: mock 数据不应该收集", () => {
  const diffContent = `diff --git a/src/services/reasoning-service-permissions.ts b/src/services/reasoning-service-permissions.ts
index 0000000..0000000 100644
--- a/src/services/reasoning-service-permissions.ts
+++ b/src/services/reasoning-service-permissions.ts
@@ -1,10 +1,10 @@
 import { reasoningServicePermissions } from './reasoning-service-permissions';

-// Mock 数据
-// const mockData = {
-//   success: true,
-//   code: 200,
-//   data: {
-//     permissions: [],
-//   },
-// };
+// Mock 数据
+// const mockData = {
+//   success: true,
+//   code: 200,
+//   data: {
+//     permissions: [],
+//   },
+// };
`

  const violations = parseDiffContent(diffContent)
  deepStrictEqual(violations, [])
})
