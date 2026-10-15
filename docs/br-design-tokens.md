# br. Design Tokens v0.1

Sistema de tokens para la marca personal de Bernardo Reyes. Base de color lime `#CAFF00` y teal `#00312D`, tipografía Fira Sans (acentos) y Plus Jakarta Sans (cuerpo), modo light por default, iconos Gravity UI, motion basado en transitions.dev.

---

## 1. Arquitectura

Todo token pasa por tres capas. Ningún componente consume primitivos directamente.

```
primitive  →  mode  →  semantic
(valor crudo)   (cambia por modo)   (rol en UI / componente)
```

| Capa | Qué contiene | Modos | Ejemplo |
|---|---|---|---|
| **Primitive** | Valores crudos sin significado: rampas, escalas numéricas | Ninguno | `primitive.color.lime.200 = #CAFF00` |
| **Mode** | Alias que cambian según el contexto | Color: `light` (default) / `dark`. Tipo, spacing, iconos: `desktop` / `mobile`. Motion: `default` / `reduced` | `mode.color.accent.default → {primitive.color.lime.200}` |
| **Semantic** | Roles que consumen los componentes | Hereda del modo | `semantic.color.button.primary.bg → {mode.color.accent.default}` |

**Reglas**
- Primitive solo puede ser referenciado por Mode.
- Semantic solo puede referenciar Mode, nunca Primitive.
- Si un token no varía entre modos, igual pasa por Mode con el mismo valor en ambos. Así la estructura es predecible y agregar un modo nuevo no rompe nada.
- Formato de exportación: W3C Design Tokens (DTCG) JSON, para Figma Variables y Style Dictionary.

**Naming en código**: `--br-{capa?}-{categoría}-{rol}-{variante}-{estado}`. En CSS solo se exponen Mode y Semantic. Ej: `--br-color-button-primary-bg-hover`.

**Regla de 4**: todo lo espacial (spacing, sizing, radius, line height, iconos, breakpoints, layout) es múltiplo de 4. Excepciones documentadas: border width (1, 2) y `radius.full`.

---

## 2. Color

### 2.1 Primitive: rampas de marca

Generadas en OKLCH con luminosidad uniforme entre rampas. Paso `contraste` = mayor ratio contra blanco o negro.

| Step | lime | teal | neutral |
|---|---|---|---|
| 25 | | | `#FAFDFC` |
| 50 | `#F5FFE3` | `#ECFFFC` | `#F6FBFB` |
| 100 | `#E6FFB7` | `#DEFAF6` | `#EFF5F4` |
| 200 | **`#CAFF00`** base | `#CEEEEA` | `#DEE9E7` |
| 300 | `#BDE751` | `#B9DDD8` | `#CCD7D5` |
| 400 | `#A5D100` | `#9FC7C2` | `#B6C0BF` |
| 500 | `#8CB200` | `#80ACA6` | `#9AA4A2` |
| 600 | `#729100` | `#618D88` | `#7C8684` |
| 700 | `#587100` | `#446F6A` | `#5F6867` |
| 800 | `#405300` | `#2A534E` | `#434D4B` |
| 850 | | `#1D4541` | |
| 900 | `#293600` | `#133734` | `#2A3231` |
| 950 | `#192200` | **`#00312D`** base | `#18201F` |
| 1000 | | `#0B201E` | |

Pasos extra (`neutral.25`, `teal.850`, `teal.1000`) existen porque la interfaz los pidió: superficie de tarjeta clara, chip oscuro y canvas oscuro. Si se agregan más, revisar que no rompan la uniformidad de la rampa.

Notas medidas:
- `lime.300` sale con menos croma que 200 y 400 por el límite del gamut sRGB en ese hue. Evitarlo como hover.
- `teal.900` y `teal.950` están cerca (12.9 vs 14.2 contra blanco). Tratarlos como superficies distintas solo con borde.

### 2.2 Primitive: rampas de estado (propuesta)

Mismas luminosidades que las de marca. Verde movido a hue 150 para no competir con el lime (hue 124).

