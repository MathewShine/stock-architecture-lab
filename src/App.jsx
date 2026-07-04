import { useEffect, useMemo, useState } from "react"
import { getStockBySymbol, getStocks } from "./server/stockApi"
import "./index.css"

function App() {
  // Local UI state
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true)

  // Form/local state
  const [searchText, setSearchText] = useState("")

  // Currently local state. Later we can move this to URL or Redux.
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")

  // Server state: stocks list
  const [stocks, setStocks] = useState([])
  const [isStocksLoading, setIsStocksLoading] = useState(false)
  const [stocksError, setStocksError] = useState(null)

  // Server state: selected stock details
  const [selectedStock, setSelectedStock] = useState(null)
  const [isSelectedStockLoading, setIsSelectedStockLoading] = useState(false)
  const [selectedStockError, setSelectedStockError] = useState(null)

  // Server state fetching: stock list
  useEffect(() => {
    async function loadStocks() {
      try {
        setIsStocksLoading(true)
        setStocksError(null)

        const data = await getStocks()

        setStocks(data)
      } catch (error) {
        setStocksError(error)
      } finally {
        setIsStocksLoading(false)
      }
    }

    loadStocks()
  }, [])

  // Server state fetching: selected stock
  useEffect(() => {
    async function loadSelectedStock() {
      try {
        setIsSelectedStockLoading(true)
        setSelectedStockError(null)

        const data = await getStockBySymbol(selectedSymbol)

        setSelectedStock(data)
      } catch (error) {
        setSelectedStockError(error)
      } finally {
        setIsSelectedStockLoading(false)
      }
    }

    loadSelectedStock()
  }, [selectedSymbol])

  // Derived state
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const text = searchText.toLowerCase()

      return (
        stock.symbol.toLowerCase().includes(text) ||
        stock.name.toLowerCase().includes(text)
      )
    })
  }, [stocks, searchText])

  const watchlist = ["AAPL", "MSFT"]

  // Derived state
  const watchlistCount = watchlist.length

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Stock Architecture Lab</h1>
          <p>Manual server-state fetching before React Query</p>
        </div>

        <button onClick={() => setIsWatchlistOpen((value) => !value)}>
          {isWatchlistOpen ? "Hide Watchlist" : "Show Watchlist"}
        </button>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <h2>Search Stock</h2>

          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search AAPL, MSFT..."
          />

          {isStocksLoading && <p>Loading stocks...</p>}

          {stocksError && <p className="error">{stocksError.message}</p>}

          <div className="stock-list">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                className={
                  selectedSymbol === stock.symbol ? "stock active" : "stock"
                }
                onClick={() => setSelectedSymbol(stock.symbol)}
              >
                <strong>{stock.symbol}</strong>
                <span>{stock.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="content">
          {isSelectedStockLoading && (
            <div className="card">
              <p>Loading selected stock...</p>
            </div>
          )}

          {selectedStockError && (
            <div className="card error">
              <p>{selectedStockError.message}</p>
            </div>
          )}

          {!isSelectedStockLoading && selectedStock && (
            <>
              <div className="card">
                <div className="stock-header">
                  <div>
                    <h2>
                      {selectedStock.symbol} — {selectedStock.name}
                    </h2>
                    <p>{selectedStock.sector}</p>
                  </div>

                  <div className="price">
                    <strong>£{selectedStock.price}</strong>
                    <span>{selectedStock.change}</span>
                  </div>
                </div>
              </div>

              <div className="tabs">
                <button
                  className={selectedTab === "overview" ? "active" : ""}
                  onClick={() => setSelectedTab("overview")}
                >
                  Overview
                </button>

                <button
                  className={selectedTab === "fundamentals" ? "active" : ""}
                  onClick={() => setSelectedTab("fundamentals")}
                >
                  Fundamentals
                </button>

                <button
                  className={selectedTab === "news" ? "active" : ""}
                  onClick={() => setSelectedTab("news")}
                >
                  News
                </button>
              </div>

              <div className="card">
                {selectedTab === "overview" && (
                  <div>
                    <h3>Recommendation</h3>
                    <p>{selectedStock.recommendation}</p>
                  </div>
                )}

                {selectedTab === "fundamentals" && (
                  <div>
                    <h3>Fundamentals</h3>
                    <div className="grid">
                      <p>
                        Market Cap: {selectedStock.fundamentals.marketCap}
                      </p>
                      <p>P/E Ratio: {selectedStock.fundamentals.peRatio}</p>
                      <p>EPS: {selectedStock.fundamentals.eps}</p>
                      <p>
                        Dividend Yield:{" "}
                        {selectedStock.fundamentals.dividendYield}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTab === "news" && (
                  <div>
                    <h3>Latest News</h3>
                    <ul>
                      {selectedStock.news.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {isWatchlistOpen && (
          <aside className="watchlist">
            <h2>Shine's Watchlist</h2>
            <p>Total items: {watchlistCount}</p>

            <ul>
              {watchlist.map((symbol) => (
                <li key={symbol}>{symbol}</li>
              ))}
            </ul>
          </aside>
        )}
      </main>
    </div>
  )
}

export default App