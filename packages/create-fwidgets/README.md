# create-fwidgets

> Create a new Figma plugin using the [fwidgets](https://github.com/fwextensions/fwidgets) library.

[![screenshot](https://user-images.githubusercontent.com/61631/280552964-f63c103e-61db-4b7b-8610-2116613e665d.png)](https://github.com/fwextensions/fwidgets)


## Usage

```shell
npm create fwidgets@latest
```

Follow the prompts to create a fully-scaffolded plugin directory:

```shell
$ npm create fwidgets@latest
  Enter the name of the plugin:
  > My Plugin
  Enter the directory in which to create the plugin:
  > my-plugin
  ✔ Cloned: fwextensions/fwidgets/packages/plugin -> my-plugin
```

Then install the dependencies and start the development server:

```shell
$ cd my-plugin
$ npm install
$ npm run dev
```

The plugin will be rebuilt whenever files in the `src` directory change.  (This package uses the excellent [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) tool to build and package the plugin.)

In Figma, go to *Plugins > Development > Import plugin from manifest...* and select the `manifest.json` file that has been generated in your plugin's directory.  Run your new plugin to see the sample code ask for a color, then a number of rectangles to create, and finally a confirmation before creating the colored rectangles and copying their bounding boxes to the clipboard as JSON.

[Get started customizing the code for your own Figma plugin.](https://github.com/fwextensions/fwidgets#awaiting-user-input)