| Step | green | amber | red | blue |
|---|---|---|---|---|
| 50 | `#F0FFF2` | `#FFF9F1` | `#FFF8F8` | `#F6FBFF` |
| 100 | `#D9FFE0` | `#FFF1DF` | `#FFEFEE` | `#EBF5FF` |
| 200 | `#B5FAC2` | `#FFE1B9` | `#FFDDDA` | `#D4E9FF` |
| 300 | `#9AEAAB` | `#FFCA7F` | `#FFC3BD` | `#B4D8FF` |
| 400 | `#7BD690` | `#F2AF47` | `#FFA098` | `#89C3FF` |
| 500 | `#54BA6F` | `#D79100` | `#FF6B65` | `#53A6F8` |
| 600 | `#2A9B50` | `#AF7600` | `#DE4544` | `#2B87D9` |
| 700 | `#007B36` | `#895B00` | `#B92028` | `#0068B4` |
| 800 | `#005A26` | `#654200` | `#8F0013` | `#004C86` |
| 900 | `#003C17` | `#432B00` | `#610009` | `#00315A` |
| 950 | `#00260C` | `#2C1A00` | `#410004` | `#001F3C` |

Texto de estado: paso 700 en light (5.4 a 6.4:1 sobre blanco), paso 300 en dark (8.5 a 10:1 sobre `teal.900`). El 600 no pasa AA para texto en ninguna de las cuatro.

Otros primitivos: `white #FFFFFF`, `black #000000`, `transparent`.

### 2.3 Mode: color

| Token | light | dark | Contraste clave |
|---|---|---|---|
| `bg.canvas` | neutral.100 | teal.1000 | |
| `bg.surface` | neutral.25 | teal.900 | |
| `bg.subtle` | neutral.200 | teal.850 | |
| `bg.inverse` | teal.950 | lime.200 | |
| `border.default` | neutral.200 | teal.800 | |
| `border.strong` | teal.600 | teal.600 | 3.6:1 / 3.5:1 (pasa 3:1 no textual) |
| `text.primary` | teal.950 | teal.50 | 13.7:1+ |
| `text.secondary` | teal.700 | teal.400 | 5.1:1 sobre canvas / 7.0:1 sobre surface |
| `text.disabled` | neutral.500 | teal.600 | decorativo, no cumple AA a propósito |
| `text.inverse` | lime.200 | teal.950 | 12.1:1 |
| `text.inverse-muted` | teal.300 | lime.800 | 9.8:1 / 7.3:1 sobre bg.inverse |
| `text.link` | lime.700 | lime.200 | 5.4:1 / 14.0:1 |
| `accent.default` | lime.200 | lime.200 | |
| `accent.hover` | lime.400 | lime.100 | teal.950 encima: 7.9:1 / 13.1:1 |
| `accent.pressed` | lime.500 | lime.300 | |
| `on.accent` | teal.950 | teal.950 | 12.1:1 |
| `focus.ring` | teal.950 | lime.200 | |
| `status.{x}.bg` | {x}.100 | {x}.900 | |
| `status.{x}.text` | {x}.700 | {x}.300 | |
| `status.{x}.border` | {x}.300 | {x}.700 | |

`{x}` = success (green), warning (amber), danger (red), info (blue).

**Regla dura**: `accent.default` nunca es texto, icono ni borde sobre `bg.canvas` o `bg.surface` en light (1.2:1). Es solo superficie.

### 2.4 Semantic: color

| Token | → Mode |
|---|---|
| `page.bg` | bg.canvas |
| `card.bg` / `card.border` | bg.surface / border.default |
| `card.feature.bg` / `.fg` / `.fg-muted` | bg.inverse / text.inverse / text.inverse-muted |
| `card.highlight.bg` / `.fg` | accent.default / on.accent |
| `button.primary.bg` / `-hover` / `-pressed` / `.fg` | accent.default / accent.hover / accent.pressed / on.accent |
| `button.secondary.bg` / `.border` / `.fg` | bg.surface / border.default / text.primary |
| `button.secondary.border-hover` | text.secondary |
| `nav.item.fg` / `.bg-hover` | text.primary / bg.subtle |
| `nav.item.active.bg` / `.fg` | bg.inverse / text.inverse |
| `link.fg` | text.link |
| `input.bg` / `.border` / `.border-focus` / `.placeholder` | bg.surface / border.default / focus.ring / text.secondary |
| `alert.{x}.bg` / `.fg` / `.border` | status.{x}.bg / status.{x}.text / status.{x}.border |
| `icon.default` / `.muted` / `.on-accent` | text.primary / text.secondary / on.accent |

