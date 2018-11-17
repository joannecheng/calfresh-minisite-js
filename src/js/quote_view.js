import React, {Component} from "react"
import ReactDOM from "react-dom"

import utils from "./utils"

const CountyInfoRow = ({countyInfo, title, dataKey, formatter}) => {
  return (<tr>
    <td>
      {title}
    </td>

    <td style={{width: "40px"}}>
      {formatter(countyInfo[dataKey])}
    </td>
  </tr>)
}

const CountyInfo = ({countyInfo}) => {
  const keysAndTitles = [
    ["Number GetCalFresh Applicants", "number-apps", utils.formatNum],
    ["Percentage of Applicants with Income", "percent-earned-income", utils.formatPercent],
    ["Percentage of Households with Children", "percent-with-children", utils.formatPercent],
    ["Percentage of Households with Seniors", "percent-with-seniors", utils.formatPercent],
    ["Percent with Unstable Housing", "percent-unstable-housing", utils.formatPercent],
    ["Percent Students", "percent-student", utils.formatPercent]]

  const federalData = [
    ["Population", "population", String],
    ["Min Cost of Living (2 Working Adults, 2 Children)", "minimum-cost-living-family", utils.formatMoney],
    ["Median Income", "median-income", utils.formatMoney],
    ["Poverty Rate (Cost of Living Adujusted)","poverty-rate", String]
  ]

  const countyDataRows = keysAndTitles.map((row) => {
    return (<CountyInfoRow title={row[0]}
      dataKey={row[1]}
      key={row[1]}
      countyInfo={countyInfo}
      formatter={row[2]}
      />)
  })
  const federalDataRows = federalData.map((row) => {
    return (<CountyInfoRow title={row[0]}
              dataKey={row[1]}
              key={row[1]}
              countyInfo={countyInfo}
              formatter={row[2]}
           />)
  })

  return (<div>
    <table className="county-data">
      <tbody>
        {countyDataRows}
      </tbody>
    </table>

    <table className="county-data">
      <tbody>
        {federalDataRows}
      </tbody>
    </table>
  </div>)
}

class CountyQuoteView extends Component {
  quoteComponents() {
    const {county} = this.props
    const countyQuotes = this.props.quotes[county].quotes

    return (countyQuotes.map((quote, index) => {
      return <blockquote key={index}>{quote}</blockquote>
    }))
  }

  render() {
    const {county} = this.props
    if (county == null) {
      return (
        <div class="grid-box county-info-box" id="user_selected_county">

          <div class="grid-item light-background width-seven-twelfths shift-one-third end-row">
        <h3>Click on the map to view quotes and stats for a county.</h3>
          </div>
        </div>)
    }

    const countyInfo = this.props.quotes[county]

    return (
      <div className="grid-box county-info-box"
        data-county={county}>
        <div className="light-background grid-item shift-one-third width-seven-twelfths end-row">
          <div className="large-text text-center">
            <strong>{county}</strong>
          </div>
        </div>

        <div className="light-background grid-item shift-one-third width-seven-twelfths end-row">
          {this.quoteComponents()}

          <CountyInfo countyInfo={countyInfo} />
        </div>

      </div>)
  }
}

/********************/
// Public Components, rendering
/********************/

class QuoteMapApp extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedCounty: null }
  }

  setCounty(county) {
    this.setState({selectedCounty: county})
  }

  render() {
    const {quotes} = this.props
    const {selectedCounty} = this.state

    return (<div>
      <CountyQuoteView county="Alameda" quotes={quotes}/>
      <CountyQuoteView county="San Francisco" quotes={quotes}/>

      <CountyQuoteView county={selectedCounty} quotes={quotes} />
    </div>)
  }
}

const QuoteView = {
  render: function(quotes) {
    return ReactDOM.render(
      <QuoteMapApp quotes={quotes} />,
      document.getElementById("preloaded_quotes")
    )
  }
}

export default QuoteView
