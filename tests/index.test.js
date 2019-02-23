import { render } from 'react-testing-library'
import React from 'react'
import App from '../src/index'

test('app render', () => {
  const { container } = render(<App />)
  expect(container).toMatchSnapshot()
})
