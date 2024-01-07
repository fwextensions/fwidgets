# fwidgets

> Create a simple Figma plugin UI with zero UI code.

![screenshot](https://user-images.githubusercontent.com/61631/280552964-f63c103e-61db-4b7b-8610-2116613e665d.png)

Many useful Figma plugins run only in the main thread, where they can access the API and modify the document.  But sometimes you want to extend them with simple user interface elements, like a textbox to enter a name, or a color picker to customize the output.  Unfortunately, Figma doesn't offer any built-in UI components, so you have to roll your own with a framework or vanilla JS/HTML/CSS.  And then you have to post messages back and forth between the main and UI threads to respond to user actions.

`fwidgets` is intended to dramatically simplify this process by letting you add basic UI functionality without writing any UI code.  Think of it like adding a series of interactive prompts to a command line tool, similar to the wizard structure of something like `create-react-app`.  `fwidgets` lets you show one UI element at a time to the user, awaiting their input and then responding to it, while keeping all of your code in the main thread.


## Install

To create a new plugin using `fwidgets`:

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

Then install the dependencies:

```shell
$ cd my-plugin
$ npm install
```


## Usage

Once the plugin skeleton has been created and all its dependencies installed, start the development server:

```shell
npm run dev
```

The plugin will be rebuilt whenever files in the `src` directory change.  (This package uses the excellent [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) tool to build and package the plugin.)

In Figma, go to *Plugins > Development > Import plugin from manifest...* and select the `manifest.json` file that has been generated in your plugin's directory.  Run your new plugin to see the sample code ask for a color, then a number of rectangles to create, and finally a confirmation before creating the colored rectangles and copying their bounding boxes to the clipboard as JSON.


### Awaiting user input

Open `src/main.ts` to see the sample code.  Most of it is contained within an async function that's passed to `fwidgets()`, whose return value is then exported as the default for this module.

A typical use of the API looks like this:

```typescript
// main.ts
import fwidgets from "fwidgets";

export default fwidgets(async ({ input, output, ui }) => {
  // ...
  const count = await input.number("Number of rectangles:", {
    placeholder: "Count",
    minimum: 1,
    maximum: 10,
    integer: true
  });
  // use the count value in a Figma API call
});
```

![number screenshot](https://user-images.githubusercontent.com/61631/280553210-ce887bee-2fc7-4994-9cd2-b089456e9903.png)

You make a call to an `input` method like `number()`, which will show a numeric entry field in the plugin window.  Pass the method a label string and any options needed for that UI element.

Since you're waiting for the user to enter something, you have to `await` the `input.number()` call so that your main thread pauses until a value is returned.  The user can click the *Next* button next to the input to submit the value, or press <kbd>enter</kbd>.  If the user clicks the plugin window's close box or presses <kbd>escape</kbd>, the plugin execution will immediately stop, much like a CLI process getting killed.

The key difference between using `fwidgets` to show a user interface vs. building it in the UI thread is that the main thread is in control and runs from beginning to end, like a typical script.  It may hand off control to the UI thread to get some user input, but it decides when to do that, rather than responding to events sent via `postMessage()`.


### Development workflow

Try changing one of the strings that supplies a UI label and save the file to rebuild the plugin.  Then reopen it in Figma to see the change.

That's it! The whole workflow is basically just adding some code inside the call to `fwidgets()` in `main.ts`, saving the file, and then testing the plugin in Figma.

Note that you shouldn't edit the one-line `ui.tsx` file, which is there just to set up the Preact code that listens for calls from the main thread and then renders the requested UI element.  (If you know what you're doing, you could import `<Fwidgets>` from `fwidgets/ui` and `render()` from `@create-figma-plugin/ui`, and then render some static components around it, but that's left as an exercise for the reader.)


## API

### `fwidgets()`

This is the only function you need to import in your main file.  Pass it an async callback function containing your plugin logic, which it will wrap with code to handle communication with the UI thread.  Export that wrapped callback as the module's default value, which is then called by `create-figma-plugin` when your plugin is launched.

```typescript
// main.ts
import { fwidgets } from "fwidgets";

export default fwidgets(async ({ input, output, ui }) => {
  // add your plugin code here
});
```

You can import code from other modules, and even make API calls before calling `fwidgets()`.  But it should only be called once, since it calls `figma.closePlugin()` before returning, which disables the Figma APIs.

Your function will be passed an object containing the [`input`](#input), [`output`](#output) and [`ui`](#ui) APIs that can be used to render UI elements and control the plugin window.  You can also import these APIs using the standard `import` syntax in other modules, which is useful when your script grows beyond a single file.  They are provided to your callback simply as a convenience.

<br>
<hr>

### `input`

All of the `input` methods listed below, except for `buttons()`, display a button labeled *Next* to the right of the UI element.  The user clicks that to confirm the value and move to the next step, which is when the awaited method call returns with the value.  The user can also press <kbd>enter</kbd> to confirm the value, or press <kbd>escape</kbd> to close the plugin and stop its execution.

For any of the label parameters below, pass an empty string to not take up any space for a label at all.

Calling one of these methods will automatically show the plugin window if it's not currently open or visible.

All of the `fwidgets` UI elements support dark mode and will automatically switch their styling based on the current settings within the Figma app.

<br>

#### `buttons(label, buttonLabels)`

Shows a list of push buttons.

- `label`: The label to show above the buttons.
- `buttonLabels`: An array of button label strings.

Returns the label of the button that was clicked.

![buttons screenshot](https://user-images.githubusercontent.com/61631/280553231-bbff221d-5b25-43fa-9672-550f3f493273.png)

```typescript
const btn = await input.buttons("Continue?", ["Create Rectangles", "Cancel"]);
```

<br>

#### `color(label, options?)`

Shows a color picker.  The picker consists of a color swatch that can be clicked to show a full color palette, a text area in which a hex value can be entered, and another text area for opacity.

- `label`: The label to show above the color picker.
- `options`: An optional object with any of the following keys.
  - `placeholder`: A string to show when the hex input is empty.

Returns an `{ a, r, g, b }` object containing the alpha, red, green and blue components of the selected color.

![color screenshot](https://user-images.githubusercontent.com/61631/280553180-2e416d19-b453-4c1a-ba2c-33d2a23d7c09.png)

```typescript
const rgba = await input.color("Rectangle fill color:");
```

If you just need the RGB components, you can extract them with the rest operator like this:

```typescript
const { a, ...rgb } = await input.color("Enter a color:")
const rect = figma.createRectangle();
rect.fills = [{ type: "SOLID", color: rgb }];
```

<br>

#### `dropdown(label, items, options?)`

Shows a dropdown menu.

- `label`: The label to show above the dropdown menu.
- `items`: An array of label strings to show in the menu.
- `options`: An optional object with any of the following keys.
  - `placeholder`: A string to show when nothing has been selected.

Returns the label of the menu item that was selected.

![dropdown screenshot](https://user-images.githubusercontent.com/61631/280553519-3b2eaa6c-966a-4c82-b918-38c0824ac510.png)

```typescript
const align = await input.dropdown("Text alignment:", ["left", "center", "right"]);
```

<br>

#### `number(label, options?)`

Shows a numeric entry field.

- `label`: The label to show above the entry field.
- `options`: An optional object with any of the following keys.
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

<br>

#### `page(label?, options?)`

Shows a dropdown menu of all the pages in the current Figma document.

- `label`: An optional label to show above the dropdown menu.  Defaults to *Select a page:*.
- `options`: An optional object with any of the following keys.
  - `placeholder`: A string to show when nothing has been selected.  Defaults to *Pages*.

Returns the `PageNode` of the selected page.

![page screenshot](https://user-images.githubusercontent.com/61631/280553620-24ff03a1-cd02-4e3f-a078-3c923bffcd92.png)

```typescript
const selectedPage = await input.page();
```

<br>

#### `text(label, options?)`

Shows a text entry field.  By default, the field starts out as one line but will grow as more text is entered.  Press <kbd>shift</kbd><kbd>enter</kbd> to enter linebreaks without confirming the text.

- `label`: The label to show above the entry field.
- `options`: An optional object with any of the following keys.
  - `placeholder`: A string to show when the field is empty.
  - `defaultValue`: A string to show as the field's default value.
  - `rows`: The number of rows to show when the field is first rendered.  Defaults to 1.
  - `grow`: A boolean controlling whether the field grows as more text is entered.  Defaults to `true`.

Returns the string that was entered.

![text screenshot](https://user-images.githubusercontent.com/61631/280553453-11358bc6-29e4-421a-a1bd-8ed44eba5c95.png)

```typescript
const title = await input.text("Enter a title:");
```

<br>
<hr>

### `output`

The `output` methods listed below return a promise that resolves to `undefined`, but you still need to await the response to give them time to update the plugin UI before returning and to ensure that the calls are executed in order.

Note that since the `output` methods don't wait for any user input, execution will immediately move to the next statement.  So if you want to, say, show some text when a script finishes, be sure to call something like `await input.buttons(["Done"])` after the output, so that the plugin will wait for the user to click *Done* before closing.

<br>

#### `clipboard(value, options?)`

Copies a string version of `value` to the clipboard.  If `value` is a non-null object, then it will be converted to formatted JSON before copying.

Due to limitations in the Figma API, the plugin window has to be open and visible for text to be copied to the clipboard.  If it's not currently open, calling `output.clipboard()` will open the window at its minimal size in the lower-right corner of Figma.  This makes the opening and closing of the window as inconspicuous as possible when your plugin just needs to copy some text.  The next time a `fwidgets` method is called to show a UI control, the window will be restored to its normal size in the middle of the screen.

- `value`: The data to copy to the user's clipboard.
- `options`: An optional object with any of the following keys, which are passed to `figma.notify()`.
  - `message`: A string to show in a toast notification marking the copy operation.  Limited to 100 characters.
  - `error`: A boolean indicating whether the message is an error, which shows it in a different color.
  - `timeout`: The time in milliseconds to show the toast.  Defaults to 3000.

```typescript
await output.clipboard(figma.currentPage.selection[0].fills);
```

<br>

#### `text(string, options?)`

Displays static text that can wrap to multiple lines.

- `string`: The string to display.
- `options`: An optional object with any of the following keys.
  - `align`: Control the alignment of the text by passing `"left" | "center" | "right"`.
  - `numeric`: A boolean controlling whether the text is rendered with monospaced numerals.

![text screenshot](https://user-images.githubusercontent.com/61631/280554012-6625df86-06ca-456f-8afa-38ae01fef893.png)

```typescript
await output.text(`Export preview:
Color: #cc3300
Rectangle count: 5
Format: JSON`);
```

<br>
<hr>

### `ui`

These methods let you control the state of the plugin window.

<br>

#### `hide()`

Hides the plugin window if it's currently open, but does not close it or end plugin execution.

<br>

#### `setPosition(position)`

Sets the plugin window position, but does not show it if it's not currently visible.

The `position` is relative to the top-left of the viewport in *screen* coordinates.  This means you don't have to calculate the coordinates based on the viewport's current zoom and bounds.

- `position`:
  - `x`: The desired X-position in px.
  - `y`: The desired Y-position in px.

<br>

#### `setSize(size)`

Sets the plugin window size, but does not show it if it's not currently visible.

The plugin window defaults to 300px wide by 200px tall.

- `size`:
  - `width`: The desired `width` in px.
  - `height`: The desired `height` in px.

<br>

#### `show(options?)`

Opens or shows the plugin window, and sets it to the specified size and/or position, if supplied.  It's normally not necessary to call `show()`, as any call to an `input` method will automatically show the plugin window.

The `position` coordinates are specified in screen pixels from the top-left of the Figma window, *not* in Figma viewport coordinates.

- `options`: An optional object with any of the following keys.
  - `size`:
    - `width`: The desired `width` in px.
    - `height`: The desired `height` in px.
  - `position`:
    - `x`: The horizontal position.
    - `y`: The vertical position.

<br>


## Credits

The idea for `fwidgets` was inspired by the [Airtable scripting API](https://airtable.com/developers/scripting/api), which is generally terrible except for its `input` and `output` methods.  They're a clever solution for displaying interactive UI elements while executing a script without having to build a full event-driven app architecture.

`fwidgets` also draws from the [JSML Library](https://www.johndunning.com/fireworks/about/JSMLLibrary) that I created for Adobe Fireworks a decade ago.  That library let you create Fireworks dialogs and panels without any Flash or Flex code, just JavaScript.

This package uses [`create-figma-plugin`](https://github.com/yuanqing/create-figma-plugin) for the [UI components](https://yuanqing.github.io/create-figma-plugin/ui/) and for building the plugin.


## License

[MIT](./LICENSE) © [John Dunning](https://github.com/fwextensions)
