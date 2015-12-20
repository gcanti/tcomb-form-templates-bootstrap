import React from 'react'

export default function getError({help, attrs}) {
  if (help) {
    return <span className="help-block" id={`${attrs.id}-tip'`}>{help}</span>
  }
}
