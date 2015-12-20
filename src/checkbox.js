import React from 'react'
import t from 'tcomb'
import classnames from 'classnames'
import Breakpoints from './Breakpoints'
import getError from './getError'
import getHelp from './getHelp'
import renderFormGroup from './renderFormGroup'

const CheckboxConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'CheckboxConfig')

function create(overrides = {}) {
  function checkbox(locals) {
    locals.config = checkbox.getConfig(locals)

    const children = locals.config.horizontal ?
      checkbox.renderHorizontal(locals) :
      checkbox.renderVertical(locals)

    return checkbox.renderFormGroup(children, locals)
  }

  checkbox.getConfig = overrides.getConfig || function getConfig(locals) {
    return new CheckboxConfig(locals.config || {})
  }

  checkbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    const attrs = t.mixin({}, locals.attrs)
    attrs.type = 'checkbox'
    attrs.disabled = locals.disabled
    attrs.checked = locals.value
    attrs.onChange = evt => locals.onChange(evt.target.checked)
    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || (attrs.id + '-tip')
    }
    return attrs
  }

  checkbox.renderCheckbox = overrides.renderCheckbox || function renderCheckbox(locals) {
    const attrs = checkbox.getAttrs(locals)
    const className = {
      checkbox: true,
      disabled: attrs.disabled
    }
    return (
      <div className={classnames(className)}>
        <label htmlFor={attrs.id}>
          <input {...attrs} /> {locals.label}
        </label>
      </div>
    )
  }

  checkbox.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  checkbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  checkbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      checkbox.renderCheckbox(locals),
      checkbox.renderError(locals),
      checkbox.renderHelp(locals)
    ]
  }

  checkbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const className = locals.config.horizontal.getOffsetClassName()
    return (
      <div className={classnames(className)}>
        {checkbox.renderCheckbox(locals)}
        {checkbox.renderError(locals)}
        {checkbox.renderHelp(locals)}
      </div>
    )
  }

  checkbox.renderFormGroup = overrides.renderFormGroup || renderFormGroup

  checkbox.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  return checkbox
}

export default create()
