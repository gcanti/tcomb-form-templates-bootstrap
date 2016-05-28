import React from 'react'
import t from 'tcomb'
import classnames from 'classnames'
import Breakpoints from './Breakpoints'
import getLabel from './getLabel'
import getError from './getError'
import getHelp from './getHelp'
import renderFormGroup from './renderFormGroup'

const DateConfig = t.struct({
  horizontal: t.maybe(Breakpoints)
}, 'DateConfig')

function range(n) {
  const result = []
  for (let i = 1; i <= n; i++) { result.push(i) }
  return result
}

function padLeft(x, len) {
  let str = String(x)
  const times = len - str.length
  for (let i = 0; i < times; i++ ) { str = '0' + str }
  return str
}

function toOption(value, text) {
  return <option key={value} value={value + ''}>{text}</option>
}

const nullOption = [toOption('', '-')]

const days = nullOption.concat(range(31).map((i) => toOption(i, padLeft(i, 2))))

const months = nullOption.concat(range(12).map((i) => toOption(i - 1, padLeft(i, 2))))

function create(overrides = {}) {
  function date(locals) {
    locals.config = date.getConfig(locals)
    locals.attrs = date.getAttrs(locals)

    const children = locals.config.horizontal ?
      date.renderHorizontal(locals) :
      date.renderVertical(locals)

    return date.renderFormGroup(children, locals)
  }

  date.getConfig = overrides.getConfig || function getConfig(locals) {
    return new DateConfig(locals.config || {})
  }

  date.getAttrs = overrides.getAttrs || function getAttrs(locals) {
    return t.mixin({}, locals.attrs)
  }

  date.renderLabel = overrides.renderLabel || function renderLabel(locals) {
    return getLabel({
      label: locals.label,
      breakpoints: locals.config.horizontal
    })
  }

  date.renderError = overrides.renderError || function renderError(locals) {
    return getError(locals)
  }

  date.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getHelp(locals)
  }

  date.renderDate = overrides.renderDate || function renderDate(locals) {
    const value = locals.value.map(x => x || '')

    function onDayChange(evt) {
      value[2] = evt.target.value === '-' ? null : evt.target.value
      locals.onChange(value)
    }

    function onMonthChange(evt) {
      value[1] = evt.target.value === '-' ? null : evt.target.value
      locals.onChange(value)
    }

    function onYearChange(evt) {
      value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim()
      locals.onChange(value)
    }

    const parts = {
      D: (
        <li key="D">
          <select disabled={locals.disabled} className="form-control" value={value[2]} onChange={onDayChange}>
            {days}
          </select>
        </li>
      ),
      M: (
        <li key="M">
          <select disabled={locals.disabled} className="form-control" value={value[1]} onChange={onMonthChange}>
            {months}
          </select>
        </li>
      ),
      YY: (
        <li key="YY">
          <input type="text" size="5" disabled={locals.disabled} className="form-control" value={value[0]} onChange={onYearChange} />
        </li>
      )
    }

    return (
      <ul className="nav nav-pills">
        {locals.order.map((id) => parts[id])}
      </ul>
    )
  }

  date.renderVertical = overrides.renderVertical || function renderVertical(locals) {
    return [
      date.renderLabel(locals),
      date.renderDate(locals),
      date.renderError(locals),
      date.renderHelp(locals)
    ]
  }

  date.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
    const label = date.renderLabel(locals)
    const className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName()
    return [
      label,
      <div className={classnames(className)}>
        {date.renderDate(locals)}
        {date.renderError(locals)}
        {date.renderHelp(locals)}
      </div>
    ]
  }

  date.renderFormGroup = overrides.renderFormGroup || renderFormGroup

  date.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  return date
}

export default create()
