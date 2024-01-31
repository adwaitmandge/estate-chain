import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketPlace/NftMarketPlace";
import {
  ItemBought,
  ItemCancelled,
  ItemListed,
  ActiveItem,
} from "../generated/schema";

//whenevre ItemBought occures ,this fx will be called
export function handleItemBought(event: ItemBoughtEvent): void {
  //what to do ?
  //save that event in graph
  //update our activeitems
  //we get raw event and we convert it into ItemBought object
  //we save ItemBought object in graph that is generated whose schema is defined in thegraph/generated/schema.ts
  //we identify every item by its id
  let itemBought = ItemBought.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEvent(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  // update active item
  activeItem!.buyer = event.params.buyer;
  //! means we are sure that activeItem is not null
  itemBought.save();
  activeItem!.save();
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCancelled = ItemCancelled.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCancelled) {
    itemCancelled = new ItemCancelled(
      getIdFromEvent(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCancelled.seller = event.params.seller;
  itemCancelled.nftAddress = event.params.nftAddress;
  itemCancelled.tokenId = event.params.tokenId;
  //to check if the item has been cancelled
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000EaD"
  );
  itemCancelled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  // active item will inly be present when updat lisitng is called
  let activeItem = ActiveItem.load(
    getIdFromEvent(event.params.tokenId, event.params.nftAddress)
  );
  //check if the object is already present in graph
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEvent(event.params.tokenId, event.params.nftAddress)
    );
  }
  //as we are lsiting the item it will nit be present in active item
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEvent(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;
  activeItem.price = event.params.price;
  //when we list the item that means it is not bought by anyone
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  // update active item

  itemListed.save();
  activeItem.save();
}

function getIdFromEvent(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
