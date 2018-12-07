import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Tooltip } from 'carbon-components-react';

export default class MouseOverTooltip extends Tooltip {
  /**
   * Handles `mouseover`/`mouseout`/`focus`/`blur` event.
   * @param {string} state `over` to show the tooltip, `out` to hide the tooltip.
   * @param {Element} [relatedTarget] For handing `mouseout` event, indicates where the mouse pointer is gone.
   */
  _handleHover = (state, relatedTarget) => {
    if (state === 'over') {
      if (!this.state.open) {
        this.getTriggerPosition();
        this.setState({ open: true });
      }
    } else {
      if (this.state.open) {
        this.setState({ open: false });
      }
    }
  };

  _debouncedHandleHover = debounce(this._handleHover, 500);

  handleMouse = evt => {
    let state = {
      mouseover: 'over',
      mouseout: 'out',
      focus: this.props.clickToOpen ? 'over' : 'out',
      blur: 'out',
      click: this.props.clickToOpen ? 'click' : 'out',
    }[evt.type];

    if (
      !this.props.clickToOpen &&
      (evt.target === this._tooltipEl || evt.relatedTarget === this._tooltipEl)
    ) {
      state = 'out';
    }

    const hadContextMenu = this._hasContextMenu;
    this._hasContextMenu = evt.type === 'contextmenu';
    if (this.props.clickToOpen) {
      if (state === 'click') {
        evt.stopPropagation();
        const shouldOpen = !this.state.open;
        if (shouldOpen) {
          this.getTriggerPosition();
        }
        this.setState({ open: shouldOpen });
      }
    } else if (state && (state !== 'out' || !hadContextMenu)) {
      if (state === 'out') {
        this._debouncedHandleHover.cancel();
        this._handleHover(state, evt.relatedTarget);
      } else {
        this._debouncedHandleHover(state, evt.relatedTarget);
      }
    }
  };
}
