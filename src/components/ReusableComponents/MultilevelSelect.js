import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 *
 */
class MultilevelSelect extends Component {
    
    static defaultProps = {
        spaceSymbol : '\u00A0\u00A0',
        loadingText: 'Загрузка...',
        className: 'r-multilevel',
        ...Component.defaultProps
    }
    
    renderOptions = (items = [], level = 0) => {
        level++;
        return items.map((item) => {
            return [
                    <option disabled={item.disabled && item.disabled === true} className={`${this.props.className}__option-${level}`}
                            key={item.id}
                            value={item.id}>{this.props.spaceSymbol.repeat(level)}{item.name}</option>,
                    item.children && item.children.length ? this.renderOptions(item.children, level) : null
                ]
        })
    }
    
    render() {
        return (
            <select className={this.props.className} value={this.props.value} onChange={this.props.onChange}>
                {
                    this.props.items ? this.renderOptions(this.props.items) :
                        <option className={`${this.props.className}__option`} selected={true} disabled={true}>{this.props.loadingText}</option>
                }
            </select>
        )
    }
}

MultilevelSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        children: PropTypes.array
    })).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.number,
    spaceSymbol: PropTypes.string,
    loadingText: PropTypes.string,
    className: PropTypes.string
}

export default MultilevelSelect;