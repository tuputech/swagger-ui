import React, { Component } from "react"
import PropTypes from "prop-types"
import { highlight } from "core/utils"
import saveAs from "js-file-download"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    downloadable: PropTypes.bool,
    fileName: PropTypes.string,
    // Added by Nickel #2019/05/21
    getConfigs: PropTypes.func.isRequired,
  }

  componentDidMount() {
    highlight(this.el)
  }

  componentDidUpdate() {
    highlight(this.el)
  }

  initializeComponent = (c) => {
    this.el = c
  }

  downloadText = () => {
    saveAs(this.props.value, this.props.fileName || "response.txt")
  }

  preventYScrollingBeyondElement = (e) => {
    const target = e.target

    var deltaY = e.nativeEvent.deltaY
    var contentHeight = target.scrollHeight
    var visibleHeight = target.offsetHeight
    var scrollTop = target.scrollTop

    const scrollOffset = visibleHeight + scrollTop

    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      const { getConfigs } = this.props
      const { disablePreventDefaultOnScroll = false } = getConfigs ? getConfigs() : {}
      if (!disablePreventDefaultOnScroll) e.preventDefault()
    }
  }

  render () {
    // Added by Nickel with getConfigs #2019/05/21
    let { value, className, downloadable, getConfigs } = this.props
    className = className || ""

    // Added by Nickel #2019/05/21
    const { getLangText } = getConfigs ? getConfigs() : { getLangText: t=>t }

    return (
      <div className="highlight-code">
        { !downloadable ? null :
          <div className="download-contents" onClick={this.downloadText}>
            { getLangText("Download") }
          </div>
        }
        <pre
          ref={this.initializeComponent}
          onWheel={this.preventYScrollingBeyondElement}
          className={className + " microlight"}>
          {value}
        </pre>
      </div>
    )
  }
}
