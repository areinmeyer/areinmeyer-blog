---
title: Getting Started with Deno, Typescript
date:
description: A deeper dive into Deno and Typescript
tags: ["typescript", "deno", "learninpublic"]
---

This is the second in a series of posts on Deno, the new JavaScript runtime.  You can find my previous post introducing Deno [here](deno-start.md).  

The focus now is on how you can leverage Typescript and Deno together.  A huge benefit of Deno is that it your building out of applications is the same whether you use Typescript or plain JavaScript.  The commands are no different for compilig or running code.  In my day-to-day activities, I often am either prototyping some initial concepts or writing little utilities to do some repeatable things to make my life easier.  That probably describes most days of any developer's work day too!  With NodeJS, often there are different `npm` scripts to run depending on whether you are in development mode, bundling for production, compiling Typescript.  Setting up bundling in a project may be one of Dante's seven levels of hell.  In Deno projects we may not have to worry about image compression or css pre-processing, but even in a NodeJS project that's strictly server-side, adding Typescript in can be several steps and potentially varied across projects.  

In Deno, you just write Typescript code and run your code with `deno run`.  Remember that if you want to just use JavaScript, you also use the command `deno run`.  One feature that's not yet in Deno is a `watch` command or `run --watch` flag.  That would allow the project to be continually re-built as code is being written.  Typescript development now often leverages [nodemon](???) in the command, a fanastic tool for NodeJS development.  Often though using the Typescript compiler `tsc` and `nodemon` together can get a little buggy.  I have often seem `tsc` get out of sync and the solution is to just stop the compiler from running the watch and restart.  As this feature hasn't landed yet, there's no guarantee it won't suffer from some of the same issues.  Given how fast the compiling is done though on a `deno run` I'm hopeful that it is a better option.

TODO:
* [ ] mention the 3 ways to add type definitions for compiler hints
* [ ] mention --no-check??
* [ ] turns on all check flags by default to be `strict`.  