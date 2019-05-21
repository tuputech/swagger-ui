import React from "react"
import PropTypes from "prop-types"

export default class FilterContainer extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    // Added by Nickel #2019/05/21
    getConfigs: PropTypes.func.isRequired,
  }

  onFilterChange = (e) => {
    const {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render () {
    const {
      specSelectors, layoutSelectors, getComponent,
      // Added by Nickel #2019/05/21
      getConfigs
    } = this.props
    const Col = getComponent("Col")

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isFailed = specSelectors.loadingStatus() === "failed"
    const filter = layoutSelectors.currentFilter()

    const inputStyle = {}
    if (isFailed) inputStyle.color = "red"
    if (isLoading) inputStyle.color = "#aaa"

    // Added by Nickel #2019/05/21
    const { getLangText } = getConfigs()

    return (
      <div>
        {filter === null || filter === false ? null :
          <div className="filter-container">
            <Col className="filter wrapper" mobile={12}>
              <input className="operation-filter-input" placeholder={getLangText("Filter by tag")} type="text"
                     onChange={this.onFilterChange} value={filter === true || filter === "true" ? "" : filter}
                     disabled={isLoading} style={inputStyle}/>
            </Col>
          </div>
        }
      </div>
    )
  }
}
