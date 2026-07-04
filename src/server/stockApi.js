import { stocks } from "../data/stocks"

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getStocks() {
  await wait(500)

  return stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector
  }))
}

export async function getStockBySymbol(symbol) {
  await wait(700)

  const stock = stocks.find((item) => item.symbol === symbol)

  if (!stock) {
    throw new Error(`Stock not found for symbol: ${symbol}`)
  }

  return stock
}

export async function getStockFundamentals(symbol) {
  await wait(700)

  const stock = stocks.find((item) => item.symbol === symbol)

  if (!stock) {
    throw new Error(`Fundamentals not found for symbol: ${symbol}`)
  }

  return {
    symbol: stock.symbol,
    name: stock.name,
    fundamentals: stock.fundamentals
  }
}

export async function getStockNews(symbol) {
  await wait(700)

  const stock = stocks.find((item) => item.symbol === symbol)

  if (!stock) {
    throw new Error(`News not found for symbol: ${symbol}`)
  }

  return {
    symbol: stock.symbol,
    news: stock.news
  }
}

export async function getStockPrice(symbol) {
  await wait(500)

  const stock = stocks.find((item) => item.symbol === symbol)

  if (!stock) {
    throw new Error(`Price not found for symbol: ${symbol}`)
  }

  const randomMovement = Number((Math.random() * 2 - 1).toFixed(2))

  return {
    symbol: stock.symbol,
    price: Number((stock.price + randomMovement).toFixed(2)),
    change: randomMovement >= 0 ? `+${randomMovement}%` : `${randomMovement}%`
  }
}