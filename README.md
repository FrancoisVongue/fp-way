# FP-WAY
Simple functional programming library that works as you would expect.
> **Main purpose of the library is to**
> **reduce the amount of code that you need to write in your projects.**
> <br>and make it much more **readable**

# Type based structure
Library consists of **[core methods](#core-methods)** and namespaces that correspond to the following javascript types:

| namespace | javascript type |
|-----------|:----------------|
| bool      | boolean         | 
| num       | number          | 
| str       | string          | 
| obj       | object          | 
| arr       | array           | 


Each namespace contains curried methods that work on the corresponding type.

# Core methods

| Base fp methods       | Conditionals                            | Other                   |
|-----------------------|-----------------------------------------|-------------------------|
| [Curry](#curry)       | [Is](#is)                               | [DoNothing](#donothing) |
| [Identity](#identity) | [Exists](#exists)                       | [TypeOf](#typeof)       |
| [Const](#const)       | [IfElse](#ifelse)                       |                         |
| [Variable](#variable) | [When](#when)                           |                         |
| [Swap](#swap)         | [Unless](#unless)                       |                         |
| [Call](#call)         | [InCase](#incase)                       |                         |
| [ApplyOn](#applyon)   | [IndependendInCase](#independendincase) |                         |
| [Pipe](#pipe)         | [CanBeDescribedAs](#canbedescribedas)   |                         |
| [Compose](#compose)   | [IsOfType](#isoftype)                   |                         |
| [Not](#not)           |                                         |                         |

Note that some methods in this section have **aliases**. 
<br>For example **Const** and **Return** are the same method.

## Curry
Returns a curried version of a function. 
<br>
Returned function returns itself if there were no arguments passed.
<br>It may take not only one but **multiple arguments at a time**.
```ts
const add = (a, b) => a + b;

const curriedAdd = Curry(add);
const add2 = curriedAdd(2);     // returns (x) => 2 + x
const four = curriedAdd(2, 2);  // pass 2 args at a time
```

## Identity
Function that returns first argument passed to it
```ts
const Identity = x => x
```

## Const (aka Return), TRUE and FALSE
Const(Return) is a function that takes **two arguments** and returns the first one.
<br>**TRUE** and **FALSE** are aliases for Const(true) and Const(false) respectively.

Useful to use as a higher order function to return the same value no matter the input.
```ts
const Const = (a, b) => a
```
> **Note** that unlike examples in this tutorial, 
> actual functions in the library are **curried**. 
> <br>This is done to simplify code examples.

## Variable
Variable is a function that takes **two arguments** and returns the **second** one.

## DoNothing
Function that optionally takes a single argument and does nothing.
(in js terms that means it `returns undefined`).

## Not
Takes a predicate (a function that returns **boolean**) and returns a predicate <br>
that **returns true/false in opposite to the initial function cases**.

> **Note** that this function is one of a few that are **not curried**.

## Is
Function that takes two arguments and checks if they are equal using **strict equality**.

## IsNot
```ts
const IsNot = Not(Is)
```

## Exists
Function that takes a single argument and checks if it's equal to **null** or **undefined**
<br> using strict equality. Any other value is considered as existing.

## NotExists
```ts
const NotExists = Not(Exists);
```

## Swap
Function that takes a **binary function** and returns a binary function that
<br>does the same thing but **takes second argument first**.
```ts
const append = (appendingString, str) => str + appendingString;
const result1 = append('Hello ', 'world'); // "worldHello "

const prepend = Swap(append);
const result2 = prepend('Hello ', 'world'); // "Hello world"
```

## Call
Function that takes a function and an argument and returns 
<br>**the result of calling that function with the argument**
```ts
const Call = (f, x) => f(x)
```

## ApplyOn
```ts
const ApplyOn = Swap(Call)
```

## IfElse
Function that takes four arguments:
1. unary predicate
2. unary function
3. unary function
4. value

First, value is being passed to the predicate, if it returns 
1. **true** then the function will return the result of calling the first function with the value
2. **false** then the function will return the result of calling the **second function** with the value

## When
Function that takes three arguments:
1. unary predicate
2. unary function
3. value

First, value is being passed to the predicate, if it returns
1. **true** then the function will return the result of calling the function with the value
2. **false** then the function will return the value itself

## Unless
Function that takes three arguments:
1. unary predicate
2. unary function
3. value

First, value is being passed to the predicate, if it returns
1. **true** then the function will return the value itself
2. **false** then the function will return the result of calling the function with the value

## InCase
Function that takes two arguments:
1. An array of binary tuples where every tuple contains:
   1. Unary predicate
   2. Unary function
2. value

Value is passed to every unary predicate in order.
<br>Function returns the result of passing value to the Unary function 
<br>of the first tuple where predicate returns true.

This function works similar to switch..case construction.
```ts
const value = 22;

const FORTY_FOUR = InCase([
    [Is(2) , (v) => v - 2],
    [Is(22), (v) => v * 2],  // first tuple where predicate returns true for the value
                             // value is multiplied by 2 and returned
    // using TRUE as the predicate for the last tuple is simmilar to using "default" in a switch case
    [TRUE  , Return(8)],     
], value)
```

## IndependentInCase
Function that takes two arguments:
1. An array of binary tuples where every tuple contains:
    1. Unary predicate
    2. Unary function
2. value

Works simillar to InCase but returns 
<br>**an array of results** of passing value to unary functions where predicate returned `true`

## CanBeDescribedAs
Function takes two arguments:
1. An array of unary predicates
2. value

Checks if every predicate returns true when called with the value.

## Pipe
Function takes two arguments:
1. An array of unary functions 
2. value

Passes value to the first function and then the result to the next one, 
<br>invoking every function in order and returning the result of the last one

```ts
const Add = a => b => a + b;
const MultiplyBy = a => b => a * b;

const twelve = Pipe([
    Add(2),
    MultiplyBy(3),
], 2)
```

## Compose
Function takes two arguments:
1. An array of unary functions
2. value

Works similar to `Pipe` but **calls functions in the reverse order**.

## IsOfType
Functions takes two arguments:
1. string representing a type, which can be
   `| "undefined"
    | "null"
    | "object"
    | "boolean" `<br>`
    | "number"
    | "bigint"
    | "string"
    | "symbol"
    | "function"
    | "array" |`
3. a value

Validates that value is of specified type. Works simillar to `typeof` 
but works correctly for **null** and **array** values.

## TypeOf
Unary function that takes value and returns its type, 
<br>which can be one of the aforementioned strings.

# Bool
## IsBool
Unary predicate that takes one argument returns true if argument is either true or false.

## And
Binary predicate that takes two boolean arguments and returns true if both of them are true.
```ts
const And = (a, b) => a && b
```

## Or
Binary predicate that takes two boolean arguments and returns true if either of them is true.

## Not
Unary predicate that takes one argument returns true if argument is false.

# Num 
## IsNum
Unary predicate that returns true if argument is of type number.

## IsQuotientOf
Binary predicate that returns true if second argument can be divided by the first without remainder.

```ts
const IsQuotientOf = (a, b) => b % a === 0

const True = IsQuotientOf(13, 39)
```

## IsInt
Unary predicate that returns true if argument is integer.

## IsNaN
Unary predicate that returns true if argument is NaN.

## Gt, Gte, Lt, Lte
Binary predicate that compares first argument to the second one.
1. Gt - greater than
2. Gte - greater than or equal
2. Lt - less than 
2. Lte - less than or equal

```ts
const True = Gt(2, 3); // three is greater than 2 
```

## IsPos, IsNeg
Unary predicate that returns true if argument is greater than 0 (IsPos) or less than 0 (IsNeg)

## InRangeEx
Function takes three numeric arguments:
1. min
2. max
3. value

And returns true if value is greater then min and less then max.

## InRangeInc
Same as above but **value can also be equal** to the min or max.

## Negate
Unary function that negates a numeric value

## Inc, Dec
Increment (+1) and decrement (-1)

## AtMost
Binary function takes two arguments:
1. max
2. value

And returns max if value is greater than max and value if it's not
```ts
const AtMost = (max, x) => x > max ? max : x
```

## AtLeast
Binary function takes two arguments:
1. min
2. value

And returns min if value is less than min and value if it's not

## Add, Subtr, MulBy, DivBy, Mod
Binary functions that correspond to math operators (+, -, *, /, %)

## Diff
Binary function that returns difference benteen two numeric values as 
**absolute(positive) value**

## Floor
Unary function that rounds a value to the largest integer less than or equal to the value.

## Ceil
Unary function that rounds a value to the smallest integer greater than or equal to the value.

## ToInt
Unary function that removes decimal part of a number

## Abs
Returns positive representation of a number

## ToExtent
Function takes two arguments: 
1. extent
2. value

And returns value raised to the extent
```ts
const ToExtent = (e, x) => x**e;
```

# Str
## ToUpperCase, ToLowerCase
Unary function that turns a string into it's upper/lowercase version.

## Trim, TrimLeft, TrimRight
Unary function that removes whitespaces from a string on **both** sides or **left** side or **right** side respectively.

## CharAt
Unary function that takes an index(integer) and a string and returns 
a character at the index.

## CharCodeAt
Unary function that takes an index(integer) and a string and returns
a number in range 0 - 2^16 that represents UTF-16 code.

## Slice
Function that takes three arguments:
1. start
2. end
3. value

Extracts a section of the value and returns it as a new string. 
<br>Start and end are integers and can be negative.

## SplitBy
Binary function that takes two arguments
1. splitter
2. value

The split() method divides a String into an ordered list of substrings, 
<br>puts these substrings into an array, and returns the array.  
<br>The division is done by searching for a pattern; where the pattern is provided 
<br>as the first parameter in the method's call and can be **either Regex or a string**.

## ConcatWith
Function takes two strign arguments and returns the result of appending first argument to the second one.
```ts
const ConcatWith = (s1, s2) => s2 + s1; // note that s2 comes first
```

## OccurrencesOf
Function takes two arguments:
1. regex 
2. value

Returns an array of substrings of the value string that matched the regex.

## Matches
Binary predicate that takes a Regex and a string and returns true if 
string matches the regex.

## IsOfLength
Binary predicate that takes a number and a string and returns true if 
string length equals to the first argument.

## StartsWith, EndsWith
Binary predicate that takes two strings and returns true if 
second string starts/ends with the first one.

# Obj
## Keys 
Unary function that returns enumerable keys of an object.

## Entries
Unary function that returns enumerable key-value pairs of an object as an array of binary tuples.

## FromEntries
Unary function that takes an array of binary tuples where first values is a string 
and returns an object created using these entries.

For every tuple, first value (string) becomes an object key and second value becomes 
this key's value.

## DeepCopy
Unary function that returns a deep copy of an object, meaning that changing the result 
wont change the object that you passed to the function as argument.

## WithDefault
Binary function that takes two arguments:
1. defaultObject
2. object

It returns a deep copy of the result of merging these two objects into one, with the 
<br>**properties of the second having higher precedence**.
> **Note** If both objects have a nested object under the same key, the objects merge as well

```ts
const defaultCat = {
    name: 'Jonny',
    age: 1,
    cute: true,
    parent: {
        name: 'Jonny Jr',
        age: 5,
    }
};
const cat = {
    name: 'Malcolm',
    parent: {
        name: 'Malcolm Jr',
        cute: false
    }
}

const result = WithDefault(defaultCat, cat);

const ResultWillBe = {
    name: 'Malcolm',       // overriden by cat
    age: 1,                // taken from default
    cute: true,            // taken from default
    parent: {
        cute: false,       // taken from cat
        name: 'Malcolm Jr',// overriden by cat
        age: 5,            // taken from default
    }
}
```

## Impose
```ts
const Impose = Swap(WithDefault)
```

First object's properties become more important.

## Pick
Binary function that takes two argumetns:
1. array of strings 
2. object

Creates a new object with only the keys specified in the first argument.

## Exclude
Same as pick but excludes properties from object instead of picking them.

## Map
A binary function that takes two arguments: 
1. map specification
2. object

It **maps one object(type) to another**.

Map specification looks like this:
```ts
export type ObjectMapper<T1> = (value: any, obj: T1) => any;
export type ObjectMapSpec<T1, T2> = {
    map: 
        [
            keyof T1 | '', 
            ObjectMapper<T1> | ObjectMapSpec<any, any>, 
            keyof T2
        ][];
    transfer?: Extract<keyof T1, keyof T2>[],
    allowNull?: boolean
}
```
What these specification properties mean: 
1. **map**<br>
    is an array of **ternary tuples** that look like this:
    1. key of the source object or an **empty string in case you want to create a new key in the resulting object** 
        <br> as opposed to mapping source key to a target one.
    2. objectMapper function to map one key to another or **another map specification to map one object to another**
    3. key of the target object

2. **transfer**<br>
    an array of keys that should be mapped using `Identity` function,
    meaning their value will not change in the resulting object.
3. **allowNull** <br>
    specifies whether this specification is able to handle null value as an object (by default it doesn't),
    for this to work, every object mapper function must handle case where both value and object are null and 
    **every nested map specification must also allow null value**
   
[//]: # (todo: add deepcopy to the map function)
