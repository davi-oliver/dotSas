export interface Participant {
    id: string
    name: string
    email: string
    avatar?: string
    isCurrentUser?: boolean
  }
  
  export interface Meeting {
    id: string
    title: string
    description?: string
    startTime: Date
    endTime: Date
    location?: string
    meetingUrl?: string
    type: "internal" | "external" | "personal"
    status: "scheduled" | "cancelled" | "completed"
    recurrence?: "none" | "daily" | "weekly" | "monthly"
    organizer: Participant
    participants: Participant[]
  }
  
  