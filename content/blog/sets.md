---
title: "JavaScript Sets"
date: "2020-03-31"
description: "JavaScript Sets Deep Dive"
tags: [ 'JavaScript', 'ES6', 'LearnInPublic' ]
---

A goal this year has been to explore more nooks and crannies of JavaScript.  I had never been exposed to Sets until I worked on the Advent of Code 2019 and came across some solutions that used them effectively.  So now that I've explored [Maps](https://areinmeyer.dev/maps) I want to take a deeper dive into Sets to see if they can be useful to me in my daily programming.

Sets are collections of unique values. Sets share a lot of similarities with Maps as they were introduced at the same time. The values in a Set can be any primitive or Object, and a mix of any type.

```js
const mixed = new Set()
mixed.add("1")
mixed.add(1)
mixed.add([1,2])
mixed.add({"one": 1})
console.log(mixed)
//Set { '1', 1, [ 1, 2 ], { one: 1 }
```

## Creating Sets
Sets have many of the same properties that Maps do and are created similarly.

```js
const s = new Set() //An empty Set
const a = new Set([1,2,3]) //A Set populated from an Array
const b = [...a] //An Array from a Set
console.log(a)
// Set { 1,2,3 }
console.log(b)
//[ 1,2,3 ]
```

## Manipulating Sets
You can add and delete elements from a Set.  The `add()` method returns the new Set with the added element. The Set is also mutated so the return value need not be captured.  The `delete()` however, returns whether the Set contained the element requested to be deleted as `true` or `false` as well as mutating the Set.  Be careful with these differences!  I might expect that the mutated Set is always returned and try to capture that in a new variable, but that would lead to a nasty bug in your code.

The `has()` method checks whether the element is present in the Set or not and returns `true` or `false`.  There's a `clear()` method as well, that removes all the elements from the Set.  Using `clear()` does not seem too useful?  I cannot think of a good example in which I would want to keep using the same Set over and over but instead of creating a new object would want to clear it instead.  Maybe there are performance considerations?

### Adding
```js
const s = new Set([1,2,3])
const duplicateOfS = s.add(4)
console.log(s) //Set { 1, 2, 3, 4}
console.log(duplicateOfS) //Set { 1, 2, 3, 4}
const itHas4 = s.has(4)
console.log(itHas4)//true
```

### Deleting
```js
let is4Deleted = s.delete(4)
console.log(is4Deleted) //true because the Set contained 4
is4Deleted = s.delete(4)
console.log(is4Deleted) //false because 4 was previously deleted from the Set
console.log(s)
// Set { 1,2,3 }
```

The number of items in a Set are easily determined by using the `size` property.  This returns an Integer relating to the number of elements in the Set.
```js
const s = new Set([1,2,3])
s.size //3
s.clear()
s.size //0
```

## Iterating through a Set
Like Maps, Sets have a plethora of ways to iterate over the values.  The `keys()` and `values()` methods are both present, though, for Sets, they are equivalent since Sets don't store key/value pairs.  There is the `entries()` method that exposes a 2 element array to be consistent with `Map.entries()` though both elements in the array are the same value.  The default iterator returns the next item in the Set. The order of insertion is preserved in any of the iterator methods.

### Default iterator
```js
const s = new Set([1,2,3,4,5])
for (let item of s) {
    console.log(item * 2)
}
//2
//4
//6
//8
//10
```
This appears to be the simplest and cleanest method for iterating.  It's intuitive with the other iterators for Arrays, Objects, and Maps.

### Iterating with keys()
```js
const s = new Set([1,2,3,4,5])
//values() could replace keys() here without changes to the output
for (let item of s.keys()) {
    console.log(item * 2)
}
//2
//4
//6
//8
//10
```
I think the `keys()` and `values()` methods here are just present for consistency with Maps.  I do not see any benefit in using this way to iterate over the other ways.  The `keys()` method is really just syntactic sugar to convert the Set into an Array.

### Iterating with entries()
```js
const s = new Set([1,2,3,4,5])
for (let [item] of s.entries()) {
    console.log(item * 2)
}
//2
//4
//6
//8
//10
```
This is fine, but could be confusing syntax because you have to wrap the current element (in the example, `item`) in an array because `entries()` returns 2 values in an Array.  You also have to call the method explicitly, whereas the default iterator mentioned earlier doesn't have either the array or the method call.  The Array methods of `map()` and `filter()` are not available, though converting to an Array is possible to gain those methods.

## Sets killer feature

The killer feature for Sets is that it is comprised only of unique elements.  I will discuss some quirks with equality shortly, but first, let us look at how we can take an Array and turn it into a Set that contains only the unique elements.
```js
const fullArray = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
console.log(fullArray) //15
const s = new Set(fullArray)
console.log(s.size) //5
console.log(s) //Set {1,2,3,4,5}
s.add(1)
s.size //5
```
That's it.  Creating a new Set with an Array will remove all the duplicates.  Any subsequent adds of an existing value will not change the size of the Set.  Even if you would prefer to not use Sets in your project often, you could create a simplistic utility function like the following:
```js
function dedupe(array) {
    return [...new Set(array)]
}
```
This function converts an existing Array into a Set, removing any duplicates and then converts the Set back into an array using the spread operator. The example is stripped down for simplicity.  Likely any production level code would want to validate that the parameter is actually an Array.

### Equality limitations with Sets
Let's discuss some possible limitations though with assuming Sets will always dedupe any types of Arrays.  For the most part, the triple equality test (`===`) is used, so Objects that contain the exact same properties won't be considered equal.  But `NaN` in this case does equal `NaN`.  Usually, that is not the case, as you can easily see yourself if you type `NaN !== NaN` into a node or browser console.  But Sets will only contain 1 element set to `NaN`.  So our `dedupe` function above will not create an Array of only unique objects unless those objects actually point to the same Object references.

## Tidbits
An interesting note about Sets is that unlike Maps, Sets have no accessor method.  No find, index or other similar methods exist for Sets.  The only way to access values once they are added is to either iterate over the Set or, more likely, to convert the Set back into an Array and use one of the Array built-in methods.

There's also a lot of examples I found that talk up the mathematical benefits of using Sets, like finding unions, intersections, etc. between multiple Sets.  A Set in mathematical terms does not contain duplicates, so if you're working in a field that adheres to those principles, Sets could be a good data structure.

## Use
As noted previously, Sets are a really nice way to get a unique list of primitives like Integer or String.  They become less useful when dealing with a list of Arrays or Objects since equality in Objects is not about the Object properties but the reference itself.  In a prior project, we had issues with users creating widgets with the same name.  There was no referential integrity issue (The widget name was not a key as a UUID was created instead), but it became confusing if multiple users created a widget with the same name over and over.  Using Sets, we could have done a validation check on the library by gathering up all the name properties and creating a Set, validating that the new widget name wasn't already taken.  Conversion to Arrays and back into Sets is simple to do, so there's a lot of benefit to switching back and forth depending on the use case in the code between Arrays and Sets. This seems to be a great addition to the JavaScript landscape and one that I will reach for now more frequently now that I know more about them!