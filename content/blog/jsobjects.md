---
title: JavaScript's tricky Object mutation
description: JavaScript Objects and mutations
date: 2020-02-19
tags: ["JavaScript", "es6", "LearnInPublic"]
---

One "trick" to JavaScript that used to produce a lot of errors for me was the difference in assigning primitives to variables versus assigning Objects to variables.  But, like a magician's sleight of hand, the "trick" disappears when you understand the sleight-of-hand.

Let's explain the problem with a couple of examples.

When you declare a variable and assign it a primitive value, you do something like this:

```js
let a = 1;
let b = a;
b = b + 1 //b is 2, a still is 1
```
But when you do the same thing with Objects, this happens:

```js
const a = { "foo": 1, "bar": 2 }
const b = a
b.foo = 20 //b is { "foo": 20, "bar": 2 }, a ALSO is { "foo": 20, "bar": 2 }
```

Wait, what!?
<div style="width:100%;height:0;padding-bottom:92%;position:relative;"><iframe src="https://giphy.com/embed/12NUbkX6p4xOO4" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/shia-labeouf-12NUbkX6p4xOO4">via GIPHY</a></p>

### Assigning primitives to variables
In most cases, when you assign what's considered a primitive value (numbers, strings, symbols, booleans) to a variable, you are assigning the value.  Unless you're using the `const` keyword in declaring the variable, you can change the value of the variable like this:
```js
let a = 1;
a = "one";
console.log(a) //"one"
```
You can't though do this:
```js
let a = "one"
a[1] = "l"
console.log(a) //"one"
```
But you can do this:
```js
let a = 1
a = a + 1 //alternatively, a++
console.log(a) //2
```
The distinction may be subtle.  The variable `a` points to a primitive, and that primitive value can be reassigned (since we used `let`).  The primitive itself can't be changed.  The second example above is trying to do that.  In the first and third examples, we are changing the value of what `a` is pointing at.  Don't think of the third example as incrementing `a`, instead think of it as changing `a` to be the result of `a + 1`.

### Assigning Objects to variables
The magic appears when assigning Objects to variables. Changing an element in an Object or an Array is valid syntax and common.  
 
Let's look at a few Object assignment examples:

```JavaScript
const array = ["a", "b"]
array[0] = "c"
console.log(array) //"c", "b"
```

```JavaScript
let array = ["a", "b"]
array = ["A", "B"]
console.log(array) //"A", "B"
```

```JavaScript
const array = ["a", "b"]
const newArray = array
newArray[0] = "A"
console.log(newArray) //"A", "b"
console.log(array) //"A", "b"
```

Note that the contents of Arrays (which are a specific type of Object) can be mutated.  Using `const` in the second example results in a "TypeError: Assignment to constant variable", as that replaces what `array` is assigned. That violates the concept of `const`, which prevents a re-assignment of values (or Objects) to another value or Object.

So what's happening in the third example?  Are we creating pointers to Objects?  Are Objects created and passed around by-reference?

### Sharing is ~~caring~~ confusing
We won't dive into memory management, whether variables are passed by [reference](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_reference) or [value](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value), because I don't feel confident to explain it that well yet. 😜 My limited understanding at this point is that Objects get created on the heap in memory, and then a pointer to that location is stored on the memory stack, the place where JavaScript wants to get variables. There's a lot of nuances, and the distinction of Call-by-Reference and [Call-by-Share](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing) is not one I can articulate.  

When Objects are created and then referenced by multiple variables like in the examples previously, what occurs is the variables point to the same Object in memory.  That's why this first example below returns true, while the second example returns false.  The Objects in the first example point to the same Object, while the second example has created two separate Objects. Doing a simple assignment of a variable that is pointing to an Object makes both variables point to the same Object and does not create a second, separate Object.  

```JavaScript
//Both a and b point to the same Object
const a = { "foo": 1, "bar": 2 }
const b = a
console.log(a === b) //true
```

```JavaScript
//Both a and b point to different Objects
const a = { "foo": 1, "bar": 2 }
const b = { "foo": 1, "bar": 2 }
console.log(a === b) //false
```

### So what's a dev gotta do?
There are several avenues your code can take, depending on the type of Objects you are using.  We can copy the Object into another Object.  A new way that's been added in TC39 Stage 4 is the Object Rest/Spread Properties.  It uses the `...` spread syntax that's become common in recent years with destructuring and retrieving nested values from Objects.  Our above example becomes:

```JavaScript
let a = {"foo": 1, "bar": 2}
let b = {...a}
b.foo = 20 //b is { "foo": 20, "bar": 2 }, a REMAINS { "foo": 1, "bar": 2 }
```

The same outcome can be achieved by using `Object.assign`.  That creates a new Object.
```JavaScript
let a = {"foo": 1, "bar": 2}
let b = Object.assign({}, a)
b.foo = 20 //b is { "foo": 20, "bar": 2 }, a REMAINS { "foo": 1, "bar": 2 } 
```

Note here that assign takes an empty Object.  Object.assign mutates the first parameter as well as returning an Object.  You can pass as many Objects as you want to assign, but as you add Objects to the right of the list, those take precedence over the Objects to the left.  

### Hang on, more problems ahead!
There's some problems with the spread operator or the Object.assign that you need to be aware of.  Are you working with an Object that has nested Objects?  Well, get ready, those aren't copied fully by either of the above methods!  Nested Objects are still shared by the original Object. Only the top-level (or shallow) keys are truly copied to the new Object.
```JavaScript
let a = {"foo": 1, "bar": 2, "baz": {"foo": 3 } }
let b = Object.assign({}, a)
b.foo = 2 
console.log(b.foo) //2
console.log(a.foo) //1
b.baz.foo = 20 //b is { "foo": 20, "bar": 2, {"foo": 20 } }, a is also { "foo": 1, "bar": 2 , {"foo": 20 } } 
```

To avoid the problem in the previous example, you would have to do this:
`let b = JSON.parse(JSON.stringify(a))`
But that works if you are using very simple data types.  Dates, functions, Maps, Sets, all would not be copied over as you would expect them to be copied over.  

The best bet is to examine or use the lodash method [cloneDeep](https://lodash.com/docs#cloneDeep).  If you don't want lodash, you can do something similar, but make sure you traverse your Object all the way.  In other words, don't go it alone, use a tried and tested external library if possible.

### The non-simple answer
What I've started doing now when I am thinking about data structures is to try and avoid nesting Objects inside of Objects to prevent some of these accidental mutations on the original Objects. If I can keep state as local to React components or functions/classes that tends to avoids the need to have complex data structures.  If I have to have complex data structures, I try to make sure that in passing parameters to functions I'm slicing out what I need only for that function.  

It is easy to fall into the trap of passing large data structures around to functions to avoid listing out 5 or 6 parameters, but when that occurs or I find myself wanting to pass large structures I stop and try to understand how I got to this point and refactor away the need to have large structures passed around or passing a long list of parameters to a function.  

It's much easier to spot the "magic" now that I understand better how Objects get created and stored. The magical errors have started to vanish and because of it, my code appears to be simpler.

### References
In researching this problem, I stumbled upon several good articles and resources. The original inspiration for this article was from Dan Abramov's [JustJavaScript](https://justJavaScript.com/) as I came across this very problem in old code I had written and this is my clumsy attempt to write about it and better understand it.
* [MDN JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) Simply a great resource for all things JavaScript
* [Dr. Axel Rauschmayer's JavaScript for Impatient Programmers](https://exploringjs.com/impatient-js/index.html)
* [Call by Sharing](https://wafy.me/tech/2016/07/02/call-by-sharing.html)
