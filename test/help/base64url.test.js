const test = require('ava')

const errors = require('../../lib/errors')
const base64url = require('../../lib/help/base64url')

const testStr = 'fmkIOj+kafqtjMl+iC32a+9YGz0cKj/JT9Jt31uXR1la7FSXkjoBzg/F+huYm0udbM5z5qGlmPBNZASsixJLcA=='
const testBuf = Buffer.from('fmkIOj+kafqtjMl+iC32a+9YGz0cKj/JT9Jt31uXR1la7FSXkjoBzg/F+huYm0udbM5z5qGlmPBNZASsixJLcA==', 'base64')

test('.encodeBuffer buffer', t => {
  t.is(base64url.encodeBuffer(testBuf), 'fmkIOj-kafqtjMl-iC32a-9YGz0cKj_JT9Jt31uXR1la7FSXkjoBzg_F-huYm0udbM5z5qGlmPBNZASsixJLcA')
})

test('.encode string with default encoding', t => {
  t.is(base64url.encode('foo'), 'Zm9v')
})

test('.encode string with non-default encoding', t => {
  t.is(base64url.encode(testStr, 'base64'), 'fmkIOj-kafqtjMl-iC32a-9YGz0cKj_JT9Jt31uXR1la7FSXkjoBzg_F-huYm0udbM5z5qGlmPBNZASsixJLcA')
})

test('.decode with default encoding', t => {
  t.is(base64url.decode('Zm9v'), 'foo')
})

test('.decodeToBuffer', t => {
  t.deepEqual(base64url.decodeToBuffer('fmkIOj-kafqtjMl-iC32a-9YGz0cKj_JT9Jt31uXR1la7FSXkjoBzg_F-huYm0udbM5z5qGlmPBNZASsixJLcA'), testBuf)
})

test('.JSON.encode', t => {
  t.deepEqual(base64url.JSON.encode({ foo: 'bar' }), 'eyJmb28iOiJiYXIifQ')
})

test('.JSON.decode', t => {
  t.deepEqual(base64url.JSON.decode('eyJmb28iOiJiYXIifQ'), { foo: 'bar' })
})

test('.JSON.decode.try (valid json)', t => {
  t.deepEqual(base64url.JSON.decode.try('eyJmb28iOiJiYXIifQ'), { foo: 'bar' })
})

test('.JSON.decode.try (invalid json)', t => {
  t.is(base64url.JSON.decode.try('Zm9v'), 'foo')
})
