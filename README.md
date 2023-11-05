# fwidgets

> Create a simple Figma plugin UI with zero UI code.

![screenshot](https://user-images.githubusercontent.com/61631/280552964-f63c103e-61db-4b7b-8610-2116613e665d.png)

Many useful Figma plugins run only in the main thread, where they can access the API and modify the document.  But sometimes you'll want to extend them with simple user interface elements, like a textbox to enter a name, or a color picker to customize the output.  Unfortunately, Figma doesn't offer any built-in UI components, so you have to roll your own, using a framework or vanilla JS/HTML/CSS, and then post messages to the main thread so that your UI can actually interact with the API.

`fwidgets` is intended to dramatically simplify this process by letting you add basic UI functionality without writing any UI code.  Think of it like adding a series of interactive prompts to a command line tool, similar to the wizard structure of something like `create-react-app`.  `fwidgets` lets you show one UI element at a time to the user, awaiting their input and then responding to it.



## Install

Rather than installing this package on its own, it's easiest to start with a copy of this [template repository](https://github.com/fwextensions/fwidgets-template):

```shell
npx --yes degit fwextensions/fwidgets-template my-plugin-name
```

Replace `my-plugin-name` with whatever you want to call the directory for your plugin.


## Usage

Once the plugin skeleton has been created, open its `package.json` and edit this section to customize the `id` and `name` of your plugin:

```
"figma-plugin": {
  "id": "fwidgetsPluginTemplate",
  "name": "Fwidgets Plugin Template",
  ...
}
```

Then open a terminal and execute `npm run dev` to start a process that rebuilds the plugin whenever files in the `src` directory change.  (The template uses the excellent [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) tool to build and package the plugin.)

In Figma, go to *Plugins > Development > Import plugin from manifest...* and select the `manifest.json` file that has been generated in the root directory.  Run your new plugin to see its sample code ask for a color, then a number of rectangles to create, and finally a confirmation before creating the colored rectangles and copying their bounding boxes to the clipboard as JSON.


### Awaiting user input

Open `src/main.ts` to see the sample code.  Most of it is contained within an async function that's passed to `fwidgets()`, whose return value is then exported as the default for this module.

A typical use of the API looks like this:

```typescript
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

You make a call to an `input` method like `number()`, which will show a numeric entry field in the plugin window.  Pass the method a label string and any options needed for that UI element.

Since you're waiting for the user to enter something, you have to `await` the `input.number()` call so that your main thread pauses until a value is returned.  The user can click the *Next* button next to the input to submit the value, or press <kbd>enter</kbd>.  If the user clicks the plugin window's close box or presses <kbd>escape</kbd>, the plugin execution will immediately stop, much like a CLI process getting killed.

The key difference between using `fwidgets` to show a user interface vs. building it in the UI thread is that the main thread is in control and runs from beginning to end, like a typical script.  It may hand off control to the UI thread to get some user input, but it decides when to do that, rather than responding to events sent via `postMessage()`.


### Development workflow

Try changing one of the strings that supplies a UI label and save the file to rebuild the plugin.  Then reopen it in Figma to see the change.

That's it! The whole workflow is basically just adding some code inside the call to `fwidgets()` in `main.ts`, saving the file, and then testing the plugin in Figma.

Note that you shouldn't edit the `ui.tsx` file, which is there just to set up the Preact code that listens for calls from the main thread and to then render the requested UI element.  (If you know what you're doing, you could add some static elements around the core `<Fwidgets />` component, but that's left as an exercise for the reader.)


## API

### `fwidgets()`

This is the only function you need to import.  Pass it an async function containing your plugin logic, which it will wrap with code to handle communication with the UI thread.  Export that wrapped function as the module's default value.

```typescript
import { fwidgets } from "fwidgets/main";

export default fwidgets(async ({ input, output, ui }) => {
  // add your plugin code here
});
```

You can import code from other modules, and even make API calls before calling `fwidgets()`.  But it should only be called once, since it calls `figma.closePlugin()` before returning, which will disable the Figma APIs.

Your function will be passed an object containing the [`input`](#input), [`output`](#output) and [`ui`](#ui) APIs that can be used to render UI elements and control the plugin window.


<hr>


### `input`

All of the `input` methods listed below, except for `buttons()`, display a button labeled *Next* to the right of the UI element.  The user clicks that to confirm the value and move to the next step, which is when the awaited method call returns with the value.  The user can also press <kbd>enter</kbd> to confirm the value, or press <kbd>escape</kbd> to close the plugin and stop its execution.

For any of the label parameters below, pass an empty string to not take up any space for a label at all.

Calling one of these methods will automatically show the plugin window if it's not currently open or visible.


#### `buttons(label, buttonLabels)`

Shows a list of push buttons.

- `label`: The label to show above the buttons.
- `buttonLabels`: An array of button label strings.

Returns the label of the button that was clicked.

![buttons screenshot](https://user-images.githubusercontent.com/61631/280553231-bbff221d-5b25-43fa-9672-550f3f493273.png)

```typescript
const btn = await input.buttons("Continue?", ["Create Rectangles", "Cancel"]);
```


#### `color(label, options?)`

Shows a color picker.  The picker consists of a color swatch that can be clicked to show a full color palette, a text area in which a hex value can be entered, and another text area for opacity.

- `label`: The label to show above the color picker.
- `options`:
  - `placeholder`: A string to show when the hex input is empty.

Returns an `{ a, r, g, b }` object containing the alpha, red, green and blue components of the selected color.

![color screenshot](https://user-images.githubusercontent.com/61631/280553180-2e416d19-b453-4c1a-ba2c-33d2a23d7c09.png)

```typescript
const argb = await input.color("Rectangle fill color:");
```

If you just need the RGB components, you can extract them with the rest operator like this:

```typescript
const { a, ...rgb } = await input.color("Enter a color:")
const rect = figma.createRectangle();
rect.fills = [{ type: "SOLID", color: rgb }];
```


#### `dropdown(label, items, options?)`

Shows a dropdown menu.

- `label`: The label to show above the dropdown menu.
- `items`: An array of label strings to show in the menu.
- `options`:
  - `placeholder`: A string to show when nothing has been selected.

Returns the label of the menu item that was selected.

![dropdown screenshot](https://user-images.githubusercontent.com/61631/280553519-3b2eaa6c-966a-4c82-b918-38c0824ac510.png)

```typescript
const align = await input.dropdown("Text alignment:", ["left", "center", "right"]);
```


#### `number(label, options?)`

Shows a numeric entry field.

- `label`: The label to show above the entry field.
- `options`:
  - `placeholder`: A string to show when the field is empty.
  - `defaultValue`: The default value to show.
  - `suffix`: A suffix to show after the entered number, like `"%"`.
  - `incrementSmall`: How much to change the number when <kbd>up</kbd> or <kbd>down</kbd> arrows are pressed.
  - `incrementBig`: How much to change the number when <kbd>shift</kbd><kbd>up</kbd> or <kbd>shift</kbd><kbd>down</kbd> arrows are pressed.
  - `minimum`: The smallest value that can be entered.
  - `maximum`: The largest value that can be entered.
  - `integer`: A boolean controlling whether a decimal can be entered.

Returns the number that was entered.

![number screenshot](https://user-images.githubusercontent.com/61631/280553210-ce887bee-2fc7-4994-9cd2-b089456e9903.png)

```typescript
const count = await input.number("Number of rectangles:", { integer: true });
```

#### `page(label?, options?)`

Shows a dropdown menu of all the pages in the current Figma document.

- `label`: The label to show above the dropdown menu.  Defaults to *Select a page:*.
- `options`:
  - `placeholder`: A string to show when nothing has been selected.  Defaults to *Pages*.

Returns the `PageNode` of the selected page.

![page screenshot](https://user-images.githubusercontent.com/61631/280553620-24ff03a1-cd02-4e3f-a078-3c923bffcd92.png)

```typescript
const selectedPage = await input.page();
```


#### `text(label, options?)`

Shows a single-line text entry field.

- `label`: The label to show above the entry field.
- `options`:
  - `placeholder`: A string to show when the field is empty.

Returns the string that was entered.

![text screenshot](https://user-images.githubusercontent.com/61631/280553453-11358bc6-29e4-421a-a1bd-8ed44eba5c95.png)

```typescript
const title = await input.text("Enter a title:");
```


<hr>


### `output`

The `output` methods listed below return a promise that resolves to `undefined`, but you still need to await the response to give them time to update the plugin UI before returning.


#### `clipboard(value)`

Copies a string version of `value` to the clipboard.  If `value` is a non-null object, then it will be converted to formatted JSON before copying.

- `value`: The data to copy to the user's clipboard.

```typescript
await output.clipboard(figma.currentPage.selection[0].fills);
```


#### `text(string, options?)`

Displays static text that can wrap to multiple lines.

- `string`: The string to display.
- `options`:
  - `align`: Control the alignment of the text by passing `"left"|"center"|"right"`.
  - `numeric`: A boolean controlling whether the text is rendered with monospaced numerals.

![text screenshot](https://user-images.githubusercontent.com/61631/280554012-6625df86-06ca-456f-8afa-38ae01fef893.png)

```typescript
await output.text(`Export preview:
Color: #cc3300
Rectangle count: 5
Format: JSON`);
```


<hr>


### `ui`

#### `hide()`

Hides the plugin window if it's currently open, but does not close it or end plugin execution.


#### `setSize(size)`

Sets the plugin window size, but does not show it if it's not currently visible.

The plugin window defaults to 300px wide by 200px tall.

- `size`:
  - `width`: The desired `width` in px.
  - `height`: The desired `height` in px.


#### `show(size?)`

Opens or shows the plugin window, and sets it to the specified size, if one is supplied.  It's normally not necessary to call `show()`, as any call to an `input` method will automatically show the plugin window.

- `size`:
  - `width`: The desired `width` in px.
  - `height`: The desired `height` in px.


## Credits

The idea for `fwidgets` was inspired by the [Airtable scripting API](https://airtable.com/developers/scripting/api), which is generally terrible except for its `input` and `output` methods.  They're a clever solution to including interactive UI elements in a script without having to build a full event-driven app architecture.

This package uses [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) for the [UI components](https://yuanqing.github.io/create-figma-plugin/ui/) and for building the plugin.


## License

[MIT](./LICENSE) © [John Dunning](https://github.com/fwextensions)
