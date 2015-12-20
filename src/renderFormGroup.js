import React from 'react'
import FormGroup from './FormGroup'

export default function renderFormGroup(children, { path, hasError }) {
  let className = `form-group-depth-${path.length}`
  if (path.length > 0) {
    className += ` form-group-${path.join('-')}`
  }
  return React.createElement.apply(null, [FormGroup, { className, hasError }].concat(children))
}