# Streams
Makes it easy to use various types of streams by giving a simple interfacing  
and allowing specification of their actions by passing a function.

## Whats the Use?
Use several types of streams (transform, read, write, counter) with minimal
configuration or syntax. Just need input and functions to define
transformations and output.

## installation 
npm install @jadesrochers/streams  
const streams = require('@jadesrochers/streams')  

## Usage
Four stream types are provided; read, transform, count, and write.  
The count stream is just a custom transform stream for tracking  
how many object passed through the stream.

#### Set up transform and write functions.
```javascript
let transfcn = n => (parseInt(n) + 1)
let writefcn = n => console.log(n) 
```

#### Create the stream objects, demonstrating all of them here.
```javascript
let reader = streams.fileStream('./testfile.txt') 
let transform = streams.transformStream(transfcn) 
let counter = streams.countStream(10, ' stream objects') 
let writer = streams.writeStream(writefcn) 
```

##### Using the split library so that the test file is broken into lines.
```javascript
const split = require('split2');
```

#### Create the test file
testfile.txt; put it in the directory you will run node from.
>  10
>  20
>  30
>  40
>  50
>  60
>  70
>  80
>  90
>  100
>  110
>  120
>  130
>  140
>  150
>  160
>  170
>  180
>  190
>  200


### Read the data and run it through the streams
```javascript
reader.pipe(split()).pipe(transform).pipe(counter).pipe(writer).on('finish', () => { console.log('Stream complete, closed'); process.exit(0)}).on('error',  () => console.log('Somthing went wrong'))
```

