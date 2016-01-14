import React from 'react'
import t from 'tcomb'
import classnames from 'classnames'
import Breakpoints from './Breakpoints'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'
import renderFormGroup from './renderFormGroup'

const TextboxConfig = t.struct({
  addonBefore: t.Any,
  addonAfter: t.Any,
  horizontal: t.maybe(Breakpoints),
  buttonBefore: t.Any,
  buttonAfter: t.Any
}, 'TextboxConfig')

function getInputGroupButton(button) {
  return (
    <div className="input-group-btn">
      {button}
    </div>
  )
}

function getInputGroup(children) {
  return React.createElement.apply(null, ['div', { className: 'input-group' }].concat(children))
}

function getAddon(addon) {
  return <span className="input-group-addon">{addon}</span>
}

function create(overrides = {}) {
  function textbox(locals) {
    locals.config = textbox.getConfig(locals)
    locals.attrs = textbox.getAttrs(locals)

    if (locals.type === 'hidden') {
      return textbox.renderHiddenTextbox(locals)
    }

    const children = locals.config.horizontal ?
      textbox.renderHorizontal(locals) :
      textbox.renderVertical(locals)

    return textbox.renderFormGroup(children, locals)
  }

  textbox.getConfig = overrides.getConfig || function getConfig(locals) {
    return new TextboxConfig(locals.config || {})
  }

  textbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    const attrs = t.mixin({}, locals.attrs)
    attrs.type = locals.type
    attrs.className = classnames(attrs.className)
    attrs.className += ( attrs.className ? ' ' : '' ) + 'form-control'
    attrs.disabled = locals.disabled
    if (locals.type !== 'file') {
      attrs.value = locals.value
    }
    attrs.onChange = locals.type === 'file' ?
      evt => locals.onChange(evt.target.files[0]) :
      evt => locals.onChange(evt.target.value)

    if (locals.help) {
      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip'
    }
    return attrs
  }

  textbox.renderHiddenTextbox = overrides.renderHiddenTextbox || function renderHiddenTextbox(locals) {
    return <input type="hidden" value={locals.value} name={locals.attrs.name} />
  }

  textbox.renderStatic = overrides.renderStatic || function renderStatic(locals) {
    return <p className="form-control-static">{locals.value}</p>
  }

  textbox.renderTextbox = overrides.renderTextbox || function renderTextbox(locals) {
    if (locals.type === 'static') {
      return textbox.renderStatic(locals)
    }
    let ret = locals.type !== 'textarea' ?
      textbox.renderInput(locals) :
      textbox.renderTextarea(locals)
    if (locals.config.addonBefore || locals.config.addonAfter || locals.config.buttonBefore || locals.config.buttonAfter) {
      ret = textbox.renderInputGroup(ret, locals)
    }
    return ret
  }

  textbox.renderInputGroup = overrides.renderInputGroup || function renderInputGroup(input, locals) {
    return getInputGroup([
      locals.config.buttonBefore ? getInputGroupButton(locals.config.buttonBefore) : null,
      locals.config.addonBefore ? getAddon(locals.config.addonBefore) : null,
      input,
      locals.config.addonAfter ? getAddon(locals.config.addonAfter) : null,
      locals.config.buttonAfter ? getInputGroupButton(locals.config.buttonAfter) : null
    ])
  }

  textbox.renderInput = overrides.renderInput || function renderInput(locals) {
    return <input {...locals.attrs} />
  }

  textbox.renderTextarea = overrides.renderTextarea || function renderTextarea(locals) {
    return <textarea {...locals.attrs} />
  }

  textbox.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      htmlFor: locals.attrs.id,
      breakpoints: locals.config.horizontal
    })
  }

  textbox.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  textbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  textbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      textbox.renderLabel(locals),
      textbox.renderTextbox(locals),
      textbox.renderError(locals),
      textbox.renderHelp(locals)
    ]
  }

  textbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const label = textbox.renderLabel(locals)
    const className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
    return [
      label,
      <div className={classnames(className)}>
        {textbox.renderTextbox(locals)}
        {textbox.renderError(locals)}
        {textbox.renderHelp(locals)}
      </div>
    ]
  }

  textbox.renderFormGroup = overrides.renderFormGroup || renderFormGroup

  textbox.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  return textbox
}

export default create()
