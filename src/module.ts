import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  resolveModule,
  resolveAlias,
  resolveFiles,
  resolvePath,
  extendWebpackConfig,
} from "@nuxt/kit";

export interface ModuleOptions {
  sass?: string[];
  scss?: string[];
  less?: string[];
  stylus?: string[];
  hoistUseStatements?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "styleResources",
  },
  defaults: {
    hoistUseStatements: false,
  },
  async setup(options, nuxt) {
    const {
      webpack: {
        loaders: { stylus: stylusLoaderOptions },
      },
    } = nuxt.options;
    const { hoistUseStatements, ...styleResources } = options;
    const styleResourcesEntries = Object.entries(styleResources);

    if (!styleResourcesEntries.length) {
      return;
    }

    const basePath = await resolvePath(".");

    const retrieveStyleArrays = (styleResourcesEntries: [string, string[]][]) =>
      styleResourcesEntries.reduce((normalizedObject, [key, value]) => {
        const wrappedValue = Array.isArray(value) ? value : [value];

        normalizedObject[key] = wrappedValue.reduce((acc, path) => {
          let possibleModulePath;
          try {
            possibleModulePath = resolveModule(path);
          } catch (e) {}
          if (possibleModulePath) {
            return acc.concat(possibleModulePath);
          }

          let _path: string | string[] = path;
          try {
            _path = resolveAlias(path);
          } catch (error) {}

          resolveFiles(basePath, path).then((filePath) => {
            _path = filePath;
          });
          return acc.concat(_path);
        }, [] as string[]);

        return normalizedObject;
      }, {} as Record<string, string[]>);

    const {
      scss = [],
      sass = [],
      less = [],
      stylus = [],
    } = retrieveStyleArrays(styleResourcesEntries);

    if (sass.length) {
      extendWebpackConfig(extendSass({ resources: sass, hoistUseStatements }));
    }

    if (scss.length) {
      extendWebpackConfig(extendScss({ resources: scss, hoistUseStatements }));
    }

    if (stylus.length) {
      stylusLoaderOptions.import = stylusLoaderOptions.import
        ? // @ts-ignore
          [].concat(stylusLoaderOptions.import).concat(stylus)
        : stylus;
    }

    if (less.length) {
      extendWebpackConfig(extendLess({ resources: less, hoistUseStatements }));
    }
  },
});

const extendWithSassResourcesLoader =
  (matchRegex: RegExp) => (options: any) => (config: any) => {
    const sassResourcesLoader = {
      loader: "sass-resources-loader",
      options,
    };

    const matchedLoaders = config.module.rules.filter(({ test = "" }) => {
      return test.toString().match(matchRegex);
    });

    matchedLoaders.forEach((loader: any) => {
      loader.oneOf.forEach((rule: any) => rule.use.push(sassResourcesLoader));
    });
  };

const extendSass = extendWithSassResourcesLoader(/sass/);
const extendScss = extendWithSassResourcesLoader(/scss/);
const extendLess = extendWithSassResourcesLoader(/less/);
