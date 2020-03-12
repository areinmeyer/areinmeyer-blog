---
title: JavaScript Maps
date: 2020-03-12
description: Trying to understand Maps in JavaScript
tags: [ "JavaScript", "Maps", "LearnInPublic" ]
---
A goal this year has been to explore more nooks and crannies of JavaScript.  I've never used Maps in production code and had not really come across them much until recently.  Maps may not seem very useful above and beyond Objects, but there are a few key features that can make Maps useful in some circumstances. Maps were introduced in [ES6](http://es6-features.org/#MapDataStructure) and have support in most recent browsers.

### Creating a Map

Maps can be created in 2 different ways.  Either call the empty constructor
```js
const thisIsEmpty = new Map()
console.log(thisIsEmpty.size) // 0
```

Or you can pre-populate the Map from another Map or Array.
```js
const fromArray = new Map([["a","foo"], ["b","foo"], ["c","foo"]])
console.log(fromArray)
// Map { 'a' => 'foo', 'b' => 'foo', 'c' => 'foo' }
```

### Map contents

Maps get and set values with a `get` or a `set` method on the Map instance.
```js
let list = new Map();
list.set("foo", 123); // Map { 'foo' => 123 }
list.size; //1
list.get("foo"); //123

```
A nice feature is the `has` method.  The `has` allows the code to check if a property exists in the Map and returns `undefined` if it's not present.  This can be useful when you have a Map that may not always have keys present.  The syntax seems easier to understand then chaining checks on an Object.

```js
let list = new Map();
list.set("foo", 123);
list.has("foo") //true
list.has("bar") //false

let obj = { "foo": 123}
if (obj && obj.foo) {
  console.log(obj.foo)
}
console.log(obj.bar) //undefined
```

Maps can use any value for a key like a function, object or any primitive, unlike Objects that only allow a String or Symbol.
That means that the keys of a Map could look like this:
```js
const myFunc = () => {
  return 42;
}
let list = new Map();
list.set(myFunc, "This is a function!");
list.get(myFunc) //"This is a function!"

```
How useful is this?  To be honest, having functions or Objects as keys do not seem like a terribly common use case.  There are some interesting applications of storing counts or some cached values as the value of a Map where an Object is a key.  Then you can store information about the Object and associate the data but not have to store the data in the Object itself. That allows the data to be loosely associated with the actual Object.  If the data being associated with the Object becomes unnecessary it can be easily deleted without trying to modify the object.

But in that case, there's a [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) that is likely the better option for the previous case.  Objects get garbage-collected after they are out of scope and cannot be referenced anymore.  But Maps hold onto their references of Objects and so Objects that are a key of a Map aren't garbage collected.  WeakMaps behave the same as Maps, except their hold onto Objects that are used as keys are weak (hence the name!) and so allow the garbage collection to remove the reference to the Object from the WeakMap as well.  That means the size of your WeakMap could unexpectedly change if your Object key suddenly gets garbage-collected.

A good example of the above scenario would be keeping track of a list of users engaged in a chat and displaying the count of users somewhere on the screen.  As users come into the chat room, you might add the user object as the key and maybe a temporary nickname to a WeakMap, using the `size` property to display the active users in chat.  As the user leaves the chat, assuming they leave the app, the WeakMap would allow the user object to be released and the `size` would update automatically.  That may not be the best implementation, but it is an example of how one might use Maps/WeakMaps with Objects as keys.

### Map Size
Maps have a property `size` that will report the number of keys in the Map.  So determining the number of items in the Map is always just one line of code.
```js
let mapsize = new Map([['a',1], ['b',2],['c', 3]])
console.log(mapsize.size) //3
```
This is a great feature of Maps.  Arrays have the `length` property, which is also a one-liner.  But Objects don't have a built-in method for determining the length or size of the Object and has to be calculated manually.  It still can be one-line, but it involves first getting the keys from the object and then determining the length of the keys array.

```js
let objsize = {'a': 1, 'b': 2, 'c': 3}
console.log(Object.keys(objsize).length) //3
```

