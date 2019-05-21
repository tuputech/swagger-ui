import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Iterable } from "immutable"

const Headers = ( { headers, getLangText } )=>{
  return (
    <div>
      <h5>{ getLangText("Response headers") }</h5>
      <pre>{headers}</pre>
    </div>)
}
Headers.propTypes = {
  headers: PropTypes.array.isRequired,
  getLangText: PropTypes.func.isRequired
}

const Duration = ( { duration, getLangText } ) => {
  return (
    <div>
      <h5>{ getLangText("Request duration") }</h5>
      <pre>{duration} ms</pre>
    </div>
  )
}
Duration.propTypes = {
  duration: PropTypes.number.isRequired,
  getLangText: PropTypes.func.isRequired
}


export default class LiveResponse extends React.Component {
  static propTypes = {
    response: PropTypes.instanceOf(Iterable).isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    // BUG: props.response is always coming back as a new Immutable instance
    // same issue as responses.jsx (tryItOutResponse)
    return this.props.response !== nextProps.response
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  }

  render() {
    const { response, getComponent, getConfigs, displayRequestDuration, specSelectors, path, method } = this.props
    // Added by Nickel with getLangText #2019/05/21
    const { showMutatedRequest, getLangText } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(path, method) : specSelectors.requestFor(path, method)
    const status = response.get("status")
    const url = curlRequest.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"] || headers["Content-Type"]

    const Curl = getComponent("curl")
    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      return <span className="headerline" key={key}> {key}: {headers[key]} </span>
    })
    const hasHeaders = returnObject.length !== 0

    return (
      <div>
        { curlRequest && <Curl request={ curlRequest }/> }
        { url && <div>
            <h4>{ getLangText("Request URL") }</h4>
            <div className="request-url">
              <pre>{url}</pre>
            </div>
          </div>
        }
        <h4>{ getLangText("Server response") }</h4>
        <table className="responses-table live-responses-table">
          <thead>
          <tr className="responses-header">
            <td className="col col_header response-col_status">{ getLangText("Code") }</td>
            <td className="col col_header response-col_description">{ getLangText("Details") }</td>
          </tr>
          </thead>
          <tbody>
            <tr className="response">
              <td className="col response-col_status">
                { status }
                {
                  notDocumented ? <div className="response-undocumented">
                                    <i> Undocumented </i>
                                  </div>
                                : null
                }
              </td>
              <td className="col response-col_description">
                {
                  isError ? <span>
                              {`${response.get("name")}: ${response.get("message")}`}
                            </span>
                          : null
                }
                {
                  body ? <ResponseBody content={ body }
                                       contentType={ contentType }
                                       url={ url }
                                       headers={ headers }
                                       getComponent={ getComponent }
                                       getConfigs={ getConfigs }
                        />
                       : null
                }
                {
                  hasHeaders ? <Headers headers={ returnObject } getLangText={ getLangText } /> : null
                }
                {
                  displayRequestDuration && duration ? <Duration duration={ duration } getLangText={ getLangText } /> : null
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    response: ImPropTypes.map
  }
}
