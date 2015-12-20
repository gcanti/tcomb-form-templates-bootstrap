import React from 'react'
import classnames from 'classnames'

function getClassName(locals) {
  const len = locals.path.length
  let className = `fieldset fieldset-depth-${len}`
  if (len > 0) {
    className += ` fieldset-${locals.path.join('-')}`
  }
  if (locals.className) {
    className += ` ${classnames(locals.className)}`
  }
  return className
}

export default function renderFieldset(children, locals) {
  const legend = locals.label ? <legend>{locals.label}</legend> : null
  const props = {
    className: getClassName(locals),
    disabled: locals.disabled
  }
  return React.createElement.apply(null, [
    'fieldset',
    props,
    legend
  ].concat(children))
}
