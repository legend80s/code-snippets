import React from 'react'
import { FormattedMessage as FormattedMessageCore } from 'dumi'

// 虽然未安装但是引入的是类型，运行时被擦除故可以安全使用
import type { Props } from 'react-intl/src/components/message'
import type { EN_US } from '@/locales/en-US'
import type { ZH_CN } from '@/locales/zh-CN'
import { messages } from '@/locales'
import { useIntl as useIntlCore, createIntlCache } from 'dumi'
import { createIntl } from 'react-intl'

export { IntlProvider } from 'dumi'

/**
 * 不推荐使用 dumi 或 react-intl 对应方法，请使用本文件导出的方法。
 *
 * 建议优先使用该方法，然后是 `FormattedMessage`。
 *
 * 因为入参有提示 & 返回值也能精确显示对应的翻译文案
 * @example
 * const t = createFormatMessage(intl)
 * const title = t('forbidden.title')
 */
export function createMessageFormatter(intl: IIntlShape) {
  return function <ID extends IKeys>(id: ID, props?: IProps): ITranslatedText<ID> {
    const { values, ...rest } = props ?? {}
    // @ts-expect-error
    return intl.formatMessage({ id, ...rest }, values)
  }
}

/**
 * 不推荐使用 dumi 或 react-intl 对应方法，请使用本文件导出的方法。
 *
 * 因为对 id 自动纠错。详见 `ForbiddenPage/index.tsx`
 */
export const FormattedMessage = ({ id, ...rest }: PropsWithTypedKey) => {
  return (
    <FormattedMessageCore
      id={id}
      {...rest}
    />
  )
}

/**
 *
 * 不推荐使用 dumi 或 react-intl 对应方法，请使用本文件导出的方法。
 *
 * 功能没有变化，做了类型优化。
 */
export const useIntl: () => Omit<IIntlShape, 'formatMessage'> & {
  formatMessage: (props: PropsWithTypedKey) => string
} = useIntlCore

type IIntlShape = ReturnType<typeof useIntlCore>

type ITranslatedText<ID extends IKeys> = (typeof ZH_CN)[ID]
type IProps = Omit<Parameters<IFormatMessage>[0], 'id'> & { values: Parameters<IFormatMessage>[1] }
type IFormatMessage = ReturnType<typeof useIntlCore>['formatMessage']

export function getMessages(locale: ISupportedLocale) {
  return messages[locale]
}

type IKeys = keyof typeof EN_US | keyof typeof ZH_CN
type PropsWithTypedKey = Omit<Props, 'id'> & {
  id: IKeys
}

export type ISupportedLocale = 'en-US' | 'zh-CN'

/**
 * Imperative API 非组件内使用。
 * @param locale
 * @returns
 *
 * @example
 * const t = createTranslator('en-US')
 * const title = t('foo.bar')
 */
export function createTranslator(locale: ISupportedLocale = 'zh-CN') {
  // This is optional but highly recommended
  // since it prevents memory leak

  const cache = createIntlCache()

  const intl = createIntl(
    {
      locale,
      messages: getMessages(locale),
    },
    cache,
  )

  return function t<ID extends IKeys>(id: ID, props?: IProps): ITranslatedText<ID> {
    // @ts-expect-error
    return intl.formatMessage({ id, ...props })
  }
}
