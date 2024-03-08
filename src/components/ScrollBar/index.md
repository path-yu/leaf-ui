### ScrollBar 滚动条

```tsx
import React from 'react';
import { ScrollBar } from 'leaf-react-ui';
export default () => {
  return (
    <ScrollBar style={{ maxHeight: '120px' }}>
      众芳摇落独暄妍，占尽风情向小园。
      <br />
      疏影横斜水清浅，暗香浮动月黄昏。
      <br />
      霜禽欲下先偷眼，粉蝶如知合断魂。
      <br />
      幸有微吟可相狎，不须檀板共金樽。
      <br />
      剪绡零碎点酥乾，向背稀稠画亦难。
      <br />
      日薄从甘春至晚，霜深应怯夜来寒。
      <br />
      澄鲜只共邻僧惜，冷落犹嫌俗客看。
      <br />
      忆着江南旧行路，酒旗斜拂堕吟鞍。
      <br />
    </ScrollBar>
  );
};
```

### 水平滚动

```tsx
import React from 'react';
import { ScrollBar } from 'leaf-react-ui';
export default () => {
  return (
    <ScrollBar horizontal>
      <div style={{ whiteSpace: 'nowrap', padding: '10px' }}>
        要坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，着力推动高质量发展，全面落实疫情要防住、经济要稳住、发展要安全的要求，巩固经济回升向好趋势，着力稳就业稳物价，保持经济运行在合理区间，力争实现最好结果。
      </div>
    </ScrollBar>
  );
};
```

### 触发方式

`trigger="none"` 会让滚动条一直显示，`trigger="hover"` 会让滚动条在鼠标悬浮的时候显示。

```tsx
import React, { useRef } from 'react';
import { ScrollBar, Button } from 'leaf-react-ui';

export default () => {
  const scrollBarRef = useRef();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <ScrollBar
        ref={scrollBarRef}
        style={{ maxHeight: '120px', maxWidth: '300px' }}
        trigger="none"
      >
        众芳摇落独暄妍，占尽风情向小园。
        <br />
        疏影横斜水清浅，暗香浮动月黄昏。
        <br />
        霜禽欲下先偷眼，粉蝶如知合断魂。
        <br />
        幸有微吟可相狎，不须檀板共金樽。
        <br />
        剪绡零碎点酥乾，向背稀稠画亦难。
        <br />
        日薄从甘春至晚，霜深应怯夜来寒。
        <br />
        澄鲜只共邻僧惜，冷落犹嫌俗客看。
        <br />
        忆着江南旧行路，酒旗斜拂堕吟鞍。
        <br />
      </ScrollBar>
      <ScrollBar
        style={{ maxHeight: '120px', maxWidth: '300px', marginLeft: '30px' }}
        trigger="scroll"
      >
        众芳摇落独暄妍，占尽风情向小园。
        <br />
        疏影横斜水清浅，暗香浮动月黄昏。
        <br />
        霜禽欲下先偷眼，粉蝶如知合断魂。
        <br />
        幸有微吟可相狎，不须檀板共金樽。
        <br />
        剪绡零碎点酥乾，向背稀稠画亦难。
        <br />
        日薄从甘春至晚，霜深应怯夜来寒。
        <br />
        澄鲜只共邻僧惜，冷落犹嫌俗客看。
        <br />
        忆着江南旧行路，酒旗斜拂堕吟鞍。
        <br />
      </ScrollBar>
      <Button
        style={{ height: '40px' }}
        onClick={() => {
          scrollBarRef.current.scrollTo({ top: 100, behavior: 'smooth' }, true).then(() => {
            console.log('success');
          });
        }}
      >
        change Scroll
      </Button>
    </div>
  );
};
```

<API src="ScrollBar.tsx">

### Method

| 名称 | 描述 | 类型 |
| --- | --- | --- |
| scrollTo | 移动容器滚动到指定位置 | `(options: { left?: number; top?: number; behavior?: ScrollBehavior }, listener?: boolean,) => null &#124; Promise<unknown>` |
