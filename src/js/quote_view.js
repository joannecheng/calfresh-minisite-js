import React, {Component} from "react";
import ReactDOM from "react-dom";

const CountyInfoRow = ({rowTitle, rowKey}) => {
  <div></div>
}

const CountyInfo = ({countyInfo}) => (
  (<table></table>)
)

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
        </div>
      </div>)
  }
}

/********************/
// Public Components, rendering
/********************/

class QuoteMapApp extends Component {
  render() {
    const {quotes} = this.props

    return (<div>
      <CountyQuoteView county="Alameda" quotes={quotes}/>
      <CountyQuoteView county="San Francisco" quotes={quotes}/>
    </div>)
  }
}

const QuoteView = {
  render: function(quotes) {
    ReactDOM.render(
      <QuoteMapApp quotes={quotes}/>,
      document.getElementById("preloaded_quotes")
    )
  }
}

export default QuoteView