---

## 3. Tipografía

### 3.1 Primitive

| Token | Valor |
|---|---|
| `font.family.accent` | `'Fira Sans', sans-serif` |
| `font.family.body` | `'Plus Jakarta Sans', sans-serif` |
| `font.family.mono` | `'Fira Mono', monospace` |
| `font.weight.regular` / `medium` / `semibold` / `bold` / `extrabold` | 400 / 500 / 600 / 700 / 800 |
| `font.size` | 12, 14, 16, 18, 20, 24, 32, 40, 44, 56, 72, 96 |
| `font.line-height` | 16, 20, 24, 28, 32, 40, 48, 56, 72, 96 (todos múltiplos de 4) |
| `font.letter-spacing.tighter` / `tight` / `snug` / `normal` / `wide` | -0.03em / -0.02em / -0.01em / 0 / 0.04em |

Font sizes no siguen la regla de 4 estrictamente (14, 18); los line heights sí.

**Reparto de familias**
- **Fira Sans (accent)**: display, heading, caption, labels de botones y nav. Es humanista y algo condensada, así que el tracking negativo es más moderado que en una grotesca: −0.03em como máximo en display.
- **Plus Jakarta Sans (body)**: todo texto de lectura. Tiene x-height alta, por eso 16/24 rinde bien sin subir a 18.
- **Fira Mono**: metadatos y fragmentos de código. Misma familia que el acento, así las etiquetas técnicas se sienten parte del sistema.
- Carga: Fira Sans 400, 500, 700, 800 · Plus Jakarta Sans 400, 500 · Fira Mono 400. Siete archivos; si el peso de carga importa, recortar Fira Sans a 500 y 800.

### 3.2 Mode: escala por breakpoint

| Estilo | familia | desktop size / lh | mobile size / lh | weight | tracking |
|---|---|---|---|---|---|
| `display.lg` | accent | 96 / 96 | 56 / 56 | extrabold | tighter |
| `display.md` | accent | 72 / 72 | 44 / 48 | extrabold | tighter |
| `heading.lg` | accent | 40 / 48 | 32 / 40 | bold | tight |
| `heading.md` | accent | 32 / 40 | 24 / 32 | bold | tight |
| `heading.sm` | accent | 24 / 32 | 20 / 28 | medium | snug |
| `body.lg` | body | 18 / 28 | 18 / 28 | regular | normal |
| `body.md` | body | 16 / 24 | 16 / 24 | regular | normal |
| `body.sm` | body | 14 / 20 | 14 / 20 | regular | normal |
| `caption.md` | accent | 12 / 16 | 12 / 16 | medium | wide |
| `caption.mono` | mono | 12 / 16 | 12 / 16 | regular | normal |
| `label.md` | accent | 16 / 24 | 16 / 24 | medium | normal |
| `label.sm` | accent | 14 / 20 | 14 / 20 | medium | normal |

Body tiene variante `-strong` (weight medium, misma familia). `label.*` es para botones y nav: así los controles hablan con la voz del acento y el texto de lectura con la del cuerpo. 12 es el mínimo de cualquier texto.

### 3.3 Semantic: tipografía

| Token | → Mode |
|---|---|
| `hero.title` | display.lg |
| `stat.value` (el "8+") | display.md |
| `page.title` | heading.lg |
| `card.title` | heading.sm |
| `section.title` | heading.md |
| `card.body` / `page.body` | body.md / body.lg |
| `button.label` / `nav.label` | label.md / label.md |
| `chip.label` | label.sm |
| `meta.label` (fechas, tags, "side quest") | caption.mono |
| `input.helper` | caption.md |

---

## 4. Spacing

### 4.1 Primitive

`space.{n}` donde n = valor en px:

`0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 128`

### 4.2 Mode: densidad por breakpoint