### Order Retention and iteration
Maps retain their order of insertion, so retrieving the list of keys, values or entries is always deterministic.  Objects can largely behave the same way the last few years, depending on the JS engine you are using, but that's only if you have the same types of keys in your Object.  If the Object contains a mix of strings and symbols, there's no guarantee of order preservation, and in fact, you have 2 separate methods to return the keys.
```js
const obj = {}
let sym = Symbol('sym')
let bol = Symbol('bol')
obj[sym] = 'first'
obj[bol] = 'second'
obj.foo = 'third'
obj.bar = 'fourth'
let stringKeys = Object.keys(obj) //[ 'foo', 'bar' ]
let symKeys = Object.getOwnPropertySymbols(obj) //[ Symbol(sym), Symbol(bol) ]

//But with Maps...
const mixedMap = new Map()
mixedMap.set(sym, 'first')
mixedMap.set("foo", "second")
mixedMap.set(bol, "third")
mixedMap.set("bar", "fourth")
mixedMap.forEach((value, key) => console.log(key, value))
//Output
//Symbol(sym) first
//foo second
//Symbol(bol) third
//bar fourth
```

As seen in the preceding example, you can iterate over entries with the `forEach` method, which takes a callback function as an argument, allowing both key and value as parameters.  Note that value is the first parameter in the callback.  `forEach` returns void, so sadly it can't be chained with any other functions.  The `keys()` and `values()` methods are also present and behave much in the same manner as the related Object methods.

Another way to iterate is to use the `entries` method.  Using the preceding `mixedMap` again we could use `entries` like this:
```js
for( const entry of mixedMap.entries()) {
  console.log(entry)
}
//Output
//Symbol(sym) first
//foo second
//Symbol(bol) third
//bar fourth
```
Another(!) way to iterate is using the default iterator.
```js
for( const [key, value] of mixedMap) {
  console.log(key, value)
}
```
My personal preference is in either the `forEach` or default iterator with a for loop.  I think they balance terseness as well as patterns that are recognizable based on other Object and Array methods.  Reliable order may not always be a concern, but when it is, Maps seem to provide the only way to have confidence in that order of insertion being preserved, especially if there is a chance that keys will have different data types.

Objects can only be iterated on by first retrieving the keys (or possibly values) of the Object and iterating on those.  If your data structure is an Array of Objects or a nested Array, you also have the option of using the `map` method that is built-in with Arrays.


### Performance
MDN mentions that Maps have better performance over Objects in insertion and deletion. In a naive but simple test, this proved out.  Running 1,000,000 insertions and deletions in the same Map and Object, I saw these times reported.

| Action    | Map Time (ms) | Object Time (ms)|
| ----------|----------|-------------|
| Insertion | 149      | 150         |
| Deletion  | 167      | 486         |

Here's the code I used.  Feel free to point out any shortcomings! While there are some differences in time on insertion, the deletion can't be accounted for by timer of my machine or insignificant differences.  I ran it several times, and each run reported roughly the same times, within a few milliseconds of each.  The insertion times often were negligible, but the deletion was always a significant difference.

`gist:areinmeyer/8d9d8d00d6d47abd77d5a0fb36cfc3b1#JSMapsPerfTesting.js`

### Drawbacks

You can't `map` or `filter` a Map.  To do that, you would have to convert the Map into an Array or Object first, then use the built-in functions.  The resulting Array or Object could then be turned back into a Map if so desired.  Whatever gains noted above though likely are lost in doing a conversion back and forth from Map to Object or Array.  Maps have an overhead of learning too most likely as it is a newer feature of the language that may not be widely adopted by teams.

### Why use Maps over Objects?

The biggest draw to using Maps over an Object is the benefit of using something like an Object or Date as the key instead of resorting to a string or Symbol.  Being able to quickly and easily see the size of the Map without calling a function is also useful. The `has` method associated with a Map is a nice interface for checking if the key is present in the Map.  If you are doing a fair amount of deletions in Objects, Maps might also be more performant.

The reality is Maps are probably not something that is going to be used every day by most developers, so there is definitely a mental overhead of introducing it into a shared environment.  Built-in iterables for Map and a property checking of `has` is beneficial in many uses though, so I definitely will be reaching for Maps now that I know more about them.  It's also a great way to share knowledge with a team and introduce them to this new data structure.