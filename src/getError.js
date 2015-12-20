import React from 'react'

export default function getError({hasError, error}) {
  if (hasError && error) {
    return <span className="help-block error-block">{error}</span>
  }
}
