import highlight from 'highlight.js/lib/core'

import 'highlight.js/styles/tokyo-night-dark.css'

// 导入需要的语言高亮
import rust from 'highlight.js/lib/languages/rust'
import javascript from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'

// https://github.com/highlightjs/highlight.js/issues/2467
import html from 'highlight.js/lib/languages/xml'

highlight.registerLanguage('rust', rust)
highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('java', java)
highlight.registerLanguage('html', html)

// This will scope the "global" language stack used by auto-detection (which is used by highlightBlock when the language is not specified).
highlight.configure({ languages: ['python', 'java', 'rust', 'js', 'html', 'css', 'bash'] })

export { highlight as hljs }
