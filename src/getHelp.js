import React from 'react'

export default function getHelp({help, attrs}) {
  if (help) {
    return <span className="help-block" id={`${attrs.id}-tip'`}>{help}</span>
  }
}
