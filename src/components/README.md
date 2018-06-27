# 自定义组件重要说明

1. 容器盒模型默认为 `content-box` , 需手动设置为 `border-box`
2. 渲染时最终会生成标签包裹 `template` 下子内容
3. 使用 `:host` 选择器选择组件本身元素
