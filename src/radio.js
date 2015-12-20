import React from 'react'
import t from 'tcomb'
import classnames from 'classnames'
import Breakpoints from './Breakpoints'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'
import renderFormGroup from './renderFormGroup'

const RadioConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'RadioConfig')

function getRadio(attrs, text, key) {
  const className = classnames({
    radio: true,
    disabled: attrs.disabled
  })
  return (
    <div key={key} className={className}>
      <label htmlFor={attrs.id}>
        <input {...attrs} /> {text}
      </label>
    </div>
  )
}

function create(overrides = {}) {
  function radio(locals) {
    locals.config = radio.getConfig(locals)

    const children = locals.config.horizontal ?
      radio.renderHorizontal(locals) :
      radio.renderVertical(locals)

    return radio.renderFormGroup(children, locals)
  }

  radio.getConfig = overrides.getConfig || function getConfig(locals) {
    return new RadioConfig(locals.config || {})
  }

  radio.renderRadios = overrides.renderRadios || function renderRadios(locals) {
    const id = locals.attrs.id
    const onChange = evt => locals.onChange(evt.target.value)
    return locals.options.map((option, i) => {
      const attrs = t.mixin({}, locals.attrs)
      attrs.type = 'radio'
      attrs.checked = ( option.value === locals.value )
      attrs.disabled = locals.disabled
      attrs.value = option.value
      attrs.autoFocus = attrs.autoFocus && ( i === 0 )
      attrs.id = `${id}_${i}`
      attrs['aria-describedby'] = attrs['aria-describedby'] || ( locals.label ? id : null )
      attrs.onChange = onChange
      return getRadio(attrs, option.text, option.value)
    })
  }

  radio.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id,
      breakpoints: locals.config.horizontal
    })
  }

  radio.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  radio.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  radio.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      radio.renderLabel(locals),
      radio.renderRadios(locals),
      radio.renderError(locals),
      radio.renderHelp(locals)
    ]
  }

  radio.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const label = radio.renderLabel(locals)
    const className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
    return [
      label,
      <div className={classnames(className)}>
        {radio.renderRadios(locals)}
        {radio.renderError(locals)}
        {radio.renderHelp(locals)}
      </div>
    ]
  }

  radio.renderFormGroup = overrides.renderFormGroup || renderFormGroup

  radio.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  return radio
}

export default create()
