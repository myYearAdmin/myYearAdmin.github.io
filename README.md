## PTHospital

### 
PTHospital is a Dapp deployed on Nebulas testnet.
It could store/search black hospital in China called PT hospital and you could find data in [Hospital](https://github.com/langhua9527/Hospital).
The data will store in block chain so no one could remove or modify data directly.

### Dapp Structure
#### Smart contract
The source code of Super Dictionary smart contract is [`pthospital.js`](smartContract/pthospital.js). And the contract address after deployed on testnet is `n1p12u4ngXec2MkrDZAncGPL3GmPGbRaBrf`.
PTHospital is a simple smart contract that stores and gets key/value  pairs. It has two functions for Dapp user to use: 
* `save(url, name, evidence)` to save a hospital entry with web site url, name and evidence.
* `get(url)` to search the value of a given key. If this entry doesn't exits, then you can create this entry.
It is recommend to use web site url as key of entry actually it did not validate url format but you need to make sure key is unique.

#### Web page of Dapp
After the smart contract of our Dapp is deployed, we need to develop a web page or App for user to interact with it. The webpage of Super Dictionary is [`index.html`](https://myyearadmin.github.io/). 

We use [NebPay SDK](https://github.com/nebulasio/nebPay) as our payment interface, and Dapp user need to install chrome extension [WebExtensionWallet](https://github.com/ChengOrangeJu/WebExtensionWallet)(on PC) or [NAS Nano](https://blog.nebulas.io/2018/05/10/announcement-of-official-app/) wallet app(on mobile) to complete the transactions initiated by Dapp.


Now we explain how to call smart contract functions `save` and `get` in Dapp html file.

Since the function `get` is just used to search results, we don't need to send transactions. Here we use API [`call`](https://github.com/nebulasio/neb.js/blob/master/docs/API.html) of [neb.js](https://github.com/nebulasio/neb.js) to get the return values of function `get`. 

And to store dictionary entries with function `save`, we need to send transactions. Here we use NebPay to send transactions. To learn how to use nebpay in Dapp, please refer to Nebpay documents "[Introduction of NebPay SDK](https://github.com/nebulasio/nebPay/blob/master/doc/NebPay_Introduction.md)"
