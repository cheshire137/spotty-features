import React from 'react'

export default class AnonLayout extends React.Component {
  render() {
    return (
      <div>
        <div className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <a href="/">Spotty Features</a>
              </h1>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="content-container container">
            {this.props.children}
          </div>
        </section>
      </div>
    )
  }
}
