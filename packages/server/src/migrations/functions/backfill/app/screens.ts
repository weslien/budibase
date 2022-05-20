import { events, db } from "@budibase/backend-core"
import { getScreenParams } from "../../../../db/utils"
import { Screen } from "@budibase/types"

const getScreens = async (appDb: any): Promise<Screen[]> => {
  const response = await appDb.allDocs(
    getScreenParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any) => {
  if (db.isDevAppID(appDb.name)) {
    const screens = await getScreens(appDb)

    for (const screen of screens) {
      events.screen.created(screen)
    }
  }
}
