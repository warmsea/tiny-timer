import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            "name": "main_window",
            "html": "./src/renderer/main/main.html",
            "js": "./src/renderer/main/main.tsx",
            "preload": {
              "js": "./src/renderer/main/preload.ts"
            }
          },
          {
            "name": "display_window",
            "html": "./src/renderer/display/display.html",
            "js": "./src/renderer/display/display.tsx",
            "preload": {
              "js": "./src/renderer/display/preload.ts"
            }
          }
        ],
      },
    }),
  ],
};

export default config;
