import { EventEmitter } from 'events'

export type State = 'idle' | 'working' | 'moving' | 'blocked'
export const VALID_STATES: State[] = ['idle', 'working', 'moving', 'blocked']

export interface StateTransition {
  from: State
  to: State
  agentId?: string
}

export class StateMachine extends EventEmitter {
  private _state: State = 'idle'
  readonly agentId: string

  constructor(agentId: string) {
    super()
    this.agentId = agentId
  }

  get state(): State {
    return this._state
  }

  transition(newState: State): boolean {
    if (newState === this._state) {
      throw new Error(`State machine is already in state: ${newState}`)
    }

    if (!this.isValidTransition(newState)) {
      throw new Error(`Invalid transition: ${this._state} -> ${newState}`)
    }

    const oldState = this._state
    this._state = newState
    
    this.emit('state-change', {
      agentId: this.agentId,
      from: oldState,
      to: newState
    })
    
    return true
  }

  recover(): void {
    if (this._state === 'blocked') {
      const oldState = this._state
      this._state = 'idle'
      this.emit('state-change', {
        agentId: this.agentId,
        from: oldState,
        to: 'idle'
      })
    }
  }

  private isValidTransition(newState: State): boolean {
    if (this._state === 'blocked' && newState !== 'idle') {
      return false
    }
    return true
  }
}
