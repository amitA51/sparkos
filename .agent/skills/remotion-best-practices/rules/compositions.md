# Compositions in Remotion

## Best Practices

1. **Root Configuration**: Use the `<Composition />` component in your `Root.tsx`.
2. **Dimensions**: Stick to standard 16:9 (1920x1080) or 9:16 (1080x1920) for consistency.
3. **FPS**: Standardize on 30 or 60 fps. 30 is usually sufficient for UI demos.
4. **Duration**: Use `durationInFrames`. Calculate it based on seconds * fps.

```tsx
import {Composition} from 'remotion';
import {MyVideo} from './MyVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={30 * 10} // 10 seconds
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Hello World',
          color: '#0b84f3'
        }}
      />
    </>
  );
};
```

## Dynamic Metadata
Use `calculateMetadata` to set duration based on props.

```tsx
<Composition
  // ...
  calculateMetadata={({props}) => {
    return {
      durationInFrames: props.durationInSeconds * 30,
    };
  }}
/>
```
