# EthStarter
_Built with Next.js, web3, Ant Design, Express, Solidity, Truffle and tested with Mocha + node's native assert() module_

Decentralized KickStarter-like project. It allows people with project ideas to create campaigns, and for contributors to fund the projects. The difference between it and your classic crowdfunding platform is that the funds will be stored in a smart contract : 
They will only be released to the supplier after a request has been made by the product owner, and more than 50% of backers have agreed to that expense. No more wild cashing out of funds !



## Hey there 

If you're reading this, you are probably a developer, CTO, or recruiter that was checking my projects. Hello ! I am sure you have a few questions in mind and I am here to answer them :

  - **Why Next.JS ?**

  SSR solves the SEO and performances issues of SPAs. Next.JS is an opinionated React framework. Think of it as a slightly more opinionated create-react-app. Ain't nobody have time for webpack config.

  - **Why Ethereum / Solidity ?**

  I strongly believe that dApps, may they be on Ethereum or any other ecosystem(Stellar, for example) are the future. Plus, smart contracts are a whole new way of thinking, as a developer. 

  - **Why are you using a campaign factory instead of deploying a campaign directly ?**

  We want to be able to run multiple campaigns concurrently, and also for users to pay for deployment, not us. 
  This way, our `CampaignFactory` contract will actually be responsible for creating `Campaign` contracts. 
  It will make us able to keep track of all the currently running campaigns

  - **Do I need Metamask ?**

  Well, yes and no. In reality, you need any browser with web3 capabilities. That is, a browser with Metamask plugin, Brave browser (which has built-in Metamask), or Cipher/Status on mobile,for example. On desktop, Metmask is the de-facto option, even though there are other solutions currently being developed.




## Requirements / Getting started 

- Metamask installed and set on Rinkeby testnet with some Eth in your address (https://faucet.rinkeby.io/ will provide you with some) :
Mneumonic is needed for the deployment of the contract, so keep it ! 
_Any web3 enabled browser will do as well, such as Cipher or Status.im on mobile_
- An Infura endpoint URL (https://infura.io/)
- Node.js >= 7.6 for the async/await magic
- Rename `config.example.js` to `config.js` with an Infura Rinkeby endpoint URL, and your metamask mneumonic(seedphrase)

## Frontend

- Run either `yarn compile` or `npm run compile`to compile both the campaign and campaign factory
- Run either `yarn deploy` or `npm run deploy` or to deploy an instance of the factory to Rinkeby
- Run either `yarn dev` or `npm run dev` and voilà !

## Contract Testing

e2e/unit tests are included :

- To run the unit tests, cd into the project folder and run `yarn test --recursive ethereum/test/unit`
- To run the end-to-end tests, cd into the project folder and run `yarn test --recursive ethereum/test/e2e`

## Using the smart contract on Remix (Advanced)

- Copy and paste the content from 'Campaign.sol' in Remix and click on 'Create' to deploy it (make sure to select "Injected Web3" as provider)
- Call the "deployCampaign" method, with the minimum amount of Wei required for said campaign
- Call the "getDeployedCampaigns" method, copy the address, and load the Campaign from address
- Voilà ! Magic happens, CampaignFactory contract has deployed a Campaign contract, that you can now use

## Contract Methods 

- **deployCampaign(uint mimimum)**

Deploys one campaign from a factory, takes the mimimum contribution amount of campaign as arg

- **createRequest(string description, uint value, address recipient)**

Creates one request. Takes the request info as argument. 
_msg.sender needs to be the campaign manager_

- **contribute() payable**

Contribute to the campaign. Payable, wei needs to be greater than the minimum contribution for this campaign.

- **approveRequest(uint index)**

Approves one request, takes request index as argument. 
_msg.sender needs to be an approver, i.e has contributed_

- **finalizeRequest(uint index)**

Finalizes one request, takes request index as argument. 
A minimum of 50% of approvals is required or the method will throw
_msg.sender needs to be the campaign manager_ 

