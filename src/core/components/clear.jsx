import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Clear extends Component {

  onClick =() => {
    let { specActions, path, method } = this.props
    specActions.clearResponse( path, method )
    specActions.clearRequest( path, method )
  }

  render(){
    // Added by Nickel #2019/05/21
    const { getConfigs } = this.props
    const { getLangText } = getConfigs()

    return (
      <button className="btn btn-clear opblock-control__btn" onClick={ this.onClick }>
        { getLangText("Clear") }
      </button>
    )
  }

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    // Added by Nickel #2019/05/21
    getConfigs: PropTypes.func.isRequired,
  }
}
