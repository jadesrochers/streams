// Built in Libraries
const fs = require('fs');
const R = require('ramda')
const { Writable, Transform, Readable } = require('stream');
const datapulse = require('@jadesrochers/datapulse')

// Get a stream that originates from a file
const fileStream = (datapath, encoding = 'utf8') => {
  var readStream = fs.createReadStream(datapath)
  readStream.setEncoding(encoding)
  return readStream
}

// Use to push data to a stream. readStream.push() starts data through
// the stream.
const readStream = new Readable({
  objectMode: true,
  read(){}
});

// Returns a stream from url. Have not fully implemented but should
// but almost this simple. Request returns the stream.
// const urlStream = url => Request.get(url)

// Transform stream; takes input, runs it through transformFcn,
// then sends it to the next stream object.
const transformStream = transformFcn => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(input, encoding, callback){
      let data = transformFcn(input)
      this.push(data);
      callback();
    }
  });     
}

// Count stream. Monitors how many items gets pushed through stream,
// does not modify them, just counts.
const countStream = R.curry((max,statement) => {
  var count = datapulse.counter(max)(statement)
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(input, encoding, callback){
      count()
      this.push(input);
      callback();
    }
  });     
})


// Write stream; takes data and does something with it using writeFcn.
// Does not pipe the stream, so this has to be last step.
const writeStream = writeFcn => {
  return new Writable({
    objectMode: true,
    async write(row, encoding, callback){
      try{
        await writeFcn(row)
        callback();
      }catch(err){
        console.log("rowtoDB stream error: ",err)
      }
    }
  });
}


// Use a factory to return a configured stream object
const streamMaker = Object.assign(
  {},
  {fileStream: fileStream},
  {readStream: readStream},
  {transformStream: transformStream},
  {writeStream: writeStream},
  {countStream: countStream},
)

module.exports = streamMaker