| Token | desktop | mobile |
|---|---|---|
| `inset.xs` | 4 | 4 |
| `inset.sm` | 8 | 8 |
| `inset.md` | 16 | 12 |
| `inset.lg` | 24 | 20 |
| `inset.xl` | 32 | 24 |
| `gap.xs` | 4 | 4 |
| `gap.sm` | 8 | 8 |
| `gap.md` | 12 | 12 |
| `gap.lg` | 20 | 16 |
| `gap.xl` | 32 | 24 |
| `section` | 96 | 64 |
| `gutter.page` | 32 | 16 |

### 4.3 Semantic

| Token | → Mode |
|---|---|
| `card.padding` | inset.xl |
| `card.content-gap` | gap.lg |
| `bento.gap` | gap.lg |
| `button.padding-x` / `-y` | inset.md / inset.sm (alto lo fija sizing) |
| `nav.padding` / `nav.item-gap` | inset.xs / gap.xs |
| `stack.tight` / `stack.default` / `stack.loose` | gap.sm / gap.md / gap.xl |
| `page.padding-x` | gutter.page |
| `section.spacing` | section |

---

## 5. Border radius

### 5.1 Primitive

`radius.0, 4, 8, 12, 16, 20, 24, 32` y `radius.full = 9999px`

### 5.2 Mode

| Token | desktop | mobile |
|---|---|---|
| `radius.sm` | 8 | 8 |
| `radius.md` | 16 | 12 |
| `radius.lg` | 24 | 20 |
| `radius.xl` | 32 | 24 |
| `radius.pill` | full | full |

### 5.3 Semantic

| Token | → Mode |
|---|---|
| `card` | radius.xl |
| `icon-tile` (contenedor de icono en tarjeta) | radius.md |
| `mockup.inner` | radius.lg |
| `button` / `nav` / `chip` | radius.pill |
| `input` | radius.sm |
| `swatch` | radius.sm |

**Regla de radios anidados**: radio interno = radio externo − padding. Con `card` 32 y padding 32, un elemento pegado al borde iría a 0; con padding 16, a 16.

---

## 6. Sizing

| Primitive | `size.{n}`: 16, 20, 24, 32, 40, 44, 48, 64, 150 |
|---|---|

| Mode | desktop | mobile |
|---|---|---|
| `control.sm` | 32 | 40 |
| `control.md` | 44 | 44 |
| `control.lg` | 48 | 48 |
| `avatar.lg` | 150 | 96 |

| Semantic | → Mode |
|---|---|
| `button.height` | control.md |
| `nav.item.height` | control.md |
| `input.height` | control.lg |
| `hit-area.min` | control.md (44, mínimo táctil) |
| `icon-tile.size` | 64 en ambos modos |

`control.sm` sube a 40 en mobile para no bajar de un área táctil razonable.

---

## 7. Iconos (Gravity UI)

Gravity UI Icons (`@gravity-ui/icons`) está dibujado en un grid de 16px y se distribuye como SVG y como componentes React. Los iconos usan `currentColor`, así que el color viene de los tokens `semantic.color.icon.*` y no se define por icono.

| Primitive | `icon.size.{n}`: 16, 20, 24, 32 |
|---|---|

| Mode | desktop | mobile |
|---|---|---|
| `icon.sm` | 16 | 16 |
| `icon.md` | 20 | 24 |
| `icon.lg` | 24 | 24 |
| `icon.xl` | 32 | 32 |

| Semantic | → Mode |
|---|---|
| `icon.inline` (junto a body) | icon.sm |
| `icon.button` | icon.md |
| `icon.nav` | icon.md |
| `icon.tile` (dentro de icon-tile 64) | icon.xl |
| `icon.arrow` (flecha de tarjeta) | icon.lg |

Nota: al estar diseñados a 16px, 20 no es múltiplo entero del grid y puede verse ligeramente suave. Validar en pantalla 1x antes de fijarlo; alternativa es usar solo 16, 24 y 32.

---

## 8. Motion (transitions.dev)

transitions.dev es una colección de transiciones que se consumen copiando CSS o React, no una dependencia npm. Por eso los tokens son el contrato: cada snippet que se adopte se reescribe para leer estas variables en vez de sus valores fijos.

