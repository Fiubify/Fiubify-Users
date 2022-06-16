const axios = require("axios")

const createUserWallet = async () => {
  var response
  try {
    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallet/", {})
  } catch (error) {
    console.log(`${error}`)
    return
  }

  console.log(response.data)
  return response.data.address
}

module.exports = {createUserWallet}
