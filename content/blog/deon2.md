---
title: Getting Started with Deno, Typescript edition
date: 2020-09-10
description: A deeper dive into Deno and Typescript
tags: ["typescript", "deno", "learninpublic"]
---

This is the second in a series of posts on Deno, the new JavaScript runtime.  You can find my previous post introducing Deno [here](deno-start.md).

The focus now is on how you can leverage Typescript and Deno together.  A huge benefit of Deno is that building out of applications is the same whether you use Typescript or plain JavaScript.  The commands are no different for compiling or running code.  In my day-to-day activities, I often am either prototyping some initial concepts or writing little utilities to do some repeatable things to make my life easier.  That probably describes most days of any developer's work day too!  With NodeJS, often there are different `npm` scripts to run depending on whether you are in development mode, bundling for production, or compiling Typescript.  Setting up bundling in a project may be one of Dante's seven levels of hell.  In Deno projects we may not have to worry about image compression or css pre-processing, but even in a NodeJS project that's strictly server-side, adding Typescript in can be several steps and potentially varied across projects.  I just had this experience with a work project.  Server-side NodeJS project using some internal packages.  The suggested way to start the project is to use a CLI tool.  But that doesn't play well with compiling Typescript.  So I admit, I skipped using Typescript for now to get some work done in the short-term. 😱

In Deno, you just write Typescript code and run your code with `deno run`.  Remember that if you want to "just use JavaScript", you also use the command `deno run`.  One feature that's not yet in Deno is a `watch` command or `run --watch` flag.  That would allow the project to be continually re-built as code is being written.  Typescript development now often leverages [nodemon](???) in the command, a fantastic tool for NodeJS development.  Often though using the Typescript compiler `tsc` and `nodemon` together can get a little buggy.  I have often seem `tsc` get out of sync and the solution is to just stop the compiler from running the watch and restart.  As this feature hasn't landed yet, there's no guarantee it won't suffer from some of the same issues.  Given how fast the compiling is done though on a `deno run` I'm hopeful that it is a better option.

## Using TypeScript in Deno

There are 4 ways you can reference types in a Deno project.

### Import the TS file directly
This is likely the easiest of the solutions if it's available.  Import the TypeScript extension (.ts) file into your code and you should have no issues.  I have not had any errors so far referencing TypeScript files.

## Compiler Hints
Deno supports a compiler hint as a code comment where it takes the type definition of the module you are importing above the actual import.  Use the `@deno-types` annotation to tell the compiler where exactly your type definition is located.  In the example below the type definition is in the same folder as the js module I am importing, but that doesn't have to be the case.

```javascript
// @deno-types="./my-awesome-utilities.d.ts"
import {sweetFunction} from "./my-awesome-utilities.js";
```

### Comment references
The Deno docs refer to this as a triple-slash comment.  This can be used when you own the JavaScript module.  While the type reference file is used when the compiler type checks your code, only the JavaScript module is loaded at runtime.

### Custom header
This to me is a more indirect way of loading the types.  When you host your own module and expose it to Deno, you can pass back a custom header named `X-TypeScript-Types` which includes the url of the type definitions.  I am not a big fan of this method.  It is transparent to the user which is good, but if something changes on your host and that header no longer is being served up, you are likely to break projects that then rely on the code.

Exposing a .ts file for users to import is the most direct way, but there's a strong enough convention of using a compiler hint in TypeScript for that way to be straight-forward enough for users to still take advantage of code.

```javascript
/// <reference types=="./my-awesome-utilities.d.ts">
export const sweetFunction = () => {
    return "sweet";
}
```
### Compiler Options
Your Dneo project can provide a tsconfig.json to change the default behavior of enabling all of the strict flags that TypeScript supports.  But that configuration must be specified at runtime using the `-c` flag and passing the path to the config file.  Not ideal as deno already supports a lot of runtime flags due to the security permissions it enables.  The team seems to want to avoid "magic" resolutions or path-logic that ended up causing some confusion in the NodeJS landscape, but it's quite easy to forget flags when running a program that maybe's not already saved or aliased in your command-line history.
TODO:
* [ ] turns on all check flags by default to be `strict`.