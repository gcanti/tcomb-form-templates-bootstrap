import React from 'react'
import classnames from 'classnames'

export default function getLabel({label, breakpoints, htmlFor, id}) {
  if (label) {
    const className = breakpoints ? breakpoints.getLabelClassName() : {}
    className['control-label'] = true
    return (
      <label key="field-label" htmlFor={htmlFor} id={id} className={classnames(className)}>{label}</label>
    )
  }
}
