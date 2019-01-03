const paths = {
  income: (account, { from, to }) => `https://${account}.myvtex.com/api/storedash/${account}/metrics/storedash/sessioncube?operation=sum&from=${from}&to=${to}&fields=count,data.orders&interval=1h`,
  ordersPlaced: (account, { from, to }) => `https://${account}.myvtex.com/api/storedash/${account}/metrics/storedash/orderplaced?from=${from}&to=${to}&interval=1h&operation=sum&fields=count,sum`,
  sessions: (account, { from, to }) => `https://${account}.myvtex.com/api/storedash/${account}/metrics/storedash/sessions?from=${from}&to=${to}&interval=1h&operation=sum`,
}

export default paths
