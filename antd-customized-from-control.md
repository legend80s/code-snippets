```jsx
import styles from './index.less';

const { Tooltip } = antd;

export class PreviewSwitch extends React.Component {
  toggleStatus = () => {
    const { onChange, checked } = this.props;

    if (onChange) {
      onChange(!checked);
    }
  };

  render() {
    const { checked } = this.props;

    console.log('this.props:', this.props);

    return (
      <Tooltip title={<span className={styles.fontXs}>Tooltip...</span>}>
        <i
          onClick={this.toggleStatus}
          className={['iconfont', styles.preview, checked ? styles.previewSwitchActive : '']}>
          {checked}
        </i>
      </Tooltip>
    );
  }
}

// PreviewSwitch.propTypes = {
//   checked: PropTypes.any,
//   onChange: PropTypes.func,
// };
```

```jsx
<FormItem
  {...formItemLayout}
  label={null}
>
  {getFieldDecorator('enablePreviewMode', {
    valuePropName: 'checked',
  })(
    <PreviewSwitch />
  )}
</FormItem>
```
