import React from 'react'
import classnames from 'classnames'
import getAlert from './getAlert'
import renderFieldset from './renderFieldset'

function getBreakpoints(breakpoints) {
  const className = {}
  for (const size in breakpoints) {
    if (breakpoints.hasOwnProperty(size)) {
      className['col-' + size + '-' + breakpoints[size]] = true
    }
  }
  return className
}

function getCol(breakpoints, content) {
  const className = classnames(getBreakpoints(breakpoints))
  return <div className={className}>{content}</div>
}

function create(overrides = {}) {
  function list(locals) {
    let children = []

    if (locals.help) {
      children.push(list.renderHelp(locals))
    }

    if (locals.error && locals.hasError) {
      children.push(list.renderError(locals))
    }

    children = children.concat(locals.items.map((item) => {
      return item.buttons.length === 0 ?
        list.renderRowWithoutButtons(item, locals) :
        list.renderRow(item, locals)
    }))

    if (locals.add) {
      children.push(list.renderAddButton(locals))
    }

    return list.renderFieldset(children, locals)
  }

  list.renderHelp = overrides.renderHelp || function renderHelp(locals) {
    return getAlert('info', locals.help)
  }

  list.renderError = overrides.renderError || function renderError(locals) {
    return getAlert('danger', locals.error)
  }

  list.renderRowWithoutButtons = overrides.renderRowWithoutButtons || function renderRowWithoutButtons(item /* , locals*/) {
    return <div className="row" key={item.key}>{getCol({xs: 12}, item.input)}</div>
  }

  list.renderRowButton = overrides.renderRowButton || function renderRowButton(button) {
    return <button key={button.type} type="button" className={`btn btn-default btn-${button.type}`} onClick={button.click}>{button.label}</button>
  }

  list.renderButtonGroup = overrides.renderButtonGroup || function renderButtonGroup(buttons /* , locals*/) {
    return <div className="btn-group">{buttons.map(list.renderRowButton)}</div>
  }

  list.renderRow = overrides.renderRow || function renderRow(row, locals) {
    return (
      <div className="row">
        {getCol({sm: 8, xs: 6}, row.input)}
        {getCol({sm: 4, xs: 6}, list.renderButtonGroup(row.buttons, locals))}
      </div>
    )
  }

  list.renderAddButton = overrides.renderAddButton || function renderAddButton(locals) {
    const button = locals.add
    return (
      <div className="row">
        <div className="col-lg-12">
          <div style={{marginBottom: '15px'}}>
            <button type="button" className={`btn btn-default btn-${button.type}`} onClick={button.click}>{button.label}</button>
          </div>
        </div>
      </div>
    )
  }

  list.renderFieldset = overrides.renderFieldset || renderFieldset

  list.clone = function clone(newOverrides = {}) {
    return create({...overrides, ...newOverrides})
  }

  return list
}

export default create()