### 8.1 Primitive

| Token | Valor |
|---|---|
| `duration.{n}` | 0, 100, 200, 300, 400, 600, 800 ms |
| `easing.linear` | `linear` |
| `easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `easing.enter` | `cubic-bezier(0, 0, 0, 1)` |
| `easing.exit` | `cubic-bezier(0.3, 0, 1, 1)` |
| `easing.emphasized` | `cubic-bezier(0.5, 0, 0, 1)` |
| `distance.{n}` | 4, 8, 12, 16 px (desplazamientos) |
| `scale.dim` | 0.97 |

### 8.2 Mode: preferencia de movimiento

| Token | default | reduced |
|---|---|---|
| `duration.instant` | 100 | 0 |
| `duration.fast` | 200 | 0 |
| `duration.base` | 300 | 100 (solo opacidad) |
| `duration.slow` | 600 | 100 |
| `duration.loader-cycle` | 800 | 800 |
| `motion.distance` | 8 | 0 |
| `motion.scale` | scale.dim | 1 |

`reduced` se activa con `prefers-reduced-motion: reduce`. Los loaders mantienen su ciclo porque comunican estado, pero deben poder sustituirse por una versión estática si el patrón parpadea.

### 8.3 Semantic

| Token | → Mode |
|---|---|
| `hover` (color, borde) | duration.fast + easing.standard |
| `press` | duration.instant + easing.standard |
| `card.filter` (atenuar en nav) | duration.base + easing.standard + motion.scale |
| `theme.switch` | duration.base + easing.standard |
| `enter` (aparecer) | duration.slow + easing.enter + motion.distance |
| `exit` | duration.fast + easing.exit |
| `loader.matrix-dot` | duration.loader-cycle + easing.linear |

Pendiente: la página del matrix dot loader no expone duraciones ni curvas sin abrir el código. Al copiarlo, mapear sus valores a `loader.*` y ajustar el color de los puntos a `accent.default` en dark y `text.primary` en light (lime sobre fondo claro no se ve).

---

## 9. Lo que falta (propuesto, no definido aún)

| Categoría | Por qué hace falta | Propuesta inicial |
|---|---|---|
| **Breakpoints** | Los modos desktop/mobile necesitan un corte | `bp.sm 640`, `bp.md 820`, `bp.lg 1100`, `bp.xl 1440` |
| **Layout / grid** | El bento depende de esto | container 1100, 4 columnas desktop, 2 en mobile, filas de 248 (múltiplo de 4; hoy son 250) |
| **Border width** | Bordes y focus | `1` default, `2` focus y destacado |
| **Elevation** | Decidir si el sistema es plano | Plano: sin sombras, la profundidad viene de `border` y del cambio de superficie. Solo una sombra para overlays (menús, modales) |
| **Opacity** | Estados atenuados | `dim 0.25` (filtro del nav), `disabled 0.4`, `scrim 0.6` |
| **Z index** | Overlays | `base 0`, `sticky 100`, `overlay 200`, `modal 300`, `toast 400` |
| **Focus** | Accesibilidad de teclado | ring 2px `focus.ring` + offset 2px |
| **Data viz** | Si muestras métricas en casos de estudio | Categórica derivada de lime/teal/blue/amber, validar luminosidad |
| **Assets de marca** | Logotipo "br." | Versión con punto lime para dark y punto con contorno teal para light |

### Decisiones cerradas
- **Modo default: light.** Consecuencia directa: el lime casi nunca es texto en la vista inicial. Su presencia depende de superficies (botón primario, tarjetas highlight, avatar) y del par `bg.inverse` teal con texto lime. Todo componente nuevo se diseña primero en light y se valida después en dark.
- **Tipografía**: Fira Sans para acentos, Plus Jakarta Sans para cuerpo, Fira Mono para metadatos.

### Decisiones abiertas
1. **Verde de success**: hue 150 se separa del lime, pero conviene verlo junto al lime en un alert real antes de cerrarlo.
2. **Tracking en display**: −0.03em es el punto de partida para Fira Sans extrabold a 96px; validarlo en pantalla con "Bernardo Reyes" y con el "8+".
