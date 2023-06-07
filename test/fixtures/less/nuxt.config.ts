import MyModule from "../../../src/module";

export default defineNuxtConfig({
  css: ["@/assets/a.less"],
  // @ts-ignore
  modules: [MyModule],
  styleResources: {
    less: "./assets/vars/*.less",
  },
  builder: "webpack",
});
