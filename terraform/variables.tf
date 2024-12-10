variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "asia-northeast1"
}

variable "current_user_email" {
  type    = string
}

variable "function_name" {
  type        = string
  default     = "scheduler-task"
}

variable "function_runtime" {
  type        = string
  default     = "nodejs18"
  description = "Cloud Functionのランタイム環境"
}

variable "function_memory_mb" {
  type        = number
  default     = 128
  description = "Cloud Functionに割り当てるメモリ量（MB）"
}

variable "function_description" {
  type        = string
  default     = "Function to execute a task from Cloud Storage."
}

variable "scheduler_cron" {
  type        = string
#   default     = "*/3 * * * *"
  default     = "0 0 1 1 *"
  description = "Cloud SchedulerジョブのCron形式のスケジュール"
}

variable "scheduler_time_zone" {
  type        = string
  default     = "Asia/Tokyo"
}