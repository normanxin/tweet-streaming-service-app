import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Filter.css'

const operatorName = {
  equals: 'equals',
  contains: 'contains',
  regex: 'regex',
};

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: [],
      errors: [],
    };
  }

  render() {
    const {equals, contains, regex} = operatorName;

    return (
      <div>
        <ul className="errors">
          {this.state.errors.length > 0 &&
            this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>
        <button onClick={this.handleAddCondition}>Add condition</button>
        <ul>
          {this.state.conditions.map(({field, operator, value}, i) => (
            <li key={i}>
              <input
                placeholder="field"
                value={field}
                onChange={event => this.handleChange(event, 'field', i)}
              />
              <select
                value={operator}
                onChange={event => this.handleChange(event, 'operator', i)}
              >
                <option value={equals}>equals</option>
                <option value={contains}>contains</option>
                <option value={regex}>regex</option>
              </select>
              <input
                placeholder="value"
                value={value}
                onChange={event => this.handleChange(event, 'value', i)}
              />
            <button onClick={event => this.handleDelete(i)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }

  handleAddCondition = () => {
    this.setState(prevState => ({
      conditions: [...prevState.conditions, {
        field: '',
        operator: operatorName.equals,
        value: '',
      }],
    }));
  }

  handleDelete = (i) => {
    this.setState(prevState => ({
      conditions: prevState.conditions.filter(
        (condition, index) => index !== i),
    }));
  }

  handleSubmit = () => {
    const conditions = this.state.conditions;

    if (!conditions.length) {
      return;
    }

    this.validate(conditions) && this.props.onSubmit(conditions);
  }

  handleChange(event, name, i) {
    const conditions = this.state.conditions;
    const condition = conditions[i];

    condition[name] = event.target.value;
    this.setState({
      conditions: [
        ...conditions.slice(0, i),
        condition,
        ...conditions.slice(i + 1)
      ],
    });
  }

  validate(conditions) {
    const errors = [];

    conditions.forEach(({field, operator, value}, i) => {
      if (!field) {
        errors.push(`Condition ${i + 1}: field cannot be empty`);
      }

      if (!value) {
        errors.push(`Condition ${i + 1}: value cannot be empty`);
      }

      if (operator === operatorName.regex && !/^\/.*\/$/.test(value)) {
        errors.push(`Condition ${i + 1}: invalid regex`);
      }
    });

    this.setState({errors});

    return errors.length === 0;
  }
}

Filter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
