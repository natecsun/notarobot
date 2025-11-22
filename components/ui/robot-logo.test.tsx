import { render } from '@testing-library/react'
import { RobotLogo } from './robot-logo'
import { describe, it, expect } from 'vitest'

describe('RobotLogo', () => {
  it('renders correctly', () => {
    const { container } = render(<RobotLogo />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies custom className', () => {
    const { container } = render(<RobotLogo className="custom-class" />)
    expect(container.querySelector('svg')).toHaveClass('custom-class')
  })
})
