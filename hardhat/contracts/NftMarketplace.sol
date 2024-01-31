// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//what do you want to do ?
//list: list nfts on marketplace
//buy: buy nfts from marketplace
//cancel: cancel nfts from marketplace
//withdraw funds from marketplace

error NftMarketplace_PriceNotValid();
error NftMarketplace_NotApprovedForMarketPlace();
error NftMarketplace_AlreadyListed();
error NftMarketplace_NotOwner();
error NftMarketplace_NotListed();
error NftMarketplace_InsufficientEthTransfer();
error NftMarketplace_TransferFailed();

contract NftMarketPlace is ReentrancyGuard {
    //Nft address ->tokenId -> listing
    struct Listing {
        address seller;
        uint256 price;
    }
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    /////Events/////
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemCancelled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    /////Modifiers/////

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace_AlreadyListed();
        }
        _;
    }
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        //only owner of the nft can list it
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != owner) {
            revert NftMarketplace_NotOwner();
        }
        _;
    }
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace_NotListed();
        }
        _;
    }

    /////Main Functions /////
    /*
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace_PriceNotValid();
        }
        //Send the Nft to contract and make marketplace the owner but this is not gas effecienct
        //On other hand, owner holds the nft and approvs marketplace to sell it
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace_NotApprovedForMarketPlace();
        }
        s_listings[nftAddress][tokenId] = Listing({
            seller: msg.sender,
            price: price
        });
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant isListed(nftAddress, tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (msg.value < listing.price) {
            revert NftMarketplace_InsufficientEthTransfer();
        }
        s_proceeds[listing.seller] += msg.value;
        //remove listing
        delete s_listings[nftAddress][tokenId];
        IERC721 nft = IERC721(nftAddress);
        // safeTransfer just ensures that if the destination address is a contract(contract should be ERC721) that it has the ability to transfer the token again...essentially making sure that the token doesn't get locked by accident,it adds extra security
        //transfer only at the end
        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    )
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        delete s_listings[nftAddress][tokenId];
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace_PriceNotValid();
        }
        s_listings[nftAddress][tokenId].price = price;
        //reListing the nft
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function withdrawProceeds() external {
        uint256 amount = s_proceeds[msg.sender];
        if (amount <= 0) {
            revert NftMarketplace_InsufficientEthTransfer();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) {
            revert NftMarketplace_TransferFailed();
        }
    }

    /////View Functions /////
    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address owner) external view returns (uint256) {
        return s_proceeds[owner];
    }
}
