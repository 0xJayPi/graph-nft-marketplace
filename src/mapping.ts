import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import {ItemListed, ActiveItem, ItemBought, ItemCanceled} from "../generated/schema" // These classes are generated when the graph is initialized (from the contract abi)

/** Active Item is being handled by the buyer addres
 * empty = available for buying
 * Dead Address = canceled
 * real addres = bought
 */

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if (!itemBought){
    itemBought = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemBought.buyer = event.params.seller
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId

  activeItem!.buyer = event.params.seller  

  itemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemCanceled){
    itemCanceled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemCanceled.seller = event.params.buyer
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId

  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD") // the Dead Address

  itemCanceled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if (!itemListed){
    itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }
  if (!activeItem){
    activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller
  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress
  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId
  itemListed.price = event.params.price
  activeItem.price = event.params.price

  itemListed.save()
  activeItem.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}