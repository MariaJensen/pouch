# Design docs
**Design docs** are docs whose `_id` value starts with the string `'_design/'`. 

These docs are not for storing information, but rather for holding functionality that can be utilized to extract information from the regular docs in the db. 

Examples of this kind of functionality are views, shows, lists, indexes, filters, validators and more. Between CouchDB, Cloudant and PouchDB it differs which are available. In PouchDB it is possibly only views. 

A design doc, besides from the mandatory keys `_id` and `_rev`, can then have a key named `'views'` whose value is an object that holds one or more view, a key named `'validate_doc_update'` whose value is an object that holds one or more validator function, etc. How exactly these objects are shaped, how the involved functions are invoked and what they do I will attempt to describe below. 

## Views
### Creating views
A **view** consists of a mandatory map function and an optional reduce function. Example of design doc that holds two views: 
```javascript
{
    _id: '_design/my_design_doc',
    _rev: '2-zyx123abc',
    views: {
        my_view: {
            map: 'my_map_function_string',
            reduce: 'my_reduce_function_string'
       }, 
       my_other_view: {
           map: 'my_other_map_function_string'
       }
    }   
}
```
It is important to note that the map function and reduce function are saved in the design doc in stringified form. When they are later on un-stringified and invoked by Pouch, it will be in a completely different scope than the one in which the design document is created. This means that they can only depend on their parameters and whatever is in scope when they are invoked. 

For the map function this means that its function body must contain no reference to anything outside of it except for the parameters of the function and the emit function which will be explained below.  

For the reduce function this means that its function body must contain no reference to anything outside of it except for the parameters of the function. 

(todo: Is it actually possible to pass parameters to the view when quering it?)
(todo: examples)

The design doc is saved to the database like any other document, and after it is saved, the views in it can be used to query the database. 

### Quering views
Let `db` be an instance of `PouchDB` and let `'_design/my_design_doc'` be the `_id` of a design doc saved in `db` which holds a view named `my_view`

Then you can query the view like so:
```javascript
  db.query('ddocname/viewname', [options], [callback])
```
By providing an `options` object you can decide weather a possible reduce function should be used in the query or not by setting the value of the `reduce` key to `true` or `false`. 

Furthermore you can format the output of the query in different ways by setting relevant keys. (TODO)

### Map functions 
A **map function** takes a doc from the database as its argument and returns an (possibly empty) array of objects.  

**`emit`** is a function that can be called from inside the map function body. It takes zero, one or two arguments. 

Each time the `emit` function is called inside the map function body, another element is added to the array that will be returned. The element is an object with three properties: 
* `id` will have the `doc._id` as its value.
* `key` will have the first argument passed to `emit` as its value. Or `null` in case `emit` was called with zero arguments.
* `value` will have the second argument passed to `emit` as its value. Or `null` in case `emit` was called with one argument.












