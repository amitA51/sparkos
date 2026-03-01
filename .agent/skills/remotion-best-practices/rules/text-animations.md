# Text Animations in Remotion

## Staggered Text
Animating words or characters one by one.

1. Split text into words/characters.
2. Map over them.
3. Use `delay` based on index.

```tsx
const title = "Hello World";
return (
  <h1 style={{display: 'flex', gap: '10px'}}>
    {title.split(' ').map((word, i) => {
      const delay = i * 5;
      const scale = spring({
        frame: frame - delay,
        fps,
        from: 0,
        to: 1,
      });
      return <span style={{transform: `scale(${scale})`}}>{word}</span>;
    })}
  </h1>
);
```

## Typography
- Use `loadFont` from `@remotion/google-fonts` to ensure fonts are ready before rendering.
- Avoid system fonts if rendering in the cloud; they might vary.
