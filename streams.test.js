var stream = require('./streams')

let reader, transform, writer, counter
let transFcn, writerFcn
beforeAll(() => {
  transFcn = jest.fn(n => n)
  writerFcn = jest.fn()
  reader = stream.readStream 
  transform = stream.transformStream(transFcn) 
  counter = stream.countStream(100, 'should not log') 
  writer = stream.writeStream(writerFcn) 
})

test('Integration; Run data through all the stream objects', async () => {
  var runStreams = () => {
    return new Promise((resolve, reject) => {
      reader
        .pipe(transform)
        .pipe(counter)
        .pipe(writer)
          .on('finish', () => resolve(true))
          .on('error', (err) => reject(err))
    })
  }

  reader.push(Buffer.from('test string'))
  reader.push(Buffer.from('[1,2,3,4,5]'))
  reader.push(Buffer.from('{"a":1, "b":2, "c":3}'))
  reader.push('test string')
  reader.push([1,2,3,4,5])
  reader.push({a:1, b:2, c:3})
  reader.push(57)
  reader.push(null)

  await runStreams()

  expect(transFcn).toHaveBeenCalledTimes(7)
  expect(writerFcn).toHaveBeenCalledTimes(7)

  expect(transFcn).toHaveBeenNthCalledWith(1, Buffer.from('test string'))
  expect(writerFcn).toHaveBeenNthCalledWith(2, Buffer.from('[1,2,3,4,5]'))

  expect(transFcn).toHaveBeenNthCalledWith(4, 'test string')
  expect(writerFcn).toHaveBeenNthCalledWith(4, 'test string')

  expect(transFcn).toHaveBeenNthCalledWith(7, 57)
  expect(writerFcn).toHaveBeenNthCalledWith(7, 57)

})
