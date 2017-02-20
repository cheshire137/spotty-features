import React from 'react'

class SeedTypeControls extends React.Component {
  onSeedTypeChange(event) {
    this.props.onSeedTypeChange(event.target.value)
  }

  render() {
    const { seedType } = this.props
    return (
      <div className="control">
        <label className="radio is-large">
          <input
            type="radio"
            name="seed-type"
            checked={seedType === 'track'}
            value="track"
            onChange={e => this.onSeedTypeChange(e)}
          />
          Songs
        </label>
        <label className="radio is-large">
          <input
            type="radio"
            name="seed-type"
            checked={seedType === 'artist'}
            value="artist"
            onChange={e => this.onSeedTypeChange(e)}
          />
          Artists
        </label>
      </div>
    )
  }
}

SeedTypeControls.propTypes = {
  onSeedTypeChange: React.PropTypes.func.isRequired,
  seedType: React.PropTypes.string.isRequired
}

export default SeedTypeControls
