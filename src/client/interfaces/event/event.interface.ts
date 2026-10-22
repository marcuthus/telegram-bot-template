import * as telegraf from "telegraf"

import { EventType } from "../../../enums"

type RunFunc = (context: telegraf.Context) => Promise<void>

export interface Event {
    name: telegraf.Types.UpdateType
    type: EventType | `${EventType}`
    run: RunFunc
}
