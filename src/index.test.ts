import { expect, test } from 'bun:test'
import { shtl } from '../src/index.js'

test('just true', () => {
  expect(shtl`true`).toEqual(['true'])
})

test('literal arg', () => {
  expect(shtl`echo hello`).toEqual(['echo', 'hello'])
})

test('quoted args', () => {
  expect(shtl`echo "hello world" "and more"`).toEqual([
    'echo',
    'hello world',
    'and more',
  ])
})

test('placeholder args', () => {
  const msg = 'hello world'
  expect(shtl`echo ${msg} "and more"`).toEqual([
    'echo',
    'hello world',
    'and more',
  ])
})

test('number arg', () => {
  const answer = 42
  expect(shtl`echo ${answer}`).toEqual(['echo', '42'])
})

test('array args', () => {
  const arr = ['hello', 'world']
  expect(shtl`echo ${arr} "and more"`).toEqual([
    'echo',
    'hello',
    'world',
    'and more',
  ])
})

test('array args at start', () => {
  const arr = ['echo', 'hello', 'world']
  expect(shtl`${arr} "and more"`).toEqual([
    'echo',
    'hello',
    'world',
    'and more',
  ])
})

test('skip undefined', () => {
  const u = undefined
  expect(shtl`echo ${u}`).toEqual(['echo'])
})

test('joined arg', () => {
  const u = 'hello'
  expect(shtl`echo --this=${u}`).toEqual(['echo', '--this=hello'])
})

test('joined arg with spaces', () => {
  const u = 'hello world'
  expect(shtl`echo --this=${u}`).toEqual(['echo', '--this=hello world'])
})

test('joined arg as prefix', () => {
  const u = '/foo'
  expect(shtl`echo ${u}/bar`).toEqual(['echo', '/foo/bar'])
})

test('joined arg as middle', () => {
  const u = '/bar'
  expect(shtl`echo /foo${u}/baz`).toEqual(['echo', '/foo/bar/baz'])
})

test('joined arg everywhere', () => {
  const u = '/bar'
  const ext = '.ts'
  expect(shtl`echo /foo${u}/baz${ext}`).toEqual(['echo', '/foo/bar/baz.ts'])
})

test('joined arg double', () => {
  const u = '/bar'
  const ext = '.ts'
  expect(shtl`echo /foo${u}${ext}.bak`).toEqual(['echo', '/foo/bar.ts.bak'])
})

test('joined arg double at start and end', () => {
  const u = '/bar'
  const ext = '.ts'
  expect(shtl`${u}${ext}`).toEqual(['/bar.ts'])
})

// test('arg inside quotes', () => {
//   const msg = 'hello world'
//   expect(shtl`echo "${msg}, welcome"`).toEqual(['echo', 'hello world, welcome'])
// })
