# Style Resources Module compatible with Nuxt 3

## Features

- Share variables, mixins, functions across all style files (no `@import` needed)
- Support for SASS, LESS and Stylus
- Aliases (`@/assets/variables.css`) and globbing as supported
- Support for hoisting `@use` imports
- Blazing fast:tm:

## Warning

**Do not import actual styles**.
Use this module only to import variables, mixins, functions (et cetera) as they won't exist in the actual build. Importing actual styles will include them in every component and will also make your build/HMR magnitudes slower.
**Do not do this!**

## Setup

- If not already present, add the dependencies you need for SASS/LESS/Stylus (depending on your needs)
  - SASS: `yarn add sass-loader sass`
  - LESS: `yarn add less-loader less`
  - Stylus: `yarn add stylus-loader stylus`
- Add `@wattanx/style-resources` dependency using yarn or npm to your project
- Add `@wattanx/style-resources` to `modules` section of `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["@wattanx/style-resources"],

  styleResources: {
    // your settings here
    sass: [],
    scss: [],
    less: [],
    stylus: [],
    hoistUseStatements: true, // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },
});
```

## Examples

### LESS Example

`nuxt.config.ts`:

```js
export default defineNuxtConfig({
  css: ["@/assets/global.less"],
  modules: ["@wattanx/style-resources"],
  styleResources: {
    less: "@/assets/vars/*.less",
  },
});
```

`assets/global.less`

```less
h1 {
  color: @green;
}
```

`assets/vars/variables.less`

```less
@gray: #333;
```

`assets/vars/more_variables.less`

```less
@green: #00ff00;
```

`pages/index.vue`

```vue
<template>
  <div>
    <!-- This h1 will be green -->
    <h1>Test</h1>
    <Test />
  </div>
</template>
```

`components/Test.vue`

```vue
<template>
  <div class="test">Test</div>
</template>

<style lang="less">
.test {
  color: @gray; // will be resolved to #333
}
</style>
```

---

### SCSS Example

`nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: ["@wattanx/style-resources"],
  styleResources: {
    scss: [
      "@/assets/vars/*.scss",
      "@/assets/abstracts/_mixins.scss", // use underscore "_" & also file extension ".scss"
    ],
  },
});
```

> Instead of `'./assets/abstracts/_mixins.scss'` you can use also `'@/assets/abstracts/_mixins.scss'`

`assets/vars/_colors.scss`

```scss
$gray: #333;
```

`assets/abstracts/_mixins.scss`

```scss
@mixin center() {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
```

`components/Test.vue`

```vue
<template>
  <div class="test">Test</div>
</template>

<style lang="scss">
.test {
  @include center; // will be resolved as position:absolute....
  color: $gray; // will be resolved to #333
}
</style>
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
