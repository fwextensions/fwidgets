# {{ tmplr.pluginName }}

This plugin was generated using the [fwidgets](https://github.com/fwextensions/fwidgets) library.


## Install

Rather than installing this package on its own, it's easiest to run this command:

```shell
$ npx tmplr fwextensions/fwidgets/plugin
$ cd {{ tmplr.pluginName | kebab-case }}
$ npm install
```


## Usage

Once the plugin skeleton has been created and all its dependencies installed, open the `package.json` file and edit this section to make sure the `id` and `name` have been set to your liking:

```
"figma-plugin": {
  "id": "{{ tmplr.pluginName | camelCase }}",
  "name": "{{ tmplr.pluginName | Capital Case }}",
  ...
}
```

Then open a terminal and execute `npm run dev` to start a process that rebuilds the plugin whenever files in the `src` directory change.  (The template uses the excellent [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) tool to build and package the plugin.)

In Figma, go to *Plugins > Development > Import plugin from manifest...* and select the `manifest.json` file that has been generated in the root directory.  Run your new plugin to see its sample code ask for a color, then a number of rectangles to create, and finally a confirmation before creating the colored rectangles and copying their bounding boxes to the clipboard as JSON.


### Awaiting user input

Open `src/main.ts` to see the sample code.  Most of it is contained within an async function that's passed to `fwidgets()`, whose return value is then exported as the default for this module.

A typical use of the API looks like this:

```typescript
// main.ts
import fwidgets from "fwidgets/main";

export default fwidgets(async ({ input, output, ui }) => {
  // ...
  const count = await input.number("Number of rectangles:", {
    placeholder: "Count",
    minimum: 1,
    maximum: 10,
    integer: true
  });
});
```

![number screenshot](https://user-images.githubusercontent.com/61631/280553210-ce887bee-2fc7-4994-9cd2-b089456e9903.png)

You make a call to an `input` method like `number()`, which will show a numeric entry field in the plugin window.  Pass the method a label string and any options needed for that UI element.

Since you're waiting for the user to enter something, you have to `await` the `input.number()` call so that your main thread pauses until a value is returned.  The user can click the *Next* button next to the input to submit the value, or press <kbd>enter</kbd>.  If the user clicks the plugin window's close box or presses <kbd>escape</kbd>, the plugin execution will immediately stop, much like a CLI process getting killed.

The key difference between using `fwidgets` to show a user interface vs. building it in the UI thread is that the main thread is in control and runs from beginning to end, like a typical script.  It may hand off control to the UI thread to get some user input, but it decides when to do that, rather than responding to events sent via `postMessage()`.


### Development workflow

Try changing one of the strings that supplies a UI label and save the file to rebuild the plugin.  Then reopen it in Figma to see the change.

That's it! The whole workflow is basically just adding some code inside the call to `fwidgets()` in `main.ts`, saving the file, and then testing the plugin in Figma.

Note that you shouldn't edit the `ui.tsx` file, which is there just to set up the Preact code that listens for calls from the main thread and to then render the requested UI element.  (If you know what you're doing, you could add some static elements around the core `<Fwidgets />` component, but that's left as an exercise for the reader.)
