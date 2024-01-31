const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft Marketplace Unit Tests", function () {
      let nftMarketplace, basiNft, player;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;
      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        player = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NftMarketPlace");
        basicNft = await ethers.getContract("BasicNft");
        basicNft.mintNft();
        // deployer mints nft and approves marketplace to sell it
        await basicNft.approve(nftMarketplace.address, TOKEN_ID);
      });
      describe("listItem", () => {
        it("Reverts if the item is already listed", async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.reverted;
        });
        it("Reverts if the caller is not the owner of the item", async () => {
          await expect(
            nftMarketplace
              .connect(player)
              .listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.reverted;
        });
        it("Reverts if set invalid price", async () => {
          await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, 0))
            .to.be.reverted;
        });
        it("approval needed for listing", async () => {
          await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID);
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.reverted;
        });
      });
      describe("cancelListing", () => {
        it("Reverts if the item is not listed", async () => {
          await expect(nftMarketplace.cancelListing(basicNft.address, 1)).to.be
            .reverted;
        });
        it("Reverts if the caller is not the owner of the item", async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace
              .connect(player)
              .cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.reverted;
        });
        it("removes and emits event", async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.emit(nftMarketplace, "ItemCancelled");
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert.equal(listing.price.toString(), 0);
        });
      });
      describe("buyItem", function () {
        it("reverts if the item isnt listed", async function () {
          await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID)).to.be
            .reverted;
        });
        it("reverts if the price isnt met", async function () {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID)).to.be
            .reverted;
        });
        it("transfers the nft to the buyer and updates internal proceeds record", async function () {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplace.connect(player);
          expect(
            await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
              value: PRICE,
            })
          ).to.emit("ItemBought");
          const newOwner = await basicNft.ownerOf(TOKEN_ID);
          const deployerProceeds = await nftMarketplace.getProceeds(
            deployer.address
          );
          assert(newOwner.toString() == player.address);
          assert(deployerProceeds.toString() == PRICE.toString());
        });
      });
      describe("updateListing", function () {
        it("must be owner and listed", async function () {
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.reverted;
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplace.connect(player);
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith("NotOwner");
        });
        it("reverts if new price is 0", async function () {
          const updatedPrice = ethers.utils.parseEther("0");
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace.updateListing(
              basicNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.be.reverted;
        });
        it("updates the price of the item", async function () {
          const updatedPrice = ethers.utils.parseEther("0.2");
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          expect(
            await nftMarketplace.updateListing(
              basicNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.emit("ItemListed");
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert(listing.price.toString() == updatedPrice.toString());
        });
      });
      describe("withdrawProceeds", function () {
        it("doesn't allow 0 proceed withdrawls", async function () {
          await expect(nftMarketplace.withdrawProceeds()).to.be.reverted;
        });
        it("withdraws proceeds", async function () {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplace.connect(player);
          await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplace.connect(deployer);

          const deployerProceedsBefore = await nftMarketplace.getProceeds(
            deployer.address
          );
          const deployerBalanceBefore = await deployer.getBalance();
          const txResponse = await nftMarketplace.withdrawProceeds();
          const transactionReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const deployerBalanceAfter = await deployer.getBalance();

          assert(
            deployerBalanceAfter.add(gasCost).toString() ==
              deployerProceedsBefore.add(deployerBalanceBefore).toString()
          );
        });
      });
    });
