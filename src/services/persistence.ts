import type { GameState, ScoreReport } from '../engine/types'

const DATABASE = 'vale-rescue-local'
const STORE = 'records'
const CHECKPOINT = 'active-checkpoint'

type RecordValue = { key: string; value: unknown; updatedAt: number }

const openDatabase = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(DATABASE, 1)
  request.onerror = () => reject(request.error)
  request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'key' })
  request.onsuccess = () => resolve(request.result)
})

const put = async (key: string, value: unknown) => {
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readwrite')
    transaction.objectStore(STORE).put({ key, value, updatedAt: Date.now() } satisfies RecordValue)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
  database.close()
}

const get = async <T,>(key: string): Promise<T | null> => {
  const database = await openDatabase()
  const value = await new Promise<T | null>((resolve, reject) => {
    const request = database.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    request.onsuccess = () => resolve((request.result as RecordValue | undefined)?.value as T ?? null)
    request.onerror = () => reject(request.error)
  })
  database.close()
  return value
}

export const saveCheckpoint = (state: GameState) => put(CHECKPOINT, state)
export const loadCheckpoint = () => get<GameState>(CHECKPOINT)
export const clearCheckpoint = () => put(CHECKPOINT, null)

export const saveReport = async (state: GameState, report: ScoreReport) => {
  const current = await get<Array<{ state: GameState; report: ScoreReport }>>('history') ?? []
  await put('history', [{ state, report }, ...current].slice(0, 20))
}

export const loadHistory = () => get<Array<{ state: GameState; report: ScoreReport }>>('history')
