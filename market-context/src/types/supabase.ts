export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export type VoteChoice = 'yes' | 'no' | 'unsure'

export interface EventVote {
  id: string
  event_id: string
  user_id: string
  choice: VoteChoice
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id: string
        }
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      event_votes: {
        Row: EventVote
        Insert: Omit<EventVote, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
        }
        Update: Partial<Omit<EventVote, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
