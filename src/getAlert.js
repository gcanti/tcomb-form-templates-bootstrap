import React from 'react'

export default function getAlert(type, message) {
  return <div className={`alert alert-${type}`}>{message}</div>
}