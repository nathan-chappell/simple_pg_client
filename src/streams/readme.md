## Why does this exist?

I wanted to do the following: given a *stream*, asynchronously yield the bytes.  I just want to do `const nextByte = await the_abstraction.next_byte_please()`, but it's not so straightforward in JS.  Anyways, `yieldBytes` does this.

The point of the `dataAdapter` is to now escape from *bytes* and move into semantically interesting data-types specified by **postgres**.

This all roughly creates the following layered architecture:

| layer | purpose | program entity |
| ----- | ------- | ----------- |
| JS Stream | get bytes from sources | [*ReadableStream*](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) |
| Stream-abstraction | get bytes asynchronously and conveniently | *yieldBytes* |
| Data | get typed values from byte-source | *dataTypeAdapter* |
| Message | get typed messages from data-source | message formats |

Note that going the other way has to be handled somewhat differently.  The reason is that the messages we send have a *length* field, so the entire message must be composed before it can be sent.  To deal with this we have the **