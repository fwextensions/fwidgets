# Changelog

## [0.1.0](https://github.com/fwextensions/fwidgets/compare/create-fwidgets@0.0.3...0.1.0) (2024-01-08)


### Features

- Export `FwidgetsUI()` from `ui/index.ts` so just a single line is needed in the user's `ui.tsx` ([e88cd51](https://github.com/fwextensions/fwidgets/commit/e88cd519bef4d128dc0716d0c7199f2f020f5d87))
- Export `input`, `output` and `ui` modules from `fwidgets/main` so they can be imported outside of the `fwidgets()` function ([2f5ec80](https://github.com/fwextensions/fwidgets/commit/2f5ec8063ac7689b6704df074fd2dc185145ee0f))
- Export main modules from top-level `fwidgets` package, as well as `fwidgets/main` ([58f09ea](https://github.com/fwextensions/fwidgets/commit/58f09eab0ccfafe6b3710af4cd4ec78ce2d7e575))
- Make `input.text()` automatically grow in height as more text is entered ([2131958](https://github.com/fwextensions/fwidgets/commit/2131958c90128f8a911015aaa8a0a47db071a0ef))
- Support a `defaultValue` prop on text fields ([b9c9111](https://github.com/fwextensions/fwidgets/commit/b9c911188c33b076a2d73dc17d72ed3bf1d7ca5f))


### Chores

- Update `classnames`, `typescript`, `plugin-typings` and `release-it` ([ae6238c](https://github.com/fwextensions/fwidgets/commit/ae6238c5aee38ffc663b0e758841c614d54a88c0))

## [0.0.3](https://github.com/fwextensions/fwidgets/compare/0.0.2...0.0.3) (2023-12-06)


### Features

- Add `setPosition()` method to control the position of the plugin window ([c376d33](https://github.com/fwextensions/fwidgets/commit/c376d336a6eabcbe4932603771e4c6641db39fe5))
- Add option to show a toast message to output.clipboard() ([5701f71](https://github.com/fwextensions/fwidgets/commit/5701f7149c39ac2063a190defe240a3f19192e9c))
- Add support for showing tiny window when outputting to clipboard ([da7bf2d](https://github.com/fwextensions/fwidgets/commit/da7bf2d518bc1b315798cc82211794318eb8b433))
- Reorganize code into a monorepo ([9b9fc25](https://github.com/fwextensions/fwidgets/commit/9b9fc2536ace3d6807329b2bb0fa5953dc3dce77))


### Chores

- Bump typescript, preact, and plugin-typings to the latest ([293e694](https://github.com/fwextensions/fwidgets/commit/293e6942fc7b4a75784c1cf159176c0cdcba497b))


### CI/CD

- Ensure README.md gets packaged during the build ([f3d5d02](https://github.com/fwextensions/fwidgets/commit/f3d5d02b394c7449798c347c77faf127e7d0ec77))



## [0.0.2](https://github.com/fwextensions/fwidgets/compare/0.0.1...0.0.2) (2023-11-18)


### Chores

- Switch to figma-await-ipc 0.1.0 ([47b0270](https://github.com/fwextensions/fwidgets/commit/47b027094e2cdb7bc5f86610fe0fe05dc606f4b9))



## 0.0.1 (2023-11-12)

### Features

- Initial release.
