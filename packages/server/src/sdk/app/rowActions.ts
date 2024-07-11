import { context, utils } from "@budibase/backend-core"

import { generateRowActionsID } from "../../db/utils"
import {
  SEPARATOR,
  TableRowActions,
  VirtualDocumentType,
} from "@budibase/types"

export async function create(tableId: string, rowAction: { name: string }) {
  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  let doc: TableRowActions
  try {
    doc = await db.get<TableRowActions>(rowActionsId)
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }

    doc = { _id: rowActionsId, actions: {} }
  }

  const newId = `${VirtualDocumentType.ROW_ACTION}${SEPARATOR}${utils.newid()}`
  doc.actions[newId] = rowAction
  await db.put(doc)

  return {
    id: newId,
    ...rowAction,
  }
}

export async function get(tableId: string) {
  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  return await db.get<TableRowActions>(rowActionsId)
}

export async function docExists(tableId: string) {
  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  const result = await db.exists(rowActionsId)
  return result
}
