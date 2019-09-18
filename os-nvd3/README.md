# os-nvd3 组件

## Why
1. 修复 angular-nvd3 bug：弹窗显示图表不全
2. 修复 angular-nvd3 bug：弹窗显示图表，弹窗消失后 tooltip 仍然遗留

## Features
1. 静态展示图表组件，不支持实时更新。需要实时更新请使用 angular-nvd3，若弹窗中显示请提 PR 或 issue

## Example
参见 [sine-cosine linechart](http://plnkr.co/edit/lBKFld?p=preview)

```html
<os-nvd3 options="experimentsSingleMetricsChartCtrl.options" data="experimentsSingleMetricsChartCtrl.data"></os-nvd3>
```
