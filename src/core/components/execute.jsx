import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Execute extends Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    operation: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    onExecute: PropTypes.func,
    // Added by Nickel #2019/05/21
    getConfigs: PropTypes.func.isRequired,
  }

  onClick=()=>{
    let { specSelectors, specActions, operation, path, method } = this.props

    specActions.validateParams( [path, method] )

    if ( specSelectors.validateBeforeExecute([path, method]) ) {
      if(this.props.onExecute) {
        this.props.onExecute()
      }
      specActions.execute( { operation, path, method } )
    }
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  render(){
    // Added by Nickel #2019/05/21
    const { getConfigs } = this.props
    const { getLangText } = getConfigs()

    return (
        <button className="btn execute opblock-control__btn" onClick={ this.onClick }>
          { getLangText("Execute") }
        </button>
    )
  }
}
