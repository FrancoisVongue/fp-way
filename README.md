# fp-way
Simple functional programming library that works as you would expect.

# Layered architecture of functions
## Order of layers
0. basic fp functions
1. boolean
2. numbers
3. arrays
4. strings
5. functions
6. objects
    
Each type has functions that ... it
    1. translate (from other types, includes `creation`)
    3. validate (conditions)
    4. transform (to the same type but different properties)


...More examples for all types will come with time.

# Object
## Validation using specSummary
Let's see how we can validate objects with ease using `fp-way`.

Let's say we have a `Person` entity that we want to validate.
We can create a spec for it that looks like this:
```ts
const personSpec = {
    name: [ 
        [isString, 'name must be a string'],
        [test(/[a-z]{2,20}/i), 'name must consist of latin letters and be from 2 to 20 characters long']
    ],
    age: [
        [isNumber, 'age must be a number'],
        [inRange(8, 90), value => `Age must be in range between 8 and 90 but was ${value}`]
    ],
}
```
We define an object with properties that must match with properties of
a desired object. 
Instead of a value, we assign a set of `rule entries` to every property.

Each `rule entry is a tuple` that contains two values in the following `order`
1. `Predicate` that takes a single value
2. Message, which can be a `string` OR a `callback` that takes value and returns 
    the message.
   
Then let's say we get the following object from the client:
```ts
const person = {
    "name": "Mandela",
    "age": 222
}
```
As we have constructed the `spec`, validating objects coming from the client
becomes a breeze, we just have to pass both our spec and an object to
`specSummary` method
```ts
specSummary(personSpec, person);
```

This method returns a summary that allows us to easily inspect 
possible validation errors. In this concrete example summary will look
like this:
```json
{
    "name": [],
    "age": [ "Age must be in range between 8 and 90 but was 222"]
}
```

Now that was easy.
But what if we want to validate more complex objects that `contain other objects`?

### Nested validation
To validate nested objects, `instead` of passing a set of rule entries,
we `simply pass another spec`. Let's say we want to create another 
entity called `Parent` that contains kids that must satisfy `Person` spec.

For that we can create the following spec
```ts
const parentSpec = {
    ...personSpec, 
    kid: personSpec 
}
```

Now, parent must be a person, that has a `kid` property that must contain
a person object as well. Let's `test` it with the following object
```ts
const parent = {
    "name": "Mandela",
    "age": 22,
    "kid": {
        "name": 1,
        "age": 0,
    }   
}
```
Hmmm... quite strange properties for kid... 
What does our library have to say about it?
```ts
specSummary(parentSpec, parent);
```
Voila:
```json
{
    "name": [],
    "age": [],
    "kid": {
        "name": [
            "name must be a string",
            "name must consist of latin letters and be from 2 to 20 characters long"
        ],
        "age": [ "Age must be in range between 8 and 90 but was 0" ]
    }
}
```
Stay tuned for more updates on this easy to use library that **works as you would expect**
