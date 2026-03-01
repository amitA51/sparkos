# Animations in Remotion

## Core Concepts

1. **useCurrentFrame**: The heartbeat of Remotion. Returns the current frame number.
2. **interpolate**: Map the frame numbers to values (opacity, scale, x/y).
3. **spring**: Create physics-based animations.

## Interpolation
Always use `extrapolate: 'clamp'` to prevent values from going out of bounds before/after the animation.

```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: 'clamp',
});
```

## Spring Animations
Springs feel more natural than linear interpolation.

```tsx
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const frame = useCurrentFrame();
const {fps} = useVideoConfig();

const scale = spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: {
    damping: 200,
  },
});
```

## Sequencing
Use `<Sequence>` to shift animations in the timeline.

```tsx
<Sequence from={30}>
  <Title /> {/* Starts at 1 second (30 frames) */}
</Sequence>
```
