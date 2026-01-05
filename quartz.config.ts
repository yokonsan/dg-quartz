import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "yokonの数字花园",
    enableSPA: true,
    pageTitleSuffix: "",
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "dg.1qi.lol",
    ignorePatterns: ["private", "**/*.excalidraw.md"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "LXGW WenKai",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#f3f4f6",
          gray: "#9ca3af",
          darkgray: "#4b5563",
          dark: "#1f2937",
          secondary: "#3b82f6",
          tertiary: "#60a5fa",
          highlight: "rgba(59, 130, 246, 0.1)",
          textHighlight: "#fef08a",
        },
        darkMode: {
          light: "#1f2937",
          lightgray: "#374151",
          gray: "#9ca3af",
          darkgray: "#d1d5db",
          dark: "#f9fafb",
          secondary: "#60a5fa",
          tertiary: "#3b82f6",
          highlight: "rgba(96, 165, 250, 0.15)",
          textHighlight: "#854d0e",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: false,
        enableCheckbox: true,
        disableBrokenWikilinks: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssLimit: 30,
        rssFullHtml: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),

      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages({
      //   colorScheme: "lightMode", // what colors to use for generating image, same as theme colors from config, valid values are "darkMode" and "lightMode"
      //   width: 1200, // width to generate with (in pixels)
      //   height: 630, // height to generate with (in pixels)
      // }),
    ],
  },
}

export default config
