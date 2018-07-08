import map from 'lodash/map'

/**
 * Make field select options
 * @param {Object} data
 * @return {Array}
 */
export const makeSelectOptionsFromConstants = (data) => {
  return map(Object.keys(data), (key) => {
    const value = data[key]
    return {
      key,
      text: value,
      value: key,
    }
  })
}

/**
 * Make select field options from a graphql node collection
 * @param {Object[]} data
 * @param {string} textKey
 * @param {string} valueKey
 */
export const makeSelectOptionsFromNode = (data, textKey, valueKey = 'id') => {
  return map(Object.keys(data), (key) => {
    const record = data[key]
    return {
      key,
      text: record[textKey],
      value: record[valueKey],
    }
  })
}
