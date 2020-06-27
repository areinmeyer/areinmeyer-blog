---
title: Getting Started with Deno
date: 2020-05-30
description: Learn the basics of Deno
tags: ["deno", "LearnInPublic", "JavaScript"]
---

This will be the first in a series of posts looking at Deno, the new runtime environment written in Rust. These posts will introduce what Deno is, and why it might be of interest to developers. We'll explore getting a server up and running too with Deno.

Future posts in the series hope to cover these topics:
* Explore a more complex example and using TypeScript
* Dig into the standard modules for Deno
* show what external code is available for Deno and how to use it
* Explore how Rust and Javascript interact together in Deno
* Explore creating executables for replacements to bash scripts

## What is Deno?

[Deno](https://deno.land/v1) is a new runtime environment for JavaScript.  One of its main creators is Ryan Dahl, who previously created NodeJS and sees this as a new approach to JavaScript running outside the browser.  There's a lot to like now that version 1.0 has just been released on May 13, 2020.  Deno is written in Rust giving it a statically-typed base on which to build from.  Applications using Deno can be written in either Typescript or JavaScript.

Deno itself is a single executable file.  It acts as both a runtime and a package manager.  There are different API's included in this one executable.  If the API is already a web or JavaScript standard (fetch, setTimeout), the intention is it should interface and behave exactly the way it does in the browser.   Any API's that don't match to a web standard, like the file access functions, sit under a `Deno` namespace.  That separation of functionality frees developers from confusing API's in Deno versus a standard, or confusing developers whether a package is overriding common behavior. Additionally, there's a standard library that you can import methods from to extend the functionality.

You can install Deno by following the instructions [here](https://deno.land/manual/getting_started/installation). The overhead to installation seems small and light which is a great way to onboard developers quickly and easily without a list of dependencies, weird errors that have to be Googled.  It seems to just work.

## Deno is not a fork of NodeJS or NPM

Deno is very much a re-interpretation of NodeJS.  NPM packages are not supported.  Apparently, there is a compatibility layer effort underway, but one of the principals of Deno is how modules and third-party code is handled. For starters, Deno has a binding layer called `ops` that map to JavaScript promises so async/await is supported with the first release. These promises are actually built with Rust's Futures and behavior is mapped to a JavaScript promise.

Did you catch the sentence above that _NPM packages are not supported_?  Deno uses URLs to import external code into a project.  Those external URLs are locations for [ES Modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/).  Deno does not ask you to install an external library as Node does into node_modules folders.  It does have a local caching system so the modules are not externally sourced every time they are referenced. But the caching is system-based, so each project does not store its own dependencies. There's no package.json either or a central configuration file.

## Deno tools
A complaint might be that missing configuration files like `package.json` makes it harder to view at a glance what dependencies are used in a project.  Deno provides a command-line option `deno info` that generates a dependency graph for a file inspects all standard and third-party modules.  Since imports are URL-based, this works for local files as well as remote files.  Try it by executing the following after you install `deno`.

```shell
deno info https://deno.land/std@0.50.0/http/server.ts
```

Deno has an opinionated formatter too that you can use by invoking `deno fmt` on a file or project folder.  Since the code is TypeScript/JavaScript you can use your own formatter, but this is a nice addition for completeness.

A bundler and installer are included as well that compile a larger set of files into either a single JavaScript bundle or executable.  The installer is especially intriguing as the documentation suggests this might be a way to write command-line interfaces in JavaScript instead of bash or python.  This is perhaps one of the more intriguing aspects of Deno for me.  I may write something in bash (or modify more likely) once every six months or so.  I seldom remember the syntax for the `if` statements, so doing real work in bash is slow for me.  If I could do it in either JS or TS, I'd be more productive and likely to actually script some things that I do repetitively because I won't feel like I have to always reference docs or Stack Overflow on bash scripting.

## Stay outta my sandbox!
Your Deno project runs in its own sandbox.  By default, the sandbox is extremely limited on permissions.  So beyond import statements for external module loading, you must specify that your Deno code can create network connections.  You must specify that your Deno project can access the filesystem.  Further to that, you can even specify read-only or write-only access and even list out the files or directories that can be read or written.  That means no longer wondering what nested npm packages might be trying to do.  Mining bitcoin, stealing passwords, downloading malware can't happen in Deno unless you allow it.  This intentional security design is a huge boost to developers wanting to write secure code.  As it stands, there are probably consultants out there that can specialize in securing NodeJS or Docker projects given all the nasty ways that malicious agents can sneak into either running Docker containers or NodeJS projects that get built from basic tutorials and shipped out to production.  While some may see this as extremely limiting and cumbersome to specify every permission needed, as a developer who's built NodeJS apps for a large company concerned with security, having a secure-by-design application running saves a lot of heartache down the road when your app is ready to go to production and has to pass security scans and reviews.

## A simple web server in Deno
As many developers will explore Deno as a comparison to NodeJS, let's take a look at how to start up a simple web server.

```ts
import { listenAndServe } from "https://deno.land/std@0.50.0/http/server.ts";

function stripLeadingSlash(url: string): string {
  return url.startsWith("/") ? url.slice(1) : url;
}

function router(url: string): string {
    switch (url) {
        case "hello":
            return "Hello World!";
        case "":
            return `Hi! Try adding paths to the url to see different messages!\n`;

        default:
            return "Sorry, I can't help you!";
    }
}

listenAndServe({ port: 9000 }, (req) => {
  let { url } = req;
  url = stripLeadingSlash(url);
  const body = router(url);
  req.respond({ body });
})
```

While this is a simple example, you can see it's not complex to get a server up and running.  Let's walk through this to explain better.
```js
import { listenAndServe } from "https://deno.land/std@0.50.0/http/server.ts";
```
This is how Deno's standard library functions get imported.  If we left off the `@0.50.0` part of the url, we'd be pulling from whatever is in the default branch (probably `master`).  That doesn't matter for our purposes, but it's a good practice to version your url references so breaking changes aren't introduced once you are building and deploying applications.

```js
listenAndServe({ port: 9000 }, (req) => {
  let { url } = req;
  url = stripLeadingSlash(url);
  const body = router(url);
  req.respond({ body });
})
```
The function `listenAndServe` opens a connection on the port passed in and any requests that arrive on that port then get handled by the callback defined with that function. Deno has options already to handle TLS (https) traffic, but in our simple case, we just pass the function a port value and then the callback to tell Deno what to do with each request that comes in.  In our case, we strip the `url` of it's leading slash and then pass that value to a function to determine what the body of the response will be.  There's nothing Deno-specific about those helper functions.  In fact, you may have noticed that although Deno is written in Typescript, in this case, the code is just plain old JavaScript.  Deno supports either TypeScript or JavaScript so I have the freedom to test out quick prototypes in JavaScript and then change my extension to `.ts` and define types as I need to.

### How do I run this?
You should have Deno installed locally via one of [these](https://deno.land/manual/getting_started/installation) methods.  Then assuming the above code is saved in a file called `server.ts` (Or you cloned my repo [here](https://github.com/areinmeyer/deno-playground) and are in the root folder) you execute the following command in your shell of choice:

```shell
deno run server.ts
```
Did you get an error?  Remember back to me mentioning that Deno runs in a very protective sandbox?  We are telling Deno to set up a network connection and starting a server.  So we need to explicitly tell Deno that we allow it to access network commands by using the flag `--allow-net`.

```shell
deno run --allow-net=0.0.0.0 server.ts
```
That means that Deno can only access localhost (0.0.0.0).  If it tries to go to https://my.bitcoin.miner all outgoing requests will fail.  This works for local file access as well, where you may want to allow a temp or limited set of folders read/write access and no more.

### Summary

Deno has a lot of promise.  There's some confusion on my part how the third-party modules, standard library, and `deno` executable will all stay in sync and versioning between the three will work.  While the `deno` executable is now version 1.1,2, the standard library is still on version 0.59.  There are several pieces too that are hidden and only accessible under an `--unstable` flag.

The interplay between Rust, wasm, and JavaScript will be interesting to watch too.  The core pieces of deno are Rust-based, so will there be a time that we can refer to Rust crates directly?  That time may be now, as Deno publishes a few Rust crates but I'm not familiar with Rust enough to know if other Rust programs could use those and benefit from them.  That would be a big help as many npm modules currently aren't usable as they use the CommonJS module format.  Will that dampen development as users get frustrated with re-implementing working npm modules into a Deno-friendly format?

Deno should be a big contender in the developer landscape in the coming months.  The attention to security, stability, and performance are always good goals to have.  Developers have embraced the ideals it has, so as more and more features are turned on and interest grows, it will likely be a good-to-know toolkit for developers looking to build either API's or CLI's.