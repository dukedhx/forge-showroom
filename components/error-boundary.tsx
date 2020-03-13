import React, { Component } from 'react'

export class ErrorBoundary extends Component {
  state = {
    error: null,
    eventId: null
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error })
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return <div>Error - see console for info</div>
    } else {
      return this.props.children
    }
  }
}
