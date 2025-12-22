export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}

export interface Task {
    title: string
    description?: string
    date_at?: string
    time_at?: string
    priority: Priority
}