import test from 'tape'
import vdom from 'react-vdom'
import renderFormGroup from '../src/renderFormGroup'

test('should handle the depth as a class', (assert) => {
  assert.plan(1)
  const actual = vdom(renderFormGroup(null, { path: [] }))
  assert.equal(actual.attrs.className, 'form-group form-group-depth-0')
})

test('should handle an error as a class', (assert) => {
  assert.plan(1)
  const actual = vdom(renderFormGroup(null, { path: [], hasError: true }))
  assert.equal(actual.attrs.className, 'form-group has-error form-group-depth-0')
})

test('should handle the path as a class', (assert) => {
  assert.plan(1)
  const actual = vdom(renderFormGroup(null, { path: ['a', 'b'] }))
  assert.equal(actual.attrs.className, 'form-group form-group-depth-2 form-group-a-b')
})
