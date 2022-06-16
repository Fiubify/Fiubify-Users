const axios = require("axios")

const createUserWallet = async () => {
  const response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallets/", {})
  return response.data.address
}

module.exports = createUserWallet
